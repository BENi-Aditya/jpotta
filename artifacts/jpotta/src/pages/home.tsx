import React, { useEffect } from "react";
import { Link } from "wouter";
import { motion } from "framer-motion";
import useEmblaCarousel from "embla-carousel-react";
import { ChevronLeft, ChevronRight, Star, Quote, ArrowRight, Mail, Phone, MapPin, BookOpen, Target, Zap, Users } from "lucide-react";
import heroImg from "@assets/hero.png";
import facilityNew1 from "@assets/image_1776316062459.png";
import facilityNew2 from "@assets/image_1776316070209.png";
import facilityNew3 from "@assets/image_1776316081061.png";
import facilityNew4 from "@assets/image_1776316088979.png";
import { useReviews } from "@/hooks/use-store";
import { useTheme } from "@/hooks/use-theme";

export default function Home() {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  return (
    <div className={`min-h-screen font-sans selection:bg-primary selection:text-white overflow-hidden transition-colors duration-500 ${isDark ? "bg-black text-white" : "bg-slate-50 text-slate-900"}`}>

      {/* ── HERO ──────────────────────────────────────────────────── */}
      <section className="relative h-[90vh] min-h-[600px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img src={heroImg} alt="Table Tennis Player" className={`w-full h-full object-cover object-center ${isDark ? "opacity-40" : "opacity-20"}`} />
          <div className={`absolute inset-0 bg-gradient-to-t ${isDark ? "from-black via-black/50 to-transparent" : "from-slate-50 via-slate-50/70 to-transparent"}`} />
          <div className={`absolute inset-0 ${isDark ? "bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.8)_100%)]" : "bg-[radial-gradient(circle_at_center,transparent_0%,rgba(241,245,249,0.7)_100%)]"}`} />
        </div>

        {isDark && <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/20 rounded-full blur-[120px] pointer-events-none mix-blend-screen" />}

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center flex flex-col items-center">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <span className={`inline-flex items-center gap-2 py-1 px-3 rounded-full border text-xs font-bold tracking-[0.2em] uppercase mb-6 ${isDark ? "border-primary/50 bg-primary/10 text-primary shadow-[0_0_15px_rgba(204,0,0,0.3)]" : "border-red-200 bg-red-50 text-red-700"}`}>
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-400" />
              </span>
              Elite Sports Institution
            </span>
          </motion.div>

          <motion.h1
            className={`text-4xl md:text-6xl lg:text-7xl font-black uppercase tracking-tight mb-4 leading-tight ${isDark ? "" : "text-slate-900"}`}
            initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.1 }}
          >
            JP <span className={`text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-primary to-orange-400 ${isDark ? "drop-shadow-[0_0_12px_rgba(204,0,0,0.9)]" : ""}`}>Olympia</span> Table Tennis Academy
          </motion.h1>

          <motion.p className={`text-xl md:text-2xl font-light italic mb-3 tracking-wide ${isDark ? "text-gray-300" : "text-slate-600"}`} initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.2 }}>
            Your Passion&hellip;&nbsp;&nbsp;&nbsp;Our Mission&hellip;
          </motion.p>

          <motion.p className={`text-sm md:text-base max-w-3xl mx-auto mb-8 font-light leading-relaxed ${isDark ? "text-gray-300" : "text-slate-500"}`} initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.3 }}>
            Carrying forward the legacy of <span className={`font-bold ${isDark ? "text-red-400 drop-shadow-[0_0_8px_rgba(248,113,113,0.85)]" : "text-red-600"}`}>Dronacharya Awaree, Shri Jayanta Pushilal Sir</span>. Disciple, National Coach Arjun Patra carries forward his route to becoming a champion.
          </motion.p>

          <motion.div className="flex flex-col sm:flex-row gap-4" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.4 }}>
            <Link href="/about" className={`group relative inline-flex items-center justify-center px-8 py-4 font-bold text-white bg-primary overflow-hidden rounded-sm transition-all hover:scale-105 ${isDark ? "hover:shadow-[0_0_30px_rgba(204,0,0,0.6)]" : "hover:bg-red-700 shadow-lg"}`}>
              <span className="absolute inset-0 w-full h-full -mt-1 rounded-lg opacity-30 bg-gradient-to-b from-transparent via-transparent to-black" />
              <span className="relative flex items-center gap-2">Explore Academy <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" /></span>
            </Link>
            <a href="#contact" className={`inline-flex items-center justify-center px-8 py-4 font-bold rounded-sm transition-all border ${isDark ? "text-white bg-transparent border-white/20 hover:border-white/60 hover:bg-white/5" : "text-slate-800 bg-white border-slate-200 hover:border-slate-300 shadow-sm hover:shadow"}`}>
              Contact Us
            </a>
          </motion.div>
        </div>
      </section>

      {/* ── FACILITIES CAROUSEL ───────────────────────────────────── */}
      <section className={`py-24 relative border-t ${isDark ? "bg-zinc-950 border-white/5" : "bg-white border-slate-100"}`} id="facilities">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
          <p className={`text-sm font-bold tracking-widest uppercase mb-2 ${isDark ? "text-primary" : "text-red-600"}`}>Our Arena</p>
          <h3 className={`text-4xl md:text-5xl font-black uppercase tracking-tight ${isDark ? "text-white" : "text-slate-900"}`}>
            World Class <span className={`text-transparent bg-clip-text bg-gradient-to-r from-primary to-red-500 ${isDark ? "drop-shadow-[0_0_12px_rgba(204,0,0,0.4)]" : ""}`}>Facilities</span>
          </h3>
        </div>
        <FacilitiesCarousel isDark={isDark} />
      </section>

      {/* ── PLANS OFFERED ─────────────────────────────────────────── */}
      <PlansSection isDark={isDark} />

      {/* ── TESTIMONIALS ──────────────────────────────────────────── */}
      <ReviewsSection isDark={isDark} />

      {/* ── CONTACT ───────────────────────────────────────────────── */}
      <section className={`py-24 relative overflow-hidden ${isDark ? "bg-black" : "bg-slate-50"}`} id="contact">
        {isDark && <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(204,0,0,0.1),transparent_50%)] pointer-events-none" />}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16">
            <p className={`text-sm font-bold tracking-widest uppercase mb-2 ${isDark ? "text-primary" : "text-red-600"}`}>Get in touch</p>
            <h3 className={`text-4xl md:text-5xl font-black uppercase tracking-tight ${isDark ? "text-white" : "text-slate-900"}`}>
              Join The <span className={`text-transparent bg-clip-text bg-gradient-to-r from-primary to-red-500 ${isDark ? "drop-shadow-[0_0_12px_rgba(204,0,0,0.4)]" : ""}`}>Academy</span>
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <ContactCard isDark={isDark} icon={<Mail className="w-6 h-6 text-primary" />} title="Email Us" text="jpotta2018@gmail.com" />
            <ContactCard isDark={isDark} icon={<Phone className="w-6 h-6 text-primary" />} title="Call Us" text={"+91 7045702200 (For Admission)\n+91 7978834542 (Head Coach)"} />
            <ContactCard isDark={isDark} icon={<MapPin className="w-6 h-6 text-primary" />} title="Location" text="Shop No. 1 - MTNL Compound Sanabil Banquet, Marol, Andheri East, Mumbai, Maharashtra - 400059" />
          </div>
        </div>
      </section>
    </div>
  );
}

