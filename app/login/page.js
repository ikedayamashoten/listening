"use client";

import { useState } from "react";
import "../globals.css";

export default function LoginPage() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin() {
    setError("");
    if (!password.trim()) {
      setError("パスワードを入力してください。");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "ログインに失敗しました。");
      }
      // 成功したらトップへ
      window.location.href = "/";
    } catch (e) {
      setError(String(e.message || e));
      setLoading(false);
    }
  }

  function handleKeyDown(e) {
    if (e.key === "Enter") handleLogin();
  }

  return (
    <div className="login-wrap">
      <div className="login-card">
        <div className="login-head">
          <div className="login-eyebrow">池田山商店</div>
          <h1 className="login-title">リスニング問題作成ツール</h1>
          <p className="login-sub">ご利用にはパスワードが必要です</p>
        </div>

        {error && <div className="error">{error}</div>}

        <div className="field">
          <label>パスワード</label>
          <input
            type="password"
            value={password}
            placeholder="パスワードを入力"
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={handleKeyDown}
            autoFocus
          />
        </div>

        <button className="btn btn-primary" onClick={handleLogin} disabled={loading}>
          {loading ? "確認中…" : "ログイン"}
        </button>

        <p className="login-note">
          パスワードが分からない場合は、配布元（池田山商店）にお問い合わせください。
        </p>
      </div>

      <div className="footer-note">
        リスニング問題作成ツール powered by LLC. IKEDAYAMASHOTEN
      </div>
    </div>
  );
}
