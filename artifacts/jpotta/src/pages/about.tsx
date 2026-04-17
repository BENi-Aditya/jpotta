import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { Link } from "wouter";
import { motion, AnimatePresence, useInView } from "framer-motion";
import { Search, X, Trophy, MapPin, Target, Shield, Star, ChevronLeft, ChevronRight } from "lucide-react";
import { useCommitteeMembers, usePlayers, usePlayerById } from "@/hooks/use-store";
import { useTheme } from "@/hooks/use-theme";

export default function About() {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  return (
    <div className={`min-h-screen font-sans pt-24 pb-24 transition-colors duration-500 ${isDark ? "bg-black text-white" : "bg-slate-50 text-slate-900"}`}>

      {/* Ambient glow orbs (dark only) */}
      {isDark && (
        <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
          <div className="absolute top-1/4 left-0 w-[500px] h-[500px] bg-primary/8 rounded-full blur-[120px] animate-pulse-glow" />
          <div className="absolute bottom-1/4 right-0 w-[400px] h-[400px] bg-red-900/10 rounded-full blur-[100px] animate-pulse-glow" style={{ animationDelay: "1.5s" }} />
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="mb-8">
          <Link href="/" className="text-primary hover:text-red-400 transition-colors text-sm font-bold tracking-widest uppercase flex items-center gap-2">
            <ChevronLeft className="w-4 h-4" /> Back to Home
          </Link>
        </div>

        {/* ── HERO HEADING ─────────────────────────────────────────── */}
        <section className="mb-24">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
            <span className={`inline-flex items-center gap-2 text-xs font-bold tracking-[0.25em] uppercase px-3 py-1 rounded-full mb-6 border ${isDark ? "text-primary border-primary/30 bg-primary/10" : "text-red-700 border-red-200 bg-red-50"}`}>
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary" />
              </span>
              Who We Are
            </span>
            <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tight mb-4 leading-none">
              The{" "}
              <span className={`text-transparent bg-clip-text bg-gradient-to-r from-primary via-red-400 to-orange-400 ${isDark ? "drop-shadow-[0_0_20px_rgba(204,0,0,0.6)]" : ""}`}>
                Academy
              </span>
            </h1>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-12">
            <InfoCard
              isDark={isDark}
              title="Our Vision"
              icon={<Target className="w-5 h-5 text-primary" />}
              text="To be the premier table tennis academy in India, producing world-class athletes who dominate on the global stage, while fostering a lifelong passion for the sport in every student."
              delay={0.1}
            />
            <InfoCard
              isDark={isDark}
              title="Our Mission"
              icon={<Trophy className="w-5 h-5 text-primary" />}
              text="To provide state-of-the-art facilities, elite coaching methodologies, and a competitive environment that demands excellence, discipline, and relentless pursuit of mastery."
              delay={0.2}
            />
          </div>
        </section>

        {/* ── STATS ────────────────────────────────────────────────── */}
        <section className="mb-24">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <StatCard isDark={isDark} target={5} label="Training Centres" suffix="" icon={<MapPin className="w-5 h-5" />} delay={0} />
            <StatCard isDark={isDark} target={7} label="Years of Excellence" suffix="+" icon={<Star className="w-5 h-5" />} delay={0.1} />
            <StatCard isDark={isDark} target={1000} label="Students Trained" suffix="+" icon={<Shield className="w-5 h-5" />} delay={0.2} />
          </div>
        </section>

        {/* ── COMMITTEE ────────────────────────────────────────────── */}
        <CommitteeSection isDark={isDark} />

        {/* ── PLAYERS ──────────────────────────────────────────────── */}
        <PlayersSection isDark={isDark} />
      </div>
    </div>
  );
}

/* ── INFO CARD ─────────────────────────────────────────────────── */
function InfoCard({ title, text, icon, isDark, delay }: { title: string; text: string; icon: React.ReactNode; isDark: boolean; delay?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay }}
      whileHover={{ y: -4 }}
      className={`relative p-8 rounded-2xl border overflow-hidden group transition-all duration-500 ${
        isDark
          ? "bg-zinc-900/80 border-white/8 hover:border-primary/40 hover:shadow-[0_0_40px_rgba(204,0,0,0.15)]"
          : "bg-white border-slate-200 hover:border-red-200 shadow-sm hover:shadow-lg"
      }`}
    >
      {isDark && (
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
      )}
      <div className={`w-11 h-11 rounded-xl flex items-center justify-center mb-5 border transition-all duration-300 group-hover:scale-110 ${
        isDark ? "bg-primary/10 border-primary/20 group-hover:bg-primary/20" : "bg-red-50 border-red-100"
      }`}>
        {icon}
      </div>
      <h2 className={`text-xl font-black uppercase mb-3 ${isDark ? "text-white" : "text-slate-900"}`}>{title}</h2>
      <p className={`leading-relaxed text-sm ${isDark ? "text-gray-400" : "text-slate-500"}`}>{text}</p>
    </motion.div>
  );
}

