"use client";

import { useState } from "react";
import "./globals.css";

// 利用できる声の一覧（Gemini TTSの30種類）
// id: Geminiの音声名 / desc: 特徴（日本語）
const VOICES = [
  { id: "Zephyr", desc: "明るい" },
  { id: "Puck", desc: "快活" },
  { id: "Charon", desc: "落ち着いた・説明向き" },
  { id: "Kore", desc: "しっかりした" },
  { id: "Fenrir", desc: "元気で活発" },
  { id: "Leda", desc: "若々しい" },
  { id: "Orus", desc: "しっかりした" },
  { id: "Aoede", desc: "軽やか" },
  { id: "Callirrhoe", desc: "おだやか" },
  { id: "Autonoe", desc: "明るい" },
  { id: "Enceladus", desc: "息づかいのある" },
  { id: "Iapetus", desc: "クリア" },
  { id: "Umbriel", desc: "おだやか" },
  { id: "Algieba", desc: "なめらか" },
  { id: "Despina", desc: "なめらか" },
  { id: "Erinome", desc: "クリア" },
  { id: "Algenib", desc: "かすれ気味" },
  { id: "Rasalgethi", desc: "説明向き" },
  { id: "Laomedeia", desc: "快活" },
  { id: "Achernar", desc: "やわらかい" },
  { id: "Alnilam", desc: "しっかりした" },
  { id: "Schedar", desc: "落ち着いた" },
  { id: "Gacrux", desc: "大人っぽい" },
  { id: "Pulcherrima", desc: "前向き" },
  { id: "Achird", desc: "親しみやすい" },
  { id: "Zubenelgenubi", desc: "カジュアル" },
  { id: "Vindemiatrix", desc: "やさしい" },
  { id: "Sadachbia", desc: "いきいき" },
  { id: "Sadaltager", desc: "知的" },
  { id: "Sulafat", desc: "あたたかい" },
];

// アクセントの選択肢（GeminiにはプロンプトのlabelEnを渡す）
const ACCENTS = [
  { id: "us", ja: "アメリカ英語", labelEn: "General American English accent" },
  { id: "uk", ja: "イギリス英語", labelEn: "British English (Received Pronunciation) accent" },
  { id: "au", ja: "オーストラリア英語", labelEn: "Australian English accent" },
  { id: "in", ja: "インド英語", labelEn: "Indian English accent" },
  { id: "ca", ja: "カナダ英語", labelEn: "Canadian English accent" },
  { id: "ie", ja: "アイルランド英語", labelEn: "Irish English accent" },
  { id: "sg", ja: "シンガポール英語", labelEn: "Singaporean English accent" },
  { id: "za", ja: "南アフリカ英語", labelEn: "South African English accent" },
  { id: "none", ja: "指定なし（標準）", labelEn: "" },
];

function voiceLabel(v) {
  return `${v.id}（${v.desc}）`;
}
function accentLabelEn(accentId) {
  const a = ACCENTS.find((x) => x.id === accentId);
  return a ? a.labelEn : "";
}