/* ── FACILITIES CAROUSEL ─────────────────────────────────────── */
function FacilitiesCarousel({ isDark }: { isDark: boolean }) {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true });
  useEffect(() => {
    if (!emblaApi) return;
    const autoplay = setInterval(() => emblaApi.scrollNext(), 4500);
    return () => clearInterval(autoplay);
  }, [emblaApi]);

  const images = [
    { src: facilityNew1, title: "Academy Training Session" },
    { src: facilityNew2, title: "Expert Coaching" },
    { src: facilityNew3, title: "Championship Arena" },
    { src: facilityNew4, title: "Elite Practice Courts" },
  ];

  return (
    <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className={`overflow-hidden rounded-2xl border shadow-2xl ${isDark ? "border-white/10 shadow-[0_0_30px_rgba(0,0,0,0.8)]" : "border-slate-200"}`} ref={emblaRef}>
        <div className="flex">
          {images.map((img) => (
            <div key={img.title} className="flex-[0_0_100%] min-w-0 relative aspect-[21/9]">
              <img src={img.src} alt={img.title} className="absolute block w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
              <div className="absolute bottom-6 left-8">
                <h4 className="text-xl md:text-3xl font-bold text-white tracking-tight drop-shadow-lg">{img.title}</h4>
              </div>
            </div>
          ))}
        </div>
      </div>
      <button onClick={() => emblaApi?.scrollPrev()} className="absolute left-8 top-1/2 -translate-y-1/2 w-12 h-12 bg-black/50 hover:bg-primary border border-white/20 text-white rounded-full flex items-center justify-center z-10 transition-colors"><ChevronLeft className="w-6 h-6" /></button>
      <button onClick={() => emblaApi?.scrollNext()} className="absolute right-8 top-1/2 -translate-y-1/2 w-12 h-12 bg-black/50 hover:bg-primary border border-white/20 text-white rounded-full flex items-center justify-center z-10 transition-colors"><ChevronRight className="w-6 h-6" /></button>
    </div>
  );
}

