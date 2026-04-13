'use client'

import { motion } from 'framer-motion'
import { Navbar } from '@/components/navbar'
import { FeaturesSection } from '@/components/features-section'
import { ArticleGenerator } from '@/components/article-generator'
import { ArrowRight } from 'lucide-react'

export default function Home() {
  return (
    <main className="min-h-screen bg-background vignette relative overflow-hidden">
      {/* Background image with dark overlay */}
      <div className="fixed inset-0 z-0">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: 'url(/book-hero.png)',
            opacity: 0.18,
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/0 via-background/30 to-background" />
      </div>
      
      <div className="relative z-10">
        <Navbar />
        
        {/* Hero Section */}
        <section className="relative pt-32 pb-20 overflow-hidden">
          {/* Soft glow background effects */}
          <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-primary/8 blur-[180px] rounded-full pointer-events-none" />
          <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-accent/6 blur-[150px] rounded-full pointer-events-none" />
          
          <div className="container mx-auto px-6 relative z-10">
            <div className="max-w-3xl mx-auto text-center">
              {/* Text Content */}
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
              >
                {/* Badge */}
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium mb-8">
                  <span className="w-1.5 h-1.5 bg-primary rounded-full animate-pulse" />
                  AI搭載ライティングアシスタント
                </div>
                
                {/* Headline with soft glow */}
                <motion.h1 
                  className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6 leading-tight tracking-tight animate-soft-glow"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.1 }}
                >
                  あなたのアイデアを{' '}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600">
                    素晴らしい記事に
                  </span>
                </motion.h1>
                
                {/* Subheadline */}
                <motion.p 
                  className="text-lg text-muted-foreground mb-8 leading-relaxed mx-auto"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                >
                  AI搭載のnote記事生成ツール。<br />
                  シンプルなテーマを魅力的で構造的な記事に変換し、<br />
                  公開準備完了の状態にします。
                </motion.p>

                {/* CTA */}
                <motion.a 
                  href="#generator"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-yellow-400 to-yellow-600 text-black font-medium transition-all duration-300 group shadow-lg shadow-yellow-500/30 hover:shadow-xl hover:shadow-yellow-500/50"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.3 }}
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                >
                  執筆を始める
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </motion.a>
              </motion.div>


            </div>
          </div>
        </section>

        {/* Features Section */}
        <FeaturesSection />

        {/* Generator Section */}
        <section id="generator" className="py-24">
          <div className="container mx-auto px-6">
            <div className="text-center mb-16">
              <motion.h2 
                className="text-3xl md:text-4xl font-bold text-foreground mb-4"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
              >
                記事を生成する
              </motion.h2>
              <motion.p 
                className="text-muted-foreground max-w-2xl mx-auto"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
              >
                テーマを入力するだけで、AIが完成度の高い記事を作成します
              </motion.p>
            </div>
            
            <ArticleGenerator />
          </div>
        </section>

        {/* Footer */}
      </div>
    </main>
  )
}
