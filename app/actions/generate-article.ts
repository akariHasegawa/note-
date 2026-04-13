'use server'

import { createGoogleGenerativeAI } from '@ai-sdk/google'
import { streamText } from 'ai'
import { createStreamableValue } from '@ai-sdk/rsc'

// SDK 既定は GOOGLE_GENERATIVE_AI_API_KEY のみ。既存の GEMINI_API_KEY も読む。
const google = createGoogleGenerativeAI({
  apiKey:
    process.env.GOOGLE_GENERATIVE_AI_API_KEY ?? process.env.GEMINI_API_KEY,
})

export async function generateArticle(topic: string, keywords?: string) {
  const stream = createStreamableValue('')

  const keywordSection = keywords 
    ? `\n\nキーワード: ${keywords}` 
    : ''

  const prompt = `あなたはプロのライターです。以下のテーマについて、noteの記事を作成してください。

テーマ: ${topic}${keywordSection}

要件:
- 読みやすく、親しみやすい文体で書いてください
- 適切な見出し（##）を使い、本文は「導入」「本論（2〜4セクション）」「まとめ」の流れにしてください
- 全体でおおよそ 2000〜3500 文字を目安にしてください（短すぎず、冗長にもしない）
- 各見出しの本文は段落として完結させ、**文や箇条書きの途中で終わらせないでください**
- 具体例や体験談を含めてください
- 必ず最後に「## まとめ」（またはそれに相当する締めの見出し）を置き、読者への一言で記事を締めてから出力を終えてください
- トークン上限に達して途中で切れる場合でも、**直前の段落を短くしてでも**必ずまとめまで書き切ることを最優先にしてください

記事を作成してください:`

  const { textStream } = streamText({
    // gemini-2.0-flash は新規キーでは 404（提供終了メッセージ）になることがある
    model: google('gemini-2.5-flash'),
    prompt,
    // 日本語の長文は消費トークンが大きい。4000 付近だと本論の途中で上限に達しがち
    maxOutputTokens: 12000,
    temperature: 0.65,
  })

  const iterator = textStream[Symbol.asyncIterator]()

  try {
    const first = await iterator.next()
    if (first.done) {
      stream.done()
      return stream.value
    }
    // 返却前に1チャンク分 append しないと、Server Action の直後に
    // readStreamableValue が初期ノードだけで終了し、1回目の生成が空になることがある
    stream.append(first.value)
  } catch (error) {
    console.error('エラー詳細:', JSON.stringify(error, null, 2))
    stream.error(error)
    return stream.value
  }

  ;(async () => {
    try {
      for (;;) {
        const { done, value } = await iterator.next()
        if (done) break
        stream.append(value)
      }
      stream.done()
    } catch (error) {
      console.error('エラー詳細:', JSON.stringify(error, null, 2))
      stream.error(error)
    }
  })()

  return stream.value
}
