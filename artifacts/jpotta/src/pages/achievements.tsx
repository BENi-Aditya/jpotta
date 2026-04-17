import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import useEmblaCarousel from "embla-carousel-react";
import { X, ChevronLeft, ChevronRight, Trophy } from "lucide-react";
import { useAchievementYears, useAchievementsByYear, useAchievementById } from "@/hooks/use-store";
import { useTheme } from "@/hooks/use-theme";

export default function Achievements() {
  const years = useAchievementYears();
  const [selectedAchievementId, setSelectedAchievementId] = useState<number | null>(null);
  const { theme } = useTheme();
  const isDark = theme === "dark";

  return (
    <div className={`min-h-screen font-sans pt-24 pb-24 relative overflow-hidden transition-colors duration-500 ${isDark ? "bg-black text-white" : "bg-slate-50 text-slate-900"}`}>
      <div className={`absolute top-0 right-0 w-[600px] h-[600px] rounded-full blur-[120px] pointer-events-none ${isDark ? "bg-primary/10" : "bg-primary/5"}`} />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="mb-16 text-center">
          <motion.h1 
            className={`text-5xl md:text-7xl font-black uppercase tracking-tight mb-4 ${isDark ? "text-white" : "text-slate-900"}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            Hall of <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-red-500">Fame</span>
          </motion.h1>
          <motion.p 
            className={`text-lg max-w-2xl mx-auto ${isDark ? "text-gray-400" : "text-slate-500"}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            A legacy of excellence. Celebrating the milestones and victories of our elite athletes.
          </motion.p>
        </div>

        {years.length > 0 ? (
          <div className="space-y-24">
            {years.map(year => (
              <YearSection key={year} year={year} onSelect={setSelectedAchievementId} isDark={isDark} />
            ))}
          </div>
        ) : (
          <div className={`text-center py-24 border rounded-lg ${isDark ? "bg-zinc-900/50 border-white/5 text-gray-400" : "bg-white border-slate-200 text-slate-400"}`}>
            <p>No achievements recorded yet.</p>
          </div>
        )}
      </div>

      <AnimatePresence>
        {selectedAchievementId && (
          <AchievementPopup 
            id={selectedAchievementId} 
            onClose={() => setSelectedAchievementId(null)} 
          />
        )}
      </AnimatePresence>
    </div>
  );
}

function YearSection({ year, onSelect, isDark }: { year: number; onSelect: (id: number) => void; isDark: boolean }) {
  const achievements = useAchievementsByYear(year);
  if (!achievements.length) return null;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      className="relative"
    >
      <div className="flex items-center space-x-6 mb-10">
        <h2 className={`text-6xl md:text-8xl font-black italic ${isDark ? "text-white/20" : "text-slate-900/25"}`}>
          {year}
        </h2>
        <div className="h-px bg-gradient-to-r from-primary to-transparent flex-1" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {achievements.map((achievement, i) => (
          <motion.div
            key={achievement.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            className={`group cursor-pointer border rounded-lg overflow-hidden transition-all duration-300 hover:border-primary ${isDark ? "bg-zinc-900 border-white/10 hover:shadow-[0_0_20px_rgba(204,0,0,0.2)]" : "bg-white border-slate-200 hover:shadow-lg"}`}
            onClick={() => onSelect(achievement.id)}
          >
            <div className="aspect-[4/3] bg-black relative overflow-hidden">
              {achievement.mainImageUrl ? (
                <img src={achievement.mainImageUrl} alt={achievement.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              ) : (
                <div className={`w-full h-full flex items-center justify-center ${isDark ? "bg-zinc-800" : "bg-slate-100"}`}><Trophy className={`w-12 h-12 ${isDark ? "text-zinc-600" : "text-slate-300"}`} /></div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-80" />
              <div className="absolute bottom-0 left-0 p-6 w-full">
                <h3 className="text-xl font-bold text-white mb-2 group-hover:text-primary transition-colors">{achievement.title}</h3>
                <p className="text-sm text-gray-300 line-clamp-2">{achievement.shortDescription}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}

function AchievementPopup({ id, onClose }: { id: number; onClose: () => void }) {
  const achievement = useAchievementById(id);
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true });

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 md:p-12">
      <motion.div 
        initial={{ opacity: 0 }} 
        animate={{ opacity: 1 }} 
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/90 backdrop-blur-sm" 
      />
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="relative w-full max-w-6xl bg-zinc-950 border border-white/10 rounded-xl overflow-hidden shadow-[0_0_50px_rgba(204,0,0,0.3)] flex flex-col md:flex-row max-h-[90vh]"
      >
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-10 h-10 bg-black/50 hover:bg-primary rounded-full flex items-center justify-center text-white transition-colors border border-white/10"
        >
          <X className="w-5 h-5" />
        </button>

        {!achievement ? (
          <div className="w-full h-96 flex items-center justify-center"><div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" /></div>
        ) : (
          <>
            <div className="w-full md:w-1/2 bg-black relative">
              {(achievement.additionalImages?.length > 0 || achievement.mainImageUrl) ? (
                <div className="h-64 md:h-full overflow-hidden" ref={emblaRef}>
                  <div className="flex h-full">
                    {achievement.mainImageUrl && (
                      <div className="flex-[0_0_100%] min-w-0 relative">
                        <img src={achievement.mainImageUrl} alt="Main" className="w-full h-full object-cover" />
                      </div>
                    )}
                    {achievement.additionalImages?.map((img, i) => (
                      <div key={i} className="flex-[0_0_100%] min-w-0 relative">
                        <img src={img} alt={`Additional ${i}`} className="w-full h-full object-cover" />
                      </div>
                    ))}
                  </div>
                  {((achievement.additionalImages?.length || 0) > 0) && (
                    <>
                      <button onClick={() => emblaApi?.scrollPrev()} className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/50 hover:bg-primary text-white rounded-full flex items-center justify-center backdrop-blur-sm transition-all"><ChevronLeft className="w-5 h-5" /></button>
                      <button onClick={() => emblaApi?.scrollNext()} className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/50 hover:bg-primary text-white rounded-full flex items-center justify-center backdrop-blur-sm transition-all"><ChevronRight className="w-5 h-5" /></button>
                    </>
                  )}
                </div>
              ) : (
                <div className="w-full h-64 md:h-full flex items-center justify-center bg-zinc-900">
                  <Trophy className="w-16 h-16 text-zinc-700" />
                </div>
              )}
            </div>

            <div className="w-full md:w-1/2 p-8 md:p-12 overflow-y-auto">
              <div className="inline-block px-3 py-1 bg-primary/20 text-primary border border-primary/30 rounded-full text-xs font-bold mb-6">
                {achievement.year}
              </div>
              <h2 className="text-3xl md:text-4xl font-black uppercase text-white mb-6 leading-tight">{achievement.title}</h2>
              <div className="prose prose-invert prose-p:text-gray-300 prose-p:leading-relaxed max-w-none mb-10">
                <p>{achievement.longDescription || achievement.shortDescription}</p>
              </div>

              {achievement.taggedPlayers && achievement.taggedPlayers.length > 0 && (
                <div>
                  <h3 className="text-sm font-bold text-white uppercase tracking-widest border-b border-white/10 pb-3 mb-4">Players Involved</h3>
                  <div className="flex flex-wrap gap-3">
                    {achievement.taggedPlayers.map((player) => (
                      <div key={player.id} className="flex items-center bg-zinc-900 border border-white/10 rounded-full pr-4 pl-1 py-1">
                        {player.photoUrl ? (
                          <img src={player.photoUrl} alt={player.name} className="w-8 h-8 rounded-full object-cover mr-3 border border-primary/50" />
                        ) : (
                          <div className="w-8 h-8 rounded-full bg-zinc-800 text-primary flex items-center justify-center font-bold text-xs mr-3">
                            {player.name.charAt(0)}
                          </div>
                        )}
                        <span className="text-sm font-bold text-white">{player.name}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </>
        )}
      </motion.div>
    </div>
  );
}
