// ログイン照合API
// 1) パスワードを確認（サーバー側で照合するので正解は利用者に見えない）
// 2) 学校コードをGASに問い合わせ、登録済みか確認＋ログイン履歴を記録
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
    const schoolCode = (body.schoolCode || "").trim();

    // パスワード確認
    if (!input || input !== correct) {
      return NextResponse.json({ error: "パスワードが違います。" }, { status: 401 });
    }

    // 学校コード必須
    if (!schoolCode) {
      return NextResponse.json({ error: "学校コードを入力してください。" }, { status: 400 });
    }

    // GASに問い合わせ（学校コードが登録済みか確認＋履歴記録）
    const gasUrl = process.env.GAS_URL;
    const gasSecret = process.env.GAS_SHARED_SECRET;
    if (!gasUrl || !gasSecret) {
      return NextResponse.json(
        { error: "サーバーにGASの設定(GAS_URL / GAS_SHARED_SECRET)がありません。" },
        { status: 500 }
      );
    }

    let gasData;
    try {
      const gasRes = await fetch(gasUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ secret: gasSecret, schoolCode }),
        redirect: "follow",
      });
      gasData = await gasRes.json();
    } catch (e) {
      return NextResponse.json(
        { error: "学校コードの確認に失敗しました。時間をおいて再度お試しください。" },
        { status: 502 }
      );
    }

    if (!gasData || !gasData.ok) {
      // 未登録コードなど
      if (gasData && gasData.error === "not_registered") {
        return NextResponse.json(
          { error: "この学校コードは登録されていません。配布元にご確認ください。" },
          { status: 401 }
        );
      }
      return NextResponse.json(
        { error: "学校コードを確認できませんでした。" },
        { status: 401 }
      );
    }

    // 成功：ログインの印(cookie)を付ける
    const res = NextResponse.json({ ok: true, schoolName: gasData.schoolName || "" });
    res.cookies.set("auth", "1", {
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 30, // 30日間有効
    });
    return res;
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
