import { ArticleGenerator } from '@/components/article-generator'
import { FileText } from 'lucide-react'

export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-12">
        <header className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 mb-4">
            <FileText className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground mb-2">
            note記事生成ツール
          </h1>
          <p className="text-muted-foreground max-w-md mx-auto">
            ネタやテーマを入力するだけで、AIがnote向けの記事を自動生成します
          </p>
        </header>
        
        <ArticleGenerator />
      </div>
    </main>
  )
}
