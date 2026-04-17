import React, { useState, useEffect } from "react";
import { Switch, Route, Router as WouterRouter } from "wouter";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ChevronUp } from "lucide-react";
import NotFound from "@/pages/not-found";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Home from "@/pages/home";
import About from "@/pages/about";
import News from "@/pages/news";
import Achievements from "@/pages/achievements";
import AdminLogin from "@/pages/admin-login";
import AdminDashboard from "@/pages/admin-dashboard";
import Legal, { privacySections, refundSections, shippingSections, termsSections } from "@/pages/legal";
import { ThemeProvider } from "@/hooks/use-theme";

function BackToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 400);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      aria-label="Back to top"
      className={`fixed bottom-8 right-8 z-50 w-12 h-12 rounded-full bg-primary text-white flex items-center justify-center shadow-[0_0_20px_rgba(204,0,0,0.5)] hover:bg-red-700 hover:scale-110 transition-all duration-300 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4 pointer-events-none"}`}
    >
      <ChevronUp className="w-6 h-6" />
    </button>
  );
}

function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col min-h-screen bg-black">
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}

function Router() {
  return (
    <Switch>
      <Route path="/"><PublicLayout><Home /></PublicLayout></Route>
      <Route path="/about"><PublicLayout><About /></PublicLayout></Route>
      <Route path="/news"><PublicLayout><News /></PublicLayout></Route>
      <Route path="/achievements"><PublicLayout><Achievements /></PublicLayout></Route>
      <Route path="/terms-and-conditions"><PublicLayout><Legal title="Terms and Conditions" sections={termsSections} /></PublicLayout></Route>
      <Route path="/privacy-policy"><PublicLayout><Legal title="Privacy Policy" sections={privacySections} /></PublicLayout></Route>
      <Route path="/refund-cancellation-policy"><PublicLayout><Legal title="Cancellation & Refund Policy" sections={refundSections} /></PublicLayout></Route>
      <Route path="/shipping-delivery"><PublicLayout><Legal title="Shipping & Delivery" sections={shippingSections} /></PublicLayout></Route>
      <Route path="/admin"><AdminLogin /></Route>
      <Route path="/admin/dashboard"><AdminDashboard /></Route>
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ThemeProvider>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
          <Router />
          <BackToTop />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </ThemeProvider>
  );
}

export default App;