/* ── PLANS SECTION ───────────────────────────────────────────── */
const PLANS = [
  {
    icon: BookOpen,
    title: "Basic",
    tagline: "Foundation First",
    description: "We teach players the basics of the sport and bring every basic shot to near perfection. Ideal for beginners starting their table tennis journey.",
    color: "from-blue-500 to-blue-700",
    glow: "rgba(59,130,246,0.25)",
  },
  {
    icon: Target,
    title: "Intermediate",
    tagline: "Control & Rallies",
    description: "We teach players ball control over the tables and focus on more rallies, improving consistency and table presence across longer exchanges.",
    color: "from-emerald-500 to-emerald-700",
    glow: "rgba(16,185,129,0.25)",
  },
  {
    icon: Zap,
    title: "Advanced",
    tagline: "Placement & Footwork",
    description: "We teach players variations in shots with variety of placements and quick footwork for a dynamic, aggressive and winning game style.",
    color: "from-orange-500 to-red-600",
    glow: "rgba(249,115,22,0.25)",
  },
  {
    icon: Users,
    title: "Personalised Training",
    tagline: "Fully Customised",
    description: "A customised mix of Group + Personal + Fitness sessions based on full customisation for different players' needs, goals, and schedules.",
    color: "from-primary to-red-700",
    glow: "rgba(204,0,0,0.25)",
  },
];

