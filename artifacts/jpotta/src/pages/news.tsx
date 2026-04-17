import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Calendar, X } from "lucide-react";
import { useNews } from "@/hooks/use-store";
import type { NewsArticle } from "@/lib/store";

export default function News() {
  const news = useNews();
  const [activeArticle, setActiveArticle] = useState<NewsArticle | null>(null);

  return (
    <div className="min-h-screen bg-black text-white font-sans pt-24 pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-16">
          <motion.h1 className="text-5xl md:text-6xl font-black uppercase tracking-tight text-white mb-4" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            Academy <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-red-500">News</span>
          </motion.h1>
          <motion.p className="text-gray-400 text-lg max-w-2xl" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            Stay updated with the latest tournaments, training camps, and achievements from JPOTTA.
          </motion.p>
        </div>

        {!news.length ? (
          <div className="text-center py-24 bg-zinc-900/50 border border-white/5 rounded-lg"><p className="text-gray-400">No news articles published yet.</p></div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {news.map((article, i) => (
              <motion.article key={article.id} initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: i * 0.1 }} className="group flex flex-col bg-zinc-900 border border-white/10 rounded-lg overflow-hidden hover:border-primary/50 transition-all duration-500">
                <div className="relative aspect-[4/3] overflow-hidden bg-black">
                  {article.imageUrl ? <img src={article.imageUrl} alt={article.title} className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out" /> : <div className="absolute inset-0 flex items-center justify-center bg-zinc-800"><span className="text-zinc-600 font-bold text-2xl uppercase opacity-20">JPOTTA</span></div>}
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-80" />
                </div>
                <div className="p-6 flex flex-col flex-1">
                  <div className="flex items-center space-x-2 text-primary text-xs font-bold tracking-wider mb-4">
                    <Calendar className="w-4 h-4" />
                    <span>{new Date(article.publishedAt).toLocaleDateString("en-IN", { year: "numeric", month: "short", day: "2-digit" })}</span>
                  </div>
                  <h2 className="text-xl font-bold text-white mb-3 leading-tight group-hover:text-primary transition-colors">{article.title}</h2>
                  <p className="text-gray-400 text-sm mb-6 flex-1">{article.summary || article.content.slice(0, 150) + "..."}</p>
                  <button onClick={() => setActiveArticle(article)} className="flex items-center text-sm font-bold text-white group-hover:text-primary transition-colors mt-auto">
                    Read Full Story <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </motion.article>
            ))}
          </div>
        )}
      </div>

      <AnimatePresence>
        {activeArticle && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[120] bg-black/80 backdrop-blur-sm p-4 md:p-8" onClick={() => setActiveArticle(null)}>
            <motion.div initial={{ scale: 0.95, y: 24 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 24 }} className="max-w-5xl mx-auto bg-zinc-950 border border-white/10 rounded-xl overflow-hidden relative mt-10" onClick={(e) => e.stopPropagation()}>
              <button onClick={() => setActiveArticle(null)} className="absolute top-4 right-4 z-20 w-10 h-10 rounded-full bg-black/70 border border-white/20 text-white hover:bg-primary transition-colors flex items-center justify-center"><X className="w-5 h-5" /></button>
              <div className="grid grid-cols-1 md:grid-cols-2 min-h-[360px]">
                <div className="bg-black">
                  {activeArticle.imageUrl ? <img src={activeArticle.imageUrl} alt={activeArticle.title} className="w-full h-full object-cover" /> : <div className="h-full w-full flex items-center justify-center text-zinc-600 font-black text-4xl">JPOTTA</div>}
                </div>
                <div className="p-6 md:p-8 overflow-y-auto max-h-[80vh]">
                  <p className="text-primary text-xs font-bold tracking-[0.2em] uppercase mb-4">{new Date(activeArticle.publishedAt).toLocaleDateString("en-IN", { year: "numeric", month: "short", day: "2-digit" })}</p>
                  <h3 className="text-2xl md:text-3xl font-black text-white mb-4 leading-tight">{activeArticle.title}</h3>
                  <p className="text-gray-300 text-sm md:text-base leading-relaxed whitespace-pre-line">{activeArticle.content}</p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
