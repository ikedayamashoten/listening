// パスワードを照合するAPI（サーバー側で照合するので、正解パスワードは利用者に見えません）
import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function POST(request) {
  try {
    const correct = process.env.APP_PASSWORD;
    if (!correct) {
      return NextResponse.json(
        { error: "サーバーにパスワード(APP_PASSWORD)が設定されていません。" },
        { status: 500 }
      );
    }

    const body = await request.json();
    const input = (body.password || "").trim();

    if (input && input === correct) {
      // ログイン成功：ブラウザに「合言葉を覚えておく印」(cookie)を付ける
      const res = NextResponse.json({ ok: true });
      res.cookies.set("auth", "1", {
        httpOnly: true,
        secure: true,
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 60 * 24 * 30, // 30日間有効
      });
      return res;
    }

    return NextResponse.json(
      { error: "パスワードが違います。" },
      { status: 401 }
    );
  } catch (err) {
    return NextResponse.json({ error: "エラー: " + String(err) }, { status: 500 });
  }
}

// ログアウト：印を消す
export async function DELETE() {
  const res = NextResponse.json({ ok: true });
  res.cookies.set("auth", "", { path: "/", maxAge: 0 });
  return res;
}
