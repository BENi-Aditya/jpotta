import React from "react";
import { Link } from "wouter";
import logo from "@assets/Olympia_Table_Tennis_Academy_logo_1776245398644.png";
import { MapPin, Phone, Mail, Instagram, Facebook, Youtube, Linkedin } from "lucide-react";
import { useTheme } from "@/hooks/use-theme";

export default function Footer() {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  return (
    <footer className={`border-t pt-16 pb-8 relative overflow-hidden transition-colors duration-500 ${isDark ? "bg-black border-white/10" : "bg-slate-900 border-slate-700"}`} id="footer">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_center,rgba(204,0,0,0.15),transparent_50%)] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          <div>
            <Link href="/" className="inline-flex items-center gap-3 mb-6">
              <img src={logo} alt="JPOTTA Logo" className="h-16 w-auto drop-shadow-[0_0_10px_rgba(204,0,0,0.5)]" />
              <span className="text-white font-black tracking-[0.24em] text-sm">JPOTTA</span>
            </Link>
            <p className="text-gray-400 text-sm leading-relaxed mb-6">
              JP Olympia Table Tennis Academy. Your Passion, Our Mission. Fostering excellence and building champions.
            </p>
            <div className="flex flex-wrap gap-3">
              <a href="https://www.instagram.com/tabletennis_jpotta/" target="_blank" rel="noreferrer" className="w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center text-gray-400 hover:text-primary hover:bg-zinc-700 transition-all duration-300"><Instagram className="w-5 h-5" /></a>
              <a href="https://www.facebook.com/Jpotta28/" target="_blank" rel="noreferrer" className="w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center text-gray-400 hover:text-primary hover:bg-zinc-700 transition-all duration-300"><Facebook className="w-5 h-5" /></a>
              <a href="https://www.youtube.com/@jpolympiatabletennisacadem44" target="_blank" rel="noreferrer" className="w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center text-gray-400 hover:text-primary hover:bg-zinc-700 transition-all duration-300"><Youtube className="w-5 h-5" /></a>
              <a href="https://www.linkedin.com/company/jpotta-mumbai" target="_blank" rel="noreferrer" className="w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center text-gray-400 hover:text-primary hover:bg-zinc-700 transition-all duration-300"><Linkedin className="w-5 h-5" /></a>
            </div>
          </div>

          <div>
            <h3 className="text-white font-bold tracking-wider mb-6 text-lg">QUICK LINKS</h3>
            <ul className="space-y-4">
              <li><Link href="/" className="text-gray-400 hover:text-primary transition-colors text-sm">Home</Link></li>
              <li><Link href="/about" className="text-gray-400 hover:text-primary transition-colors text-sm">About Us</Link></li>
              <li><Link href="/news" className="text-gray-400 hover:text-primary transition-colors text-sm">News & Updates</Link></li>
              <li><Link href="/achievements" className="text-gray-400 hover:text-primary transition-colors text-sm">Achievements</Link></li>
              <li><a href="https://wa.me/917045702200" target="_blank" rel="noreferrer" className="text-gray-400 hover:text-primary transition-colors text-sm">WhatsApp</a></li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-bold tracking-wider mb-6 text-lg">CENTRES</h3>
            <ul className="space-y-3">
              <li className="text-gray-400 text-sm">JPOTTA, Marol (Main Centre)</li>
              <li className="text-gray-400 text-sm">Kalpataru Society, Ghatkopar West (Only for society members)</li>
              <li className="text-gray-400 text-sm">Bombay Scottish School, Powai (Only for BSS students)</li>
              <li className="text-gray-400 text-sm">Jolly Gymkhana, Ghatkopar West (Specific Hours of Coaching only)</li>
              <li className="text-gray-400 text-sm">SEBI Bhavan, BKC (Only for SEBI Employees)</li>
            </ul>
          </div>

          <div id="contact">
            <h3 className="text-white font-bold tracking-wider mb-6 text-lg">CONTACT US</h3>
            <ul className="space-y-4">
              <li className="flex items-start space-x-3 text-gray-400 text-sm">
                <MapPin className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                <span>Shop No. 1 - MTNL Compound Sanabil Banquet, 139A, Marol Maroshi Rd, opp. Marol Fire Brigade, Marol Naka, Marol, Andheri East, Mumbai, Maharashtra - 400059</span>
              </li>
              <li className="flex items-start space-x-3 text-gray-400 text-sm">
                <Phone className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                <span>+91 7045702200 (For Admission)<br />+91 7978834542 (Head Coach)</span>
              </li>
              <li className="flex items-center space-x-3 text-gray-400 text-sm">
                <Mail className="w-5 h-5 text-primary shrink-0" />
                <span>jpotta2018@gmail.com</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-500 text-xs">&copy; {new Date().getFullYear()} JP Olympia Table Tennis Academy. All rights reserved.</p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/privacy-policy" className="text-gray-500 hover:text-white text-xs transition-colors">Privacy Policy</Link>
            <Link href="/terms-and-conditions" className="text-gray-500 hover:text-white text-xs transition-colors">Terms & Conditions</Link>
            <Link href="/refund-cancellation-policy" className="text-gray-500 hover:text-white text-xs transition-colors">Cancellation & Refund</Link>
            <Link href="/shipping-delivery" className="text-gray-500 hover:text-white text-xs transition-colors">Shipping & Delivery</Link>
            <Link href="/admin" className="text-zinc-700 hover:text-primary text-xs transition-colors">Admin</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
