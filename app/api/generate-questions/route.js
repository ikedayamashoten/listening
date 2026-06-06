// 問題を自動生成するAPI（Gemini版）
import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const maxDuration = 60;

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
    const topic = (body.topic || "").trim();
    const level = body.level || "B1";
    const numSpeakers = Math.max(1, Math.min(5, Number(body.numSpeakers) || 2));
    const numQuestions = Math.max(1, Math.min(10, Number(body.numQuestions) || 3));

    if (!topic) {
      return NextResponse.json({ error: "トピックを入力してください。" }, { status: 400 });
    }

    const speakerNote =
      numSpeakers === 1
        ? "1人による説明文（モノローグ）形式にしてください。"
        : `${numSpeakers}人による自然な会話形式にしてください。話者は Speaker A, Speaker B... のように区別してください。`;

    const prompt = `あなたは英語のリスニング問題を作る専門家です。
トピック「${topic}」について、CEFRレベル ${level} の英語リスニング問題を作成してください。
CEFRレベル ${level} に合わせて、語彙の難易度・文の長さ・話す速さの想定を調整してください。
${speakerNote}
設問は${numQuestions}問、4択の選択式にしてください。

必ず次のJSON形式のみで出力してください。前置きや説明、Markdownのコードフェンス(\`\`\`)は一切付けないでください。
{
  "title": "問題のタイトル(日本語)",
  "script": [
    { "speaker": "Speaker A", "text": "英文のセリフ" },
    { "speaker": "Speaker B", "text": "英文のセリフ" }
  ],
  "questions": [
    {
      "question": "設問文(英語)",
      "choices": ["選択肢1", "選択肢2", "選択肢3", "選択肢4"],
      "answerIndex": 0,
      "explanation": "正解の解説(日本語)"
    }
  ]
}`;

    const model = "gemini-2.5-flash";
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`;

    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-goog-api-key": apiKey,
      },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0.7,
          responseMimeType: "application/json",
        },
      }),
    });

    if (!res.ok) {
      const errText = await res.text();
      return NextResponse.json(
        { error: "問題生成に失敗しました: " + errText },
        { status: 500 }
      );
    }

    const data = await res.json();
    let content = data?.candidates?.[0]?.content?.parts?.[0]?.text || "";
    content = content.replace(/```json/g, "").replace(/```/g, "").trim();

    let parsed;
    try {
      parsed = JSON.parse(content);
    } catch (e) {
      return NextResponse.json(
        { error: "AIの応答を読み取れませんでした。もう一度お試しください。" },
        { status: 500 }
      );
    }

    return NextResponse.json(parsed);
  } catch (err) {
    return NextResponse.json({ error: "エラー: " + String(err) }, { status: 500 });
  }
}