// 声とアクセントを選ぶ部品
function VoicePicker({ voice, accent, onChangeVoice, onChangeAccent }) {
  return (
    <div className="voice-picker">
      <div className="vp-field">
        <span className="vp-mini-label">声</span>
        <select value={voice} onChange={(e) => onChangeVoice(e.target.value)}>
          {VOICES.map((v) => (
            <option key={v.id} value={v.id}>
              {voiceLabel(v)}
            </option>
          ))}
        </select>
      </div>
      <div className="vp-field">
        <span className="vp-mini-label">アクセント</span>
        <select value={accent} onChange={(e) => onChangeAccent(e.target.value)}>
          {ACCENTS.map((a) => (
            <option key={a.id} value={a.id}>
              {a.ja}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}

const SPEAKER_NAMES = ["Speaker A", "Speaker B", "Speaker C", "Speaker D", "Speaker E"];

export default function Home() {
  const [mode, setMode] = useState("ai"); // "ai" または "manual"
  const [numSpeakers, setNumSpeakers] = useState(2);

  // AIモード用
  const [topic, setTopic] = useState("");
  const [level, setLevel] = useState("B1");
  const [numQuestions, setNumQuestions] = useState(3);

  // 手動モード用：各セリフ { voice, accent, text, speed }
  const [manualLines, setManualLines] = useState([
    { voice: "Leda", accent: "us", text: "", speed: 1.0 },
    { voice: "Charon", accent: "us", text: "", speed: 1.0 },
  ]);

  // 話者ごとの声の割り当て（AIモード用）
  const [voiceMap, setVoiceMap] = useState({
    "Speaker A": "Leda",
    "Speaker B": "Charon",
    "Speaker C": "Puck",
    "Speaker D": "Aoede",
    "Speaker E": "Kore",
  });

  // 話者ごとのアクセント（AIモード用）
  const [accentMap, setAccentMap] = useState({
    "Speaker A": "us",
    "Speaker B": "us",
    "Speaker C": "us",
    "Speaker D": "us",
    "Speaker E": "us",
  });

  // 話者ごとの速度（AIモード用）
  const [speedMap, setSpeedMap] = useState({
    "Speaker A": 1.0,
    "Speaker B": 1.0,
    "Speaker C": 1.0,
    "Speaker D": 1.0,
    "Speaker E": 1.0,
  });

  const [loading, setLoading] = useState(false);
  const [statusText, setStatusText] = useState("");
  const [error, setError] = useState("");

  const [result, setResult] = useState(null); // { title, script, questions }
  const [audioUrl, setAudioUrl] = useState("");
  const [showAnswers, setShowAnswers] = useState(false);

  // ===== 話者人数の変更（手動モード） =====
  function addLine() {
    if (manualLines.length >= 12) return;
    const idx = manualLines.length % numSpeakers;
    setManualLines([...manualLines, { voice: VOICES[idx % VOICES.length].id, accent: "us", text: "", speed: 1.0 }]);
  }
  function removeLine(i) {
    setManualLines(manualLines.filter((_, idx) => idx !== i));
  }
  function updateLine(i, key, val) {
    const copy = [...manualLines];
    copy[i] = { ...copy[i], [key]: val };
    setManualLines(copy);
  }

  function updateVoiceMap(speaker, voice) {
    setVoiceMap({ ...voiceMap, [speaker]: voice });
  }

  function updateAccentMap(speaker, accent) {
    setAccentMap({ ...accentMap, [speaker]: accent });
  }

  function updateSpeedMap(speaker, sp) {
    setSpeedMap({ ...speedMap, [speaker]: sp });
  }

  // ===== 生成結果（台本・設問）の編集 =====
  function updateTitle(val) {
    setResult({ ...result, title: val });
  }
  function updateScriptLine(i, val) {
    const script = result.script.map((l, idx) =>
      idx === i ? { ...l, text: val } : l
    );
    setResult({ ...result, script });
  }
  function updateScriptSpeaker(i, val) {
    const script = result.script.map((l, idx) =>
      idx === i ? { ...l, speaker: val } : l
    );
    setResult({ ...result, script });
  }
  function addScriptLine() {
    const speaker = SPEAKER_NAMES[0];
    setResult({
      ...result,
      script: [...result.script, { speaker, text: "" }],
    });
  }
  function removeScriptLine(i) {
    setResult({ ...result, script: result.script.filter((_, idx) => idx !== i) });
  }
  function updateQuestion(qi, key, val) {
    const questions = result.questions.map((q, idx) =>
      idx === qi ? { ...q, [key]: val } : q
    );
    setResult({ ...result, questions });
  }
  function updateChoice(qi, ci, val) {
    const questions = result.questions.map((q, idx) => {
      if (idx !== qi) return q;
      const choices = q.choices.map((c, cidx) => (cidx === ci ? val : c));
      return { ...q, choices };
    });
    setResult({ ...result, questions });
  }
  function addQuestion() {
    setResult({
      ...result,
      questions: [
        ...result.questions,
        { question: "", choices: ["", "", "", ""], answerIndex: 0, explanation: "" },
      ],
    });
  }
  function removeQuestion(qi) {
    setResult({ ...result, questions: result.questions.filter((_, idx) => idx !== qi) });
  }

  // ===== AIで問題を生成 =====
  async function handleGenerateQuestions() {
    setError("");
    setResult(null);
    setAudioUrl("");
    setShowAnswers(false);
    if (!topic.trim()) {
      setError("トピックを入力してください。");
      return;
    }
    setLoading(true);
    setStatusText("AIが問題を作成しています…");
    try {
      const res = await fetch("/api/generate-questions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic, level, numSpeakers, numQuestions }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "生成に失敗しました。");
      setResult(data);
      setStatusText("");
    } catch (e) {
      setError(String(e.message || e));
    } finally {
      setLoading(false);
    }
  }

  // ===== 1つのセリフを音声化して ArrayBuffer(WAV) を返す =====
  async function ttsOne(text, voice, accent, lineSpeed) {
    const res = await fetch("/api/tts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        text,
        voice,
        accent: accentLabelEn(accent),
        speed: lineSpeed || 1.0,
      }),
    });
    if (!res.ok) {
      let msg = "音声生成に失敗しました。";
      try {
        const j = await res.json();
        msg = j.error || msg;
      } catch (_) {}
      throw new Error(msg);
    }
    return await res.arrayBuffer();
  }

  // ===== 複数のWAV音声を1つのWAVにつなげる =====
  // 各WAVは先頭44バイトがヘッダ。中身(PCM)だけ取り出して結合し、新しいヘッダを付け直します。
  function combineWavBuffers(buffers) {
    const HEADER = 44;
    const pcmParts = buffers.map((b) => new Uint8Array(b).subarray(HEADER));
    const totalPcm = pcmParts.reduce((sum, p) => sum + p.length, 0);

    const sampleRate = 24000;
    const channels = 1;
    const bitsPerSample = 16;
    const byteRate = (sampleRate * channels * bitsPerSample) / 8;
    const blockAlign = (channels * bitsPerSample) / 8;

    const out = new Uint8Array(HEADER + totalPcm);
    const dv = new DataView(out.buffer);
    function writeStr(off, s) {
      for (let i = 0; i < s.length; i++) out[off + i] = s.charCodeAt(i);
    }
    writeStr(0, "RIFF");
    dv.setUint32(4, 36 + totalPcm, true);
    writeStr(8, "WAVE");
    writeStr(12, "fmt ");
    dv.setUint32(16, 16, true);
    dv.setUint16(20, 1, true);
    dv.setUint16(22, channels, true);
    dv.setUint32(24, sampleRate, true);
    dv.setUint32(28, byteRate, true);
    dv.setUint16(32, blockAlign, true);
    dv.setUint16(34, bitsPerSample, true);
    writeStr(36, "data");
    dv.setUint32(40, totalPcm, true);

    let offset = HEADER;
    for (const p of pcmParts) {
      out.set(p, offset);
      offset += p.length;
    }
    return new Blob([out], { type: "audio/wav" });
  }

  // ===== 音声を生成（AIモード：resultのscriptを使う） =====
  async function handleGenerateAudioFromResult() {
    if (!result || !result.script) return;
    setError("");
    setAudioUrl("");
    setLoading(true);
    try {
      const buffers = [];
      const lines = result.script;
      for (let i = 0; i < lines.length; i++) {
        setStatusText(`音声を生成中… (${i + 1} / ${lines.length})`);
        const sp = lines[i].speaker;
        const voice = voiceMap[sp] || "Kore";
        const accent = accentMap[sp] || "us";
        const lineSpeed = speedMap[sp] || 1.0;
        const buf = await ttsOne(lines[i].text, voice, accent, lineSpeed);
        buffers.push(buf);
      }
      const combined = combineWavBuffers(buffers);
      setAudioUrl(URL.createObjectURL(combined));
      setStatusText("");
    } catch (e) {
      setError(String(e.message || e));
    } finally {
      setLoading(false);
    }
  }

  // ===== 音声を生成（手動モード） =====
  async function handleGenerateAudioManual() {
    setError("");
    setAudioUrl("");
    const filled = manualLines.filter((l) => l.text.trim());
    if (filled.length === 0) {
      setError("英文を入力してください。");
      return;
    }
    setLoading(true);
    try {
      const buffers = [];
      for (let i = 0; i < filled.length; i++) {
        setStatusText(`音声を生成中… (${i + 1} / ${filled.length})`);
        const buf = await ttsOne(
          filled[i].text,
          filled[i].voice,
          filled[i].accent,
          filled[i].speed
        );
        buffers.push(buf);
      }
      const combined = combineWavBuffers(buffers);
      setAudioUrl(URL.createObjectURL(combined));
      setStatusText("");
    } catch (e) {
      setError(String(e.message || e));
    } finally {
      setLoading(false);
    }
  }

  function downloadAudio() {
    if (!audioUrl) return;
    const a = document.createElement("a");
    a.href = audioUrl;
    a.download = "listening.wav";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }

  // ===== 生徒配布用の問題用紙（PDF）を作る =====
  // 追加ライブラリなしで、ブラウザの印刷→PDF保存を使います（日本語も文字化けしません）
  function escapeHtml(s) {
    return String(s || "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
  }
  function downloadPdf() {
    if (!result || !result.questions) return;
    const title = escapeHtml(result.title || "リスニング問題");

    let questionsHtml = "";
    result.questions.forEach((q, qi) => {
      let choicesHtml = "";
      (q.choices || []).forEach((c, ci) => {
        const letter = String.fromCharCode(65 + ci);
        choicesHtml += `<div class="choice">(${letter}) ${escapeHtml(c)}</div>`;
      });
      questionsHtml += `
        <div class="q">
          <div class="q-title">Q${qi + 1}. ${escapeHtml(q.question)}</div>
          <div class="choices">${choicesHtml}</div>
          <div class="ans-line">解答: ________</div>
        </div>`;
    });

    const html = `<!DOCTYPE html>
<html lang="ja"><head><meta charset="utf-8"><title>${title}</title>
<style>
  @page { margin: 20mm; }
  body { font-family: "Hiragino Kaku Gothic ProN", "Yu Gothic", "Meiryo", sans-serif; color: #1a2238; line-height: 1.8; }
  .head { text-align: center; border-bottom: 2px solid #1a2238; padding-bottom: 10px; margin-bottom: 24px; }
  .head h1 { font-size: 20px; margin: 0 0 6px; }
  .meta { display: flex; justify-content: space-between; font-size: 13px; margin-bottom: 24px; }
  .q { margin-bottom: 28px; page-break-inside: avoid; }
  .q-title { font-weight: bold; margin-bottom: 8px; }
  .choices { margin-left: 16px; }
  .choice { margin-bottom: 4px; }
  .ans-line { margin-top: 8px; font-size: 14px; color: #555; }
  @media print { .noprint { display: none; } }
  .noprint { text-align:center; margin: 20px 0; }
  .noprint button { padding: 10px 24px; font-size: 15px; cursor: pointer; }
</style></head>
<body>
  <div class="head"><h1>${title}</h1><div style="font-size:13px;">英語リスニング問題</div></div>
  <div class="meta"><span>氏名: ________________________</span><span>クラス: __________  番号: ______</span></div>
  ${questionsHtml}
  <div class="noprint"><button onclick="window.print()">この画面を印刷 / PDFで保存</button></div>
</body></html>`;

    const w = window.open("", "_blank");
    if (!w) {
      setError("ポップアップがブロックされました。ブラウザの設定で許可してください。");
      return;
    }
    w.document.open();
    w.document.write(html);
    w.document.close();
  }

  // AIモードで使われている話者一覧（声の割り当て表示用）
  const usedSpeakers = SPEAKER_NAMES.slice(0, numSpeakers);

  return (
    <div className="wrap">
      <header className="hero">
        <div className="eyebrow">Ikedayama Shoten</div>
        <h1>Listening Lab</h1>
        <div className="jp-title">英語リスニング問題ジェネレーター</div>
      </header>

      {/* モード切替 */}
      <div className="mode-switch">
        <button
          className={mode === "ai" ? "active" : ""}
          onClick={() => {
            setMode("ai");
            setResult(null);
            setAudioUrl("");
            setError("");
          }}
        >
          ① AIで問題を自動生成
        </button>
        <button
          className={mode === "manual" ? "active" : ""}
          onClick={() => {
            setMode("manual");
            setResult(null);
            setAudioUrl("");
            setError("");
          }}
        >
          ② 自分の英文を音声化
        </button>
      </div>

      {error && <div className="error">{error}</div>}

      {/* ============ AIモード ============ */}
      {mode === "ai" && (
        <>
          <div className="card">
            <h2>
              <span className="num">1</span>問題の条件を入力
            </h2>
            <p className="sub">トピックと条件を決めると、AIが英文・設問・解答を作ります。</p>

            <div className="field">
              <label>トピック・場面</label>
              <input
                type="text"
                value={topic}
                placeholder="例：空港でのチェックイン、友達との週末の予定、環境問題についての議論"
                onChange={(e) => setTopic(e.target.value)}
              />
            </div>

            <div className="row">
              <div className="field">
                <label>レベル</label>
                <select value={level} onChange={(e) => setLevel(e.target.value)}>
                  <option value="A1">A1（初級・中学基礎）</option>
                  <option value="A2">A2（初中級・中学卒業程度）</option>
                  <option value="B1">B1（中級・高校中級）</option>
                  <option value="B2">B2（中上級・高校上級〜英検準1級）</option>
                  <option value="C1">C1（上級・英検1級程度）</option>
                  <option value="C2">C2（最上級・ネイティブ相当）</option>
                </select>
              </div>
              <div className="field">
                <label>会話の人数</label>
                <select
                  value={numSpeakers}
                  onChange={(e) => setNumSpeakers(Number(e.target.value))}
                >
                  <option value={1}>1人（説明文）</option>
                  <option value={2}>2人の会話</option>
                  <option value={3}>3人の会話</option>
                  <option value={4}>4人の会話</option>
                  <option value={5}>5人の会話</option>
                </select>
              </div>
              <div className="field">
                <label>設問数</label>
                <select
                  value={numQuestions}
                  onChange={(e) => setNumQuestions(Number(e.target.value))}
                >
                  {Array.from({ length: 10 }, (_, i) => i + 1).map((n) => (
                    <option key={n} value={n}>
                      {n}問
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <button
              className="btn btn-primary"
              onClick={handleGenerateQuestions}
              disabled={loading}
            >
              {loading ? "生成中…" : "問題を作成する"}
            </button>
          </div>

          {/* 生成結果 */}
          {result && (
            <div className="card">
              <h2>
                <span className="num">2</span>
                生成された問題
              </h2>

              <div className="field" style={{ marginTop: 8 }}>
                <label>タイトル（編集できます）</label>
                <input
                  type="text"
                  value={result.title || ""}
                  onChange={(e) => updateTitle(e.target.value)}
                />
              </div>

              <p className="sub">台本（スクリプト）— 自由に編集できます</p>
              <div className="result-script">
                {result.script?.map((line, i) => (
                  <div className="edit-line" key={i}>
                    {numSpeakers > 1 && (
                      <select
                        className="sp-select"
                        value={line.speaker}
                        onChange={(e) => updateScriptSpeaker(i, e.target.value)}
                      >
                        {usedSpeakers.map((sp) => (
                          <option key={sp} value={sp}>
                            {sp}
                          </option>
                        ))}
                      </select>
                    )}
                    <textarea
                      className="line-text"
                      value={line.text}
                      onChange={(e) => updateScriptLine(i, e.target.value)}
                    />
                    <button
                      className="del-x"
                      title="この行を削除"
                      onClick={() => removeScriptLine(i)}
                      disabled={result.script.length <= 1}
                    >
                      ×
                    </button>
                  </div>
                ))}
                <button className="mini-btn" onClick={addScriptLine}>
                  ＋ セリフを追加
                </button>
              </div>

              {/* 声・アクセント・速度の割り当て */}
              <p className="sub">話者ごとに声・アクセント・読む速さを設定</p>
              <div className="voice-config">
                {usedSpeakers.map((sp) => (
                  <div className="speaker-setting" key={sp}>
                    <div className="ss-name">{sp}</div>
                    <VoicePicker
                      voice={voiceMap[sp]}
                      accent={accentMap[sp]}
                      onChangeVoice={(val) => updateVoiceMap(sp, val)}
                      onChangeAccent={(val) => updateAccentMap(sp, val)}
                    />
                    <div className="ss-speed">
                      <span className="ss-speed-label">読む速さ</span>
                      <input
                        type="range"
                        min="0.25"
                        max="4"
                        step="0.05"
                        value={speedMap[sp]}
                        onChange={(e) => updateSpeedMap(sp, Number(e.target.value))}
                      />
                      <span className="speed-val">{(speedMap[sp] || 1).toFixed(2)}倍</span>
                    </div>
                  </div>
                ))}
              </div>

              <button
                className="btn btn-primary"
                onClick={handleGenerateAudioFromResult}
                disabled={loading}
              >
                {loading ? "生成中…" : "音声を生成する"}
              </button>

              {audioUrl && (
                <>
                  <div className="divider"></div>
                  <audio controls src={audioUrl}></audio>
                  <button className="btn btn-secondary" onClick={downloadAudio}>
                    ⬇ 音声(WAV)をダウンロード
                  </button>
                </>
              )}

              <div className="divider"></div>

              {/* 設問（編集可能） */}
              <p className="sub">設問 — 設問文・選択肢・正解・解説を編集できます</p>
              {result.questions?.map((q, qi) => (
                <div className="question-edit" key={qi}>
                  <div className="qe-head">
                    <span className="qe-num">Q{qi + 1}</span>
                    <button
                      className="del-x"
                      title="この設問を削除"
                      onClick={() => removeQuestion(qi)}
                      disabled={result.questions.length <= 1}
                    >
                      ×
                    </button>
                  </div>
                  <textarea
                    className="qe-question"
                    value={q.question}
                    placeholder="設問文（英語）"
                    onChange={(e) => updateQuestion(qi, "question", e.target.value)}
                  />
                  {q.choices?.map((c, ci) => (
                    <div className="choice-row" key={ci}>
                      <label className="choice-radio" title="これを正解にする">
                        <input
                          type="radio"
                          name={"ans-" + qi}
                          checked={q.answerIndex === ci}
                          onChange={() => updateQuestion(qi, "answerIndex", ci)}
                        />
                        <span className="choice-letter">
                          {String.fromCharCode(65 + ci)}
                        </span>
                      </label>
                      <input
                        type="text"
                        className="choice-input"
                        value={c}
                        placeholder={"選択肢 " + String.fromCharCode(65 + ci)}
                        onChange={(e) => updateChoice(qi, ci, e.target.value)}
                      />
                    </div>
                  ))}
                  <textarea
                    className="qe-exp"
                    value={q.explanation || ""}
                    placeholder="解説（日本語・任意）"
                    onChange={(e) => updateQuestion(qi, "explanation", e.target.value)}
                  />
                </div>
              ))}

              <button className="mini-btn" onClick={addQuestion}>
                ＋ 設問を追加
              </button>

              <div className="divider"></div>

              <p className="hint">
                ◯印（ラジオボタン）が正解です。編集が終わったら、生徒配布用のPDFを書き出せます。
              </p>
              <button className="btn btn-secondary" onClick={downloadPdf}>
                ⬇ 問題用紙(PDF)をダウンロード（設問・選択肢のみ）
              </button>
            </div>
          )}
        </>
      )}

      {/* ============ 手動モード ============ */}
      {mode === "manual" && (
        <div className="card">
          <h2>
            <span className="num">1</span>英文を入力して音声化
          </h2>
          <p className="sub">
            セリフごとに英文と声を選びます。会話なら人数分の行を追加してください。
          </p>

          {manualLines.map((line, i) => (
            <div className="speaker-row" key={i}>
              <span className="tag">セリフ {i + 1}</span>
              <div className="speaker-body">
                <textarea
                  value={line.text}
                  placeholder="ここに英文を入力"
                  onChange={(e) => updateLine(i, "text", e.target.value)}
                />
                <VoicePicker
                  voice={line.voice}
                  accent={line.accent || "us"}
                  onChangeVoice={(val) => updateLine(i, "voice", val)}
                  onChangeAccent={(val) => updateLine(i, "accent", val)}
                />
                <div className="ss-speed">
                  <span className="ss-speed-label">読む速さ</span>
                  <input
                    type="range"
                    min="0.25"
                    max="4"
                    step="0.05"
                    value={line.speed != null ? line.speed : 1.0}
                    onChange={(e) => updateLine(i, "speed", Number(e.target.value))}
                  />
                  <span className="speed-val">
                    {(line.speed != null ? line.speed : 1).toFixed(2)}倍
                  </span>
                </div>
              </div>
            </div>
          ))}

          <div className="add-remove">
            <button
              className="mini-btn"
              onClick={addLine}
              disabled={manualLines.length >= 12}
            >
              ＋ セリフを追加
            </button>
            <button
              className="mini-btn"
              onClick={() => removeLine(manualLines.length - 1)}
              disabled={manualLines.length <= 1}
            >
              − 最後のセリフを削除
            </button>
          </div>

          <p className="hint" style={{ marginBottom: 16 }}>
            読む速さは0.25倍（とてもゆっくり）〜4.0倍（とても速い）の範囲で、セリフごとに設定できます。標準は1.0倍です。
          </p>

          <button
            className="btn btn-primary"
            onClick={handleGenerateAudioManual}
            disabled={loading}
          >
            {loading ? "生成中…" : "音声を生成する"}
          </button>

          {audioUrl && (
            <>
              <div className="divider"></div>
              <audio controls src={audioUrl}></audio>
              <button className="btn btn-secondary" onClick={downloadAudio}>
                ⬇ 音声(WAV)をダウンロード
              </button>
            </>
          )}
        </div>
      )}

      {loading && statusText && (
        <div className="status">
          <span className="spinner"></span>
          {statusText}
        </div>
      )}

      <div className="footer-note">池田山商店 — Powered by Gemini</div>
    </div>
  );
}