function PlansSection({ isDark }: { isDark: boolean }) {
  return (
    <section className={`py-24 relative border-t ${isDark ? "bg-black border-white/5" : "bg-slate-50 border-slate-100"}`}>
      {isDark && <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,rgba(204,0,0,0.06),transparent_50%)] pointer-events-none" />}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16">
          <p className={`text-sm font-bold tracking-widest uppercase mb-3 ${isDark ? "text-primary" : "text-red-600"}`}>What We Offer</p>
          <h3 className={`text-4xl md:text-5xl font-black uppercase tracking-tight ${isDark ? "text-white" : "text-slate-900"}`}>
            Plans <span className={`text-transparent bg-clip-text bg-gradient-to-r from-primary to-red-500 ${isDark ? "drop-shadow-[0_0_12px_rgba(204,0,0,0.4)]" : ""}`}>Offered</span>
          </h3>
          <p className={`mt-4 text-sm max-w-xl mx-auto ${isDark ? "text-gray-400" : "text-slate-500"}`}>
            Choose the plan that matches your level and ambition. Every plan is guided by expert coaches with a passion for excellence.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {PLANS.map((plan, i) => {
            const Icon = plan.icon;
            return (
              <motion.div
                key={plan.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                whileHover={{ y: -6 }}
                className={`group relative rounded-2xl border p-6 overflow-hidden transition-all duration-500 ${
                  isDark
                    ? "bg-zinc-900/60 border-white/8 hover:border-white/20 hover:shadow-[0_0_40px_var(--plan-glow)]"
                    : "bg-white border-slate-200 hover:border-slate-300 shadow-sm hover:shadow-xl"
                }`}
                style={{ "--plan-glow": plan.glow } as React.CSSProperties}
              >
                {isDark && <div className="absolute inset-0 opacity-0 group-hover:opacity-100 bg-gradient-to-br from-white/[0.03] to-transparent transition-opacity duration-500 pointer-events-none" />}

                {/* Icon */}
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-5 bg-gradient-to-br ${plan.color} ${isDark ? "shadow-lg" : ""}`}>
                  <Icon className="w-6 h-6 text-white" strokeWidth={2} />
                </div>

                {/* Content */}
                <p className={`text-[10px] font-black tracking-[0.2em] uppercase mb-1 ${isDark ? "text-gray-500" : "text-slate-400"}`}>{plan.tagline}</p>
                <h4 className={`text-lg font-black uppercase mb-3 ${isDark ? "text-white" : "text-slate-900"}`}>{plan.title}</h4>
                <p className={`text-sm leading-relaxed ${isDark ? "text-gray-400" : "text-slate-500"}`}>{plan.description}</p>

                {/* Bottom accent */}
                <div className={`absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r ${plan.color} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ── REVIEWS / TESTIMONIALS ──────────────────────────────────── */
function ReviewsSection({ isDark }: { isDark: boolean }) {
  const reviews = useReviews();
  if (!reviews.length) return null;
  const repeated = [...reviews, ...reviews];

  return (
    <section className={`py-24 relative border-t overflow-hidden ${isDark ? "bg-zinc-950 border-white/5" : "bg-white border-slate-100"}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <p className={`text-sm font-bold tracking-widest uppercase mb-2 ${isDark ? "text-primary" : "text-red-600"}`}>Testimonials</p>
          <h3 className={`text-4xl md:text-5xl font-black uppercase tracking-tight ${isDark ? "text-white" : "text-slate-900"}`}>
            Voices of <span className={`text-transparent bg-clip-text bg-gradient-to-r from-primary to-red-500 ${isDark ? "drop-shadow-[0_0_12px_rgba(204,0,0,0.4)]" : ""}`}>Champions</span>
          </h3>
        </div>
      </div>

      <div className="relative">
        <div className="flex gap-5 w-max animate-[marquee_40s_linear_infinite] hover:[animation-play-state:paused] px-4">
          {repeated.map((review, i) => (
            <div key={`${review.id}-${i}`} className={`w-[320px] p-6 rounded-2xl border relative shrink-0 ${isDark ? "bg-zinc-900 border-white/8" : "bg-slate-50 border-slate-200"}`}>
              <Quote className={`absolute top-5 right-5 w-6 h-6 ${isDark ? "text-white/8" : "text-slate-200"}`} />
              <div className="flex space-x-1 mb-4">{[...Array(5)].map((_, j) => <Star key={j} className={`w-4 h-4 ${j < review.rating ? "text-primary fill-primary" : isDark ? "text-gray-700" : "text-slate-300"}`} />)}</div>
              <p className={`italic mb-5 leading-relaxed text-sm ${isDark ? "text-gray-300" : "text-slate-600"}`}>"{review.content}"</p>
              <h5 className={`font-black text-sm ${isDark ? "text-white" : "text-slate-900"}`}>{review.authorName}</h5>
              {review.authorTitle && <p className={`text-xs ${isDark ? "text-primary" : "text-red-600"}`}>{review.authorTitle}</p>}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── CONTACT CARD ────────────────────────────────────────────── */
function ContactCard({ icon, title, text, isDark }: { icon: React.ReactNode; title: string; text: string; isDark: boolean }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      whileHover={{ y: -4 }}
      className={`group rounded-2xl border p-8 text-center transition-all duration-500 ${isDark ? "bg-zinc-900 border-white/8 hover:border-primary/40 hover:shadow-[0_0_40px_rgba(204,0,0,0.12)]" : "bg-white border-slate-200 hover:border-red-200 shadow-sm hover:shadow-lg"}`}
    >
      <div className={`w-14 h-14 mx-auto rounded-full flex items-center justify-center mb-5 border transition-all duration-500 group-hover:scale-110 ${isDark ? "bg-black border-white/8 group-hover:border-primary/30" : "bg-red-50 border-red-100"}`}>
        {icon}
      </div>
      <h4 className={`text-lg font-black mb-2 ${isDark ? "text-white" : "text-slate-900"}`}>{title}</h4>
      <p className={`text-sm whitespace-pre-line ${isDark ? "text-gray-400" : "text-slate-500"}`}>{text}</p>
    </motion.div>
  );
}
