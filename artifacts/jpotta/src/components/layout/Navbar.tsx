import React, { useState } from "react";
import { Link, useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Moon, Sun } from "lucide-react";
import logo from "@assets/Olympia_Table_Tennis_Academy_logo_1776245398644.png";
import { useTheme } from "@/hooks/use-theme";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [location, setLocation] = useLocation();
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";

  const isHome = location === "/";
  const isAbout = location === "/about";
  const isNews = location === "/news";
  const isAchievements = location === "/achievements";

  const scrollToSection = (id: string) => {
    const section = document.getElementById(id);
    if (section) section.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const navigateHome = () => {
    if (location === "/") window.scrollTo({ top: 0, behavior: "smooth" });
    else { setLocation("/"); setTimeout(() => window.scrollTo({ top: 0, behavior: "smooth" }), 100); }
  };

  const navigateContact = () => {
    if (location === "/") scrollToSection("contact");
    else { setLocation("/"); setTimeout(() => scrollToSection("contact"), 120); }
    setIsOpen(false);
  };

  const navBase = isDark
    ? "bg-black/85 backdrop-blur-md border-white/8 shadow-[0_0_15px_rgba(204,0,0,0.12)]"
    : "bg-white/90 backdrop-blur-md border-slate-200 shadow-sm";

  const linkActive = isDark ? "text-primary drop-shadow-[0_0_5px_rgba(204,0,0,0.8)]" : "text-red-700 font-bold";
  const linkIdle = isDark ? "text-gray-300 hover:text-primary" : "text-slate-600 hover:text-red-700";

  return (
    <nav className={`sticky top-0 z-50 w-full border-b transition-all duration-500 ${navBase}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20 gap-3">
          <button onClick={navigateHome} className="flex items-center shrink-0 gap-3 text-left">
            <img
              src={logo}
              alt="JPOTTA Logo"
              className={`h-12 w-auto cursor-pointer transition-all ${isDark ? "drop-shadow-[0_0_8px_rgba(204,0,0,0.8)]" : "drop-shadow-sm"}`}
            />
            <span className={`hidden sm:block font-black tracking-[0.25em] text-sm ${isDark ? "text-white" : "text-slate-900"}`}>JPOTTA</span>
          </button>

          <div className="hidden md:flex md:items-center md:space-x-8">
            {[
              { label: "HOME", active: isHome, action: navigateHome, isButton: true },
            ].map(({ label, active, action }) => (
              <button key={label} onClick={action} className={`text-sm font-semibold transition-colors duration-300 ${active ? linkActive : linkIdle}`}>
                {label}
              </button>
            ))}
            <Link href="/about" className={`text-sm font-semibold transition-colors duration-300 ${isAbout ? linkActive : linkIdle}`}>ABOUT</Link>
            <Link href="/news" className={`text-sm font-semibold transition-colors duration-300 ${isNews ? linkActive : linkIdle}`}>NEWS</Link>
            <Link href="/achievements" className={`text-sm font-semibold transition-colors duration-300 ${isAchievements ? linkActive : linkIdle}`}>ACHIEVEMENTS</Link>
            <button onClick={navigateContact} className={`text-sm font-semibold transition-colors duration-300 ${linkIdle}`}>CONTACT</button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={toggleTheme}
              className={`w-10 h-10 rounded-full border flex items-center justify-center transition-all duration-300 hover:scale-110 ${
                isDark
                  ? "border-white/15 bg-zinc-900/80 text-gray-200 hover:text-primary hover:border-primary/40"
                  : "border-slate-200 bg-white text-slate-600 hover:text-red-700 hover:border-red-200 shadow-sm"
              }`}
              aria-label="Toggle theme"
            >
              {isDark
                ? <Sun className="w-4 h-4" />
                : <Moon className="w-4 h-4" />
              }
            </button>

            <div className="flex md:hidden">
              <button
                onClick={() => setIsOpen(!isOpen)}
                className={`inline-flex items-center justify-center p-2 rounded-md transition-colors ${isDark ? "text-gray-400 hover:text-white hover:bg-white/5" : "text-slate-500 hover:text-slate-900 hover:bg-slate-100"} focus:outline-none`}
              >
                {isOpen ? <X className="block h-6 w-6 text-primary" /> : <Menu className="block h-6 w-6" />}
              </button>
            </div>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className={`md:hidden border-t ${isDark ? "bg-zinc-900 border-white/5" : "bg-white border-slate-100"}`}
          >
            <div className="px-4 py-3 space-y-1">
              {[
                { label: "Home", action: () => { navigateHome(); setIsOpen(false); } },
              ].map(({ label, action }) => (
                <button key={label} onClick={action} className={`w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${isDark ? "text-white hover:text-primary hover:bg-black" : "text-slate-700 hover:text-red-700 hover:bg-slate-50"}`}>{label}</button>
              ))}
              <Link href="/about" className={`block px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${isDark ? "text-white hover:text-primary hover:bg-black" : "text-slate-700 hover:text-red-700 hover:bg-slate-50"}`} onClick={() => setIsOpen(false)}>About</Link>
              <Link href="/news" className={`block px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${isDark ? "text-white hover:text-primary hover:bg-black" : "text-slate-700 hover:text-red-700 hover:bg-slate-50"}`} onClick={() => setIsOpen(false)}>News</Link>
              <Link href="/achievements" className={`block px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${isDark ? "text-white hover:text-primary hover:bg-black" : "text-slate-700 hover:text-red-700 hover:bg-slate-50"}`} onClick={() => setIsOpen(false)}>Achievements</Link>
              <button onClick={navigateContact} className={`w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${isDark ? "text-white hover:text-primary hover:bg-black" : "text-slate-700 hover:text-red-700 hover:bg-slate-50"}`}>Contact</button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
