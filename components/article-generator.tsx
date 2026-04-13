'use client'

import { useState } from 'react'
import { readStreamableValue } from '@ai-sdk/rsc'
import { generateArticle } from '@/app/actions/generate-article'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Spinner } from '@/components/ui/spinner'
import { Copy, Check, FileText, Sparkles } from 'lucide-react'

function errorMessage(err: unknown): string {
  if (typeof err === 'string') return err
  if (err instanceof Error) return err.message
  if (err && typeof err === 'object') {
    const o = err as Record<string, unknown>
    if (typeof o.message === 'string') return o.message
    const data = o.data
    if (data && typeof data === 'object') {
      const inner = (data as Record<string, unknown>).error
      if (inner && typeof inner === 'object' && typeof (inner as { message?: unknown }).message === 'string') {
        return (inner as { message: string }).message
      }
    }
  }
  try {
    return JSON.stringify(err)
  } catch {
    return '生成に失敗しました'
  }
}

export function ArticleGenerator() {
  const [topic, setTopic] = useState('')
  const [keywords, setKeywords] = useState('')
  const [article, setArticle] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)

  const handleGenerate = async () => {
    if (!topic.trim()) return

    setArticle('')
    setError(null)
    setIsGenerating(true)
    try {
      const stream = await generateArticle(topic, keywords)

      for await (const chunk of readStreamableValue(stream)) {
        // readStreamableValue はパッチ適用後の「ここまでの全文」を返す
        if (typeof chunk === 'string') {
          setArticle(chunk)
        }
      }
    } catch (err) {
      setError(errorMessage(err))
    } finally {
      setIsGenerating(false)
    }
  }

  const handleCopy = async () => {
    if (!article) return
    
    await navigator.clipboard.writeText(article)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="w-full max-w-3xl mx-auto space-y-6">
      <Card className="border-border/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <FileText className="w-5 h-5" />
            記事の設定
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="topic" className="text-sm font-medium text-foreground">
              ネタ・テーマ <span className="text-destructive">*</span>
            </label>
            <Textarea
              id="topic"
              placeholder="例: 朝活を始めて変わった3つのこと"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              className="min-h-[100px] resize-none"
              disabled={isGenerating}
            />
          </div>
          
          <div className="space-y-2">
            <label htmlFor="keywords" className="text-sm font-medium text-foreground">
              キーワード <span className="text-muted-foreground text-xs">（オプション）</span>
            </label>
            <Input
              id="keywords"
              placeholder="例: 習慣化, 生産性, モーニングルーティン"
              value={keywords}
              onChange={(e) => setKeywords(e.target.value)}
              disabled={isGenerating}
            />
            <p className="text-xs text-muted-foreground">
              カンマ区切りで複数入力できます
            </p>
          </div>

          <Button 
            onClick={() => void handleGenerate()} 
            disabled={!topic.trim() || isGenerating}
            className="w-full"
            size="lg"
          >
            {isGenerating ? (
              <>
                <Spinner className="w-4 h-4 mr-2" />
                生成中...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 mr-2" />
                記事を生成する
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {error && (
        <Card className="border-destructive/50 bg-destructive/5">
          <CardContent className="pt-6">
            <p className="text-sm font-medium text-destructive">エラー</p>
            <p className="mt-2 text-sm text-foreground whitespace-pre-wrap">{error}</p>
          </CardContent>
        </Card>
      )}

      {(article || isGenerating) && (
        <Card className="border-border/50">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-lg">
              <FileText className="w-5 h-5" />
              生成された記事
            </CardTitle>
            {article && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleCopy}
                className="gap-2"
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4" />
                    コピーしました
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    コピー
                  </>
                )}
              </Button>
            )}
          </CardHeader>
          <CardContent>
            {isGenerating && !article ? (
              <div className="flex items-center justify-center py-12">
                <div className="flex flex-col items-center gap-3">
                  <Spinner className="w-8 h-8" />
                  <p className="text-sm text-muted-foreground">AIが記事を執筆中です...</p>
                </div>
              </div>
            ) : (
              <div className="prose prose-sm max-w-none dark:prose-invert">
                <div className="whitespace-pre-wrap text-foreground leading-relaxed">
                  {article}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}
