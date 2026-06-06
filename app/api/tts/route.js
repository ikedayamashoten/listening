// 1つのセリフを音声に変換するAPI（Gemini TTS版）
// GeminiはPCM(WAV)を返すので、WAVヘッダを付けて返します
import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const maxDuration = 60;

// 速度スライダーの数値を、Geminiが理解できる言葉に変換
function speedToWords(speed) {
  const s = Number(speed) || 1.0;
  if (s <= 0.5) return "very slowly, at a relaxed and clear pace";
  if (s <= 0.8) return "slowly and clearly";
  if (s < 1.2) return "at a natural, normal pace";
  if (s < 2.0) return "at a brisk, slightly fast pace";
  return "very fast";
}

// PCM(16bit/24kHz/mono)データにWAVヘッダを付けてWAVバイト列にする
function pcmToWav(pcmBuffer, sampleRate = 24000, channels = 1, bitsPerSample = 16) {
  const byteRate = (sampleRate * channels * bitsPerSample) / 8;
  const blockAlign = (channels * bitsPerSample) / 8;
  const dataSize = pcmBuffer.length;
  const buffer = Buffer.alloc(44 + dataSize);

  buffer.write("RIFF", 0);
  buffer.writeUInt32LE(36 + dataSize, 4);
  buffer.write("WAVE", 8);
  buffer.write("fmt ", 12);
  buffer.writeUInt32LE(16, 16);
  buffer.writeUInt16LE(1, 20); // PCM
  buffer.writeUInt16LE(channels, 22);
  buffer.writeUInt32LE(sampleRate, 24);
  buffer.writeUInt32LE(byteRate, 28);
  buffer.writeUInt16LE(blockAlign, 32);
  buffer.writeUInt16LE(bitsPerSample, 34);
  buffer.write("data", 36);
  buffer.writeUInt32LE(dataSize, 40);
  pcmBuffer.copy(buffer, 44);

  return buffer;
}

export async function POST(request) {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "サーバーにAPIキー(GEMINI_API_KEY)が設定されていません。" },
        { status: 500 }
      );
    }

    const body = await request.json();
    const text = (body.text || "").trim();
    const voice = body.voice || "Kore";
    const accent = (body.accent || "").trim(); // 例: "American English accent"
    const speed = body.speed || 1.0;

    if (!text) {
      return NextResponse.json({ error: "テキストが空です。" }, { status: 400 });
    }

    // Geminiへの指示文（プレビュー版の誤作動を防ぐため、合成指示を明示）
    let directions = `Read the following transcript aloud as a natural English listening-test recording. Speak ${speedToWords(
      speed
    )}.`;
    if (accent) {
      directions += ` Accent: ${accent}.`;
    }
    const prompt = `${directions}\n\nTranscript:\n${text}`;

    const model = "gemini-2.5-flash-preview-tts";
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`;

    // プレビュー版はランダムに500を返すことがあるので最大3回リトライ
    let lastErr = "";
    for (let attempt = 0; attempt < 3; attempt++) {
      const res = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-goog-api-key": apiKey,
        },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: {
            responseModalities: ["AUDIO"],
            speechConfig: {
              voiceConfig: {
                prebuiltVoiceConfig: { voiceName: voice },
              },
            },
          },
        }),
      });

      if (res.ok) {
        const data = await res.json();
        const part = data?.candidates?.[0]?.content?.parts?.[0];
        const b64 = part?.inlineData?.data;
        if (!b64) {
          lastErr = "音声データが返りませんでした。";
          continue; // リトライ
        }
        const pcm = Buffer.from(b64, "base64");
        const wav = pcmToWav(pcm);
        return new NextResponse(wav, {
          status: 200,
          headers: { "Content-Type": "audio/wav" },
        });
      }

      lastErr = await res.text();
      if (res.status < 500) break;
    }

    return NextResponse.json(
      { error: "音声生成に失敗しました: " + lastErr },
      { status: 500 }
    );
  } catch (err) {
    return NextResponse.json({ error: "エラー: " + String(err) }, { status: 500 });
  }
}