/* ── STAT CARD ─────────────────────────────────────────────────── */
function StatCard({ target, label, suffix, isDark, icon, delay }: { target: number; label: string; suffix: string; isDark: boolean; icon: React.ReactNode; delay: number }) {
  const [count, setCount] = useState(0);
  const ref = React.useRef(null);
  const inView = useInView(ref, { once: true });

  useEffect(() => {
    if (!inView) return;
    let start = 0;
    const increment = target / (1800 / 16);
    const timer = setInterval(() => {
      start += increment;
      if (start >= target) { clearInterval(timer); setCount(target); }
      else setCount(Math.floor(start));
    }, 16);
    return () => clearInterval(timer);
  }, [inView, target]);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, scale: 0.92 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay }}
      whileHover={{ y: -4 }}
      className={`relative rounded-2xl p-8 text-center border overflow-hidden group transition-all duration-500 ${
        isDark
          ? "bg-zinc-900/60 border-white/8 hover:border-primary/50 hover:shadow-[0_0_50px_rgba(204,0,0,0.18)]"
          : "bg-white border-slate-200 hover:border-red-200 shadow-sm hover:shadow-lg"
      }`}
    >
      {isDark && <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />}
      <div className={`w-10 h-10 rounded-full flex items-center justify-center mx-auto mb-4 ${isDark ? "text-primary/70" : "text-red-400"}`}>
        {icon}
      </div>
      <div className={`text-5xl md:text-6xl font-black mb-2 ${isDark ? "text-white drop-shadow-[0_0_15px_rgba(204,0,0,0.4)]" : "text-slate-900"}`}>
        {count}{suffix}
      </div>
      <div className={`text-xs font-bold tracking-[0.2em] uppercase ${isDark ? "text-primary" : "text-red-600"}`}>{label}</div>
    </motion.div>
  );
}

