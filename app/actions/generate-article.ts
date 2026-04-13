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
- 適切な見出し（##）を使用して構造化してください
- 1500〜2500文字程度の記事を作成してください
- 導入部分で読者の興味を引いてください
- 具体例や体験談を含めてください
- 最後にまとめを入れてください

記事を作成してください:`

  ;(async () => {
    try {
      const { textStream } = streamText({
        // gemini-2.0-flash は新規キーでは 404（提供終了メッセージ）になることがある
        model: google('gemini-2.5-flash'),
        prompt,
        maxOutputTokens: 4000,
        temperature: 0.7,
      })

      // textStream のチャンクは差分なので append（update だと全文として扱われず壊れる）
      for await (const chunk of textStream) {
        stream.append(chunk)
      }

      stream.done()
    } catch (error) {
      console.error('エラー詳細:', JSON.stringify(error, null, 2))
      stream.error(error)
    }
  })()

  return stream.value
}
