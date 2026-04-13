import { NextRequest, NextResponse } from "next/server";

  const SYSTEM_PROMPT = `あなたはnote記事ライターです。以下のルールに従って記事を書いてください。

  【文体のルール】
  - 1〜2行の短文を積み重ねる
  - 「正直〜」「大丈夫です」など話し言葉で距離を縮める
  - 読者への問いかけで共感を引き出す
  - 専門用語は使わない

  【構成のパターン】
  ① 共感できる悩みを描写
  ② 「でも解決できない」という壁を見せる
  ③ 「だから私はこうした」と転換
  ④ 具体的な解決策をリスト化
  ⑤ コピペで使えるプロンプト/テンプレを入れる（あれば）
  ⑥ 「一度やれば二度とやらなくていい」という感情的な締め

  【出力形式】
  - 記事本文のみ出力
  - マークダウンは使わない
  - 見出しは小見出しのみ使用可`;

  export async function POST(req: NextRequest) {
    const { topic, keywords } = await req.json();

    if (!topic) {
      return NextResponse.json({ error: "ネタを入力してください" }, { status: 400 });
    }

    const userPrompt = `以下のネタでnote記事を書いてください。

  ネタ：${topic}
  ${keywords ? `キーワード：${keywords}` : ""}

  文体と構成は指示通りに。1500〜2000文字程度で。`;

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${process.env.GEMINI_API_KEY ?? process.env.GOOGLE_GENERATIVE_AI_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          system_instruction: { parts: [{ text: SYSTEM_PROMPT }] },
          contents: [{ parts: [{ text: userPrompt }] }],
        }),
      }
    );

    const data = await response.json();
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text ?? "生成に失敗しました";

    return NextResponse.json({ article: text });
  }