/* ── COMMITTEE SECTION ─────────────────────────────────────────── */
function CommitteeSection({ isDark }: { isDark: boolean }) {
  const members = useCommitteeMembers();
  const [selectedId, setSelectedId] = useState<number | null>(null);
  if (!members.length) return null;
  const active = members.find((m) => m.id === selectedId) || null;

  return (
    <section className="mb-24">
      <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-12 pb-6 border-b border-white/8">
        <p className={`text-xs font-bold tracking-[0.25em] uppercase mb-2 ${isDark ? "text-primary" : "text-red-600"}`}>Leadership</p>
        <h2 className={`text-3xl md:text-5xl font-black uppercase ${isDark ? "text-white" : "text-slate-900"}`}>
          Board of <span className={`text-transparent bg-clip-text bg-gradient-to-r from-primary to-red-400 ${isDark ? "drop-shadow-[0_0_12px_rgba(204,0,0,0.5)]" : ""}`}>Directors</span>
        </h2>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {members.map((member, i) => (
          <motion.button
            key={member.id}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.08, duration: 0.5 }}
            whileHover={{ y: -6 }}
            onClick={() => setSelectedId(member.id)}
            className={`group text-left rounded-2xl border overflow-hidden transition-all duration-500 cursor-pointer ${
              isDark
                ? "bg-zinc-900/60 border-white/8 hover:border-primary/50 hover:shadow-[0_0_40px_rgba(204,0,0,0.2)]"
                : "bg-white border-slate-200 hover:border-red-200 shadow-sm hover:shadow-xl"
            }`}
          >
            <div className="relative aspect-[3/4] overflow-hidden">
              {member.photoUrl
                ? <img src={member.photoUrl} alt={member.name} className="w-full h-full object-cover filter grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700" />
                : (
                  <div className={`w-full h-full flex items-center justify-center text-5xl font-black ${isDark ? "bg-zinc-800 text-zinc-700" : "bg-slate-100 text-slate-300"}`}>
                    {member.name.charAt(0)}
                  </div>
                )
              }
              <div className={`absolute inset-0 bg-gradient-to-t to-transparent opacity-70 transition-opacity duration-500 group-hover:opacity-40 ${isDark ? "from-black" : "from-slate-900/60"}`} />
              <div className={`absolute bottom-0 left-0 right-0 p-3 translate-y-2 opacity-0 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 text-center`}>
                <span className="text-xs text-white font-bold bg-primary/80 px-2 py-0.5 rounded-full uppercase tracking-widest">View Profile</span>
              </div>
            </div>
            <div className="p-4">
              <h3 className={`text-base font-black uppercase leading-tight ${isDark ? "text-white group-hover:text-primary" : "text-slate-900 group-hover:text-red-700"} transition-colors duration-300`}>
                {member.name}
              </h3>
              <p className={`text-xs font-bold mt-1 tracking-wider uppercase ${isDark ? "text-primary" : "text-red-600"}`}>{member.role}</p>
              {member.bio && <p className={`text-xs mt-2 line-clamp-2 ${isDark ? "text-gray-500" : "text-slate-400"}`}>{member.bio}</p>}
            </div>
          </motion.button>
        ))}
      </div>

      {/* COMMITTEE POPUP */}
      <AnimatePresence>
        {active && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[120] bg-black/85 backdrop-blur-sm p-4 flex items-center justify-center"
            onClick={() => setSelectedId(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.92, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92, y: 20 }}
              transition={{ type: "spring", stiffness: 300, damping: 24 }}
              className={`max-w-2xl w-full rounded-2xl overflow-hidden border shadow-2xl ${isDark ? "bg-zinc-950 border-white/10" : "bg-white border-slate-200"}`}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="grid md:grid-cols-2">
                <div className={`aspect-[3/4] md:aspect-auto relative overflow-hidden ${isDark ? "bg-zinc-900" : "bg-slate-100"}`}>
                  {active.photoUrl
                    ? <img src={active.photoUrl} alt={active.name} className="w-full h-full object-cover" />
                    : <div className={`w-full h-full flex items-center justify-center text-6xl font-black ${isDark ? "text-zinc-700" : "text-slate-300"}`}>{active.name.charAt(0)}</div>
                  }
                  {isDark && <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/40 to-transparent pointer-events-none" />}
                </div>
                <div className="p-6 md:p-8 flex flex-col">
                  <button onClick={() => setSelectedId(null)} className={`ml-auto mb-6 w-9 h-9 rounded-full flex items-center justify-center transition-colors border ${isDark ? "bg-zinc-800 border-white/10 hover:bg-primary text-white" : "bg-slate-100 border-slate-200 hover:bg-red-600 hover:text-white text-slate-600"}`}>
                    <X className="w-4 h-4" />
                  </button>
                  <div className={`text-xs font-bold tracking-[0.2em] uppercase mb-1 ${isDark ? "text-primary" : "text-red-600"}`}>Director</div>
                  <h3 className={`text-2xl font-black uppercase mb-1 leading-tight ${isDark ? "text-white" : "text-slate-900"}`}>{active.name}</h3>
                  <p className={`text-sm font-bold uppercase tracking-wide mb-4 ${isDark ? "text-primary/80" : "text-red-500"}`}>{active.role}</p>
                  <div className={`h-px w-12 mb-4 ${isDark ? "bg-primary/40" : "bg-red-200"}`} />
                  <p className={`text-sm leading-relaxed flex-1 ${isDark ? "text-gray-300" : "text-slate-500"}`}>
                    {active.bio || "No biography provided."}
                  </p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

/* ── PLAYERS SECTION ───────────────────────────────────────────── */
function PlayersSection({ isDark }: { isDark: boolean }) {
  const [search, setSearch] = useState("");
  const players = usePlayers(search);
  const [selectedPlayerId, setSelectedPlayerId] = useState<number | null>(null);

  return (
    <section>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-6 pb-6 border-b border-white/8">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <p className={`text-xs font-bold tracking-[0.25em] uppercase mb-2 ${isDark ? "text-primary" : "text-red-600"}`}>Our Talent</p>
          <h2 className={`text-3xl md:text-5xl font-black uppercase ${isDark ? "text-white" : "text-slate-900"}`}>
            Elite <span className={`text-transparent bg-clip-text bg-gradient-to-r from-primary to-red-400 ${isDark ? "drop-shadow-[0_0_12px_rgba(204,0,0,0.5)]" : ""}`}>Athletes</span>
          </h2>
        </motion.div>
        <div className="relative w-full md:w-72">
          <Search className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${isDark ? "text-gray-500" : "text-slate-400"}`} />
          <input
            type="text"
            placeholder="Search players..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className={`w-full rounded-full py-2.5 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all border ${
              isDark
                ? "bg-zinc-900 border-white/10 text-white placeholder:text-gray-600"
                : "bg-white border-slate-200 text-slate-900 placeholder:text-slate-400 shadow-sm"
            }`}
          />
        </div>
      </div>

      {players.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-5">
          {players.map((player, i) => (
            <motion.button
              key={player.id}
              initial={{ opacity: 0, scale: 0.88 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: (i % 5) * 0.07 }}
              whileHover={{ y: -5 }}
              onClick={() => setSelectedPlayerId(player.id)}
              className="group cursor-pointer text-left"
            >
              <div className={`aspect-[3/4] rounded-xl overflow-hidden border relative mb-3 transition-all duration-500 ${
                isDark
                  ? "bg-zinc-900 border-white/8 group-hover:border-primary/50 group-hover:shadow-[0_0_30px_rgba(204,0,0,0.25)]"
                  : "bg-slate-100 border-slate-200 group-hover:border-red-200 group-hover:shadow-lg"
              }`}>
                {player.photoUrl
                  ? <img src={player.photoUrl} alt={player.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                  : <div className={`w-full h-full flex items-center justify-center text-4xl font-black ${isDark ? "text-zinc-800" : "text-slate-300"}`}>{player.name.charAt(0)}</div>
                }
                <div className={`absolute inset-0 bg-gradient-to-t to-transparent opacity-70 ${isDark ? "from-black" : "from-slate-900/50"}`} />
                {player.district && (
                  <div className="absolute bottom-2 left-2">
                    <p className="text-primary text-[10px] font-black uppercase tracking-widest">{player.district}</p>
                  </div>
                )}
              </div>
              <h3 className={`text-sm font-black uppercase text-center leading-tight transition-colors duration-300 ${
                isDark ? "text-white group-hover:text-primary" : "text-slate-900 group-hover:text-red-700"
              }`}>{player.name}</h3>
            </motion.button>
          ))}
        </div>
      ) : (
        <div className={`text-center py-16 rounded-2xl border ${isDark ? "bg-zinc-900/40 border-white/5 text-gray-500" : "bg-white border-slate-200 text-slate-400"}`}>
          No players found{search ? ` matching "${search}"` : ""}.
        </div>
      )}

      <AnimatePresence>
        {selectedPlayerId && <PlayerPopup id={selectedPlayerId} onClose={() => setSelectedPlayerId(null)} isDark={isDark} />}
      </AnimatePresence>
    </section>
  );
}

/* ── PLAYER POPUP ──────────────────────────────────────────────── */
function PlayerPopup({ id, onClose, isDark }: { id: number; onClose: () => void; isDark: boolean }) {
  const player = usePlayerById(id);

  return createPortal(
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className={`fixed inset-0 z-[9999] backdrop-blur-xl ${isDark ? "bg-black/90" : "bg-slate-50/95"}`}
      onClick={onClose}
    >
      {/* Scrollable content area */}
      <div className="absolute inset-0 overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        {!player
          ? <div className="min-h-screen flex items-center justify-center"><div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" /></div>
          : (
            <div className="min-h-screen flex flex-col pt-16 md:pt-20">
              <div className="relative min-h-[55vh] md:h-[70vh] flex justify-center items-end pb-16 md:pb-20 px-4">
                {isDark && <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(204,0,0,0.12)_0%,transparent_60%)] pointer-events-none" />}

                <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="relative z-10 h-[45vh] md:h-full max-w-sm md:max-w-2xl w-full flex justify-center items-end">
                  {player.photoUrl
                    ? <img src={player.photoUrl} alt={player.name} className={`h-full max-h-[45vh] md:max-h-full object-contain ${isDark ? "filter drop-shadow-[0_0_40px_rgba(204,0,0,0.5)]" : "drop-shadow-2xl"}`} />
                    : (
                      <div className={`w-56 h-80 rounded-t-3xl border flex items-center justify-center ${isDark ? "bg-zinc-900 border-white/10" : "bg-slate-200 border-slate-300"}`}>
                        <div className={`text-6xl font-black ${isDark ? "text-zinc-800" : "text-slate-400"}`}>{player.name.charAt(0)}</div>
                      </div>
                    )
                  }
                </motion.div>

                <div className="absolute inset-0 pointer-events-none max-w-7xl mx-auto w-full px-4 md:px-0">
                  {/* Left side: rank annotations, stacked top-to-bottom */}
                  <div className="absolute top-4 left-4 md:top-12 md:left-16 flex flex-col gap-2 max-w-[45%] md:max-w-[180px]">
                    {[
                      { label: "District Rank", value: player.districtRank },
                      { label: "State Rank", value: player.stateRank },
                      { label: "National Rank", value: player.nationalRank },
                      { label: "International Rank", value: player.internationalRank },
                    ]
                      .filter(r => r.value && r.value !== "-")
                      .map((r, i) => (
                        <motion.div
                          key={r.label}
                          initial={{ opacity: 0, x: -30 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.3 + i * 0.1 }}
                          className={`border p-2.5 md:p-4 rounded-xl backdrop-blur-sm ${isDark ? "bg-black/80 border-primary/40" : "bg-white/90 border-red-200 shadow-lg"}`}
                        >
                          <p className="text-primary text-[9px] md:text-[11px] font-black uppercase tracking-widest mb-0.5">{r.label}</p>
                          <p className={`text-lg md:text-3xl font-black leading-none ${isDark ? "text-white" : "text-slate-900"}`}>{r.value}</p>
                        </motion.div>
                      ))
                    }
                  </div>
                  {player.district && (
                    <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.5 }} className={`absolute top-4 right-4 md:top-1/3 md:right-16 border p-3 md:p-4 rounded-xl flex items-center max-w-[50%] md:max-w-none backdrop-blur-sm ${isDark ? "bg-black/80 border-white/15" : "bg-white/90 border-slate-200 shadow-lg"}`}>
                      <MapPin className="w-4 h-4 md:w-5 md:h-5 text-primary mr-2 shrink-0" />
                      <div>
                        <p className={`text-[10px] md:text-xs font-bold uppercase tracking-widest ${isDark ? "text-gray-400" : "text-slate-500"}`}>District</p>
                        <p className={`text-sm md:text-xl font-black ${isDark ? "text-white" : "text-slate-900"}`}>{player.district}</p>
                      </div>
                    </motion.div>
                  )}
                </div>

                <div className={`absolute bottom-0 w-full bg-gradient-to-t pt-20 pb-8 text-center z-20 ${isDark ? "from-black to-transparent" : "from-slate-100 to-transparent"}`}>
                  <h1 className={`text-3xl md:text-6xl font-black uppercase tracking-tighter ${isDark ? "text-white" : "text-slate-900"}`}>{player.name}</h1>
                  {(player.blade || player.fhRubber || player.bhRubber) && (
                    <div className="flex flex-wrap justify-center gap-3 mt-3">
                      {player.blade && <span className={`text-xs px-3 py-1 rounded-full border ${isDark ? "text-gray-400 bg-white/5 border-white/10" : "text-slate-600 bg-white border-slate-200 shadow-sm"}`}>Blade: {player.blade}</span>}
                      {player.fhRubber && <span className={`text-xs px-3 py-1 rounded-full border ${isDark ? "text-gray-400 bg-white/5 border-white/10" : "text-slate-600 bg-white border-slate-200 shadow-sm"}`}>FH: {player.fhRubber}</span>}
                      {player.bhRubber && <span className={`text-xs px-3 py-1 rounded-full border ${isDark ? "text-gray-400 bg-white/5 border-white/10" : "text-slate-600 bg-white border-slate-200 shadow-sm"}`}>BH: {player.bhRubber}</span>}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )
        }
      </div>

      {/* X button — fixed to viewport, completely above everything */}
      <button
        onClick={(e) => { e.stopPropagation(); onClose(); }}
        style={{ position: "fixed", top: "1rem", right: "1rem", zIndex: 99999 }}
        className={`w-11 h-11 rounded-full flex items-center justify-center border transition-colors shadow-xl ${
          isDark
            ? "bg-zinc-900 hover:bg-primary text-white border-white/20"
            : "bg-white hover:bg-primary hover:text-white text-slate-700 border-slate-300"
        }`}
      >
        <X className="w-5 h-5" />
      </button>
    </motion.div>,
    document.body
  );
}
