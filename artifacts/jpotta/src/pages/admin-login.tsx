import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { adminApi } from "@/lib/api";
import { Link, useLocation } from "wouter";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import logo from "@assets/Olympia_Table_Tennis_Academy_logo_1776245398644.png";

const loginSchema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(1, "Password is required"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function AdminLogin() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  useEffect(() => {
    if (adminApi.isLoggedIn()) setLocation("/admin/dashboard");
  }, []);

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { username: "", password: "" },
  });

  const onSubmit = async (data: LoginFormValues) => {
    try {
      const result = await adminApi.login(data.username, data.password);
      if (result.token) {
        adminApi.setToken(result.token);
        toast({ title: "Login successful", description: "Welcome to the admin dashboard." });
        setLocation("/admin/dashboard");
      } else {
        toast({ title: "Login failed", description: result.message ?? "Invalid credentials.", variant: "destructive" });
      }
    } catch {
      toast({ title: "Login failed", description: "Invalid username or password.", variant: "destructive" });
    }
  };

  return (
    <div className="min-h-screen bg-black flex flex-col justify-center items-center p-4 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(204,0,0,0.15),transparent_70%)] pointer-events-none" />
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-zinc-950 border border-white/10 rounded-xl shadow-[0_0_40px_rgba(204,0,0,0.2)] p-8 relative z-10"
      >
        <div className="flex justify-between items-center mb-8">
          <Link href="/" className="text-xs font-bold tracking-wide text-gray-300 hover:text-primary transition-colors">← Back to Site</Link>
          <div className="flex-1 flex justify-center"><img src={logo} alt="JPOTTA Logo" className="h-20 w-auto drop-shadow-[0_0_10px_rgba(204,0,0,0.5)]" /></div>
          <div className="w-[88px]" />
        </div>

        <div className="text-center mb-8">
          <h1 className="text-2xl font-black text-white uppercase tracking-widest">Admin Portal</h1>
          <p className="text-gray-400 text-sm mt-2">Sign in to manage academy content</p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-300">Username</FormLabel>
                  <FormControl>
                    <Input {...field} className="bg-zinc-900 border-white/10 text-white focus-visible:ring-primary focus-visible:border-primary" />
                  </FormControl>
                  <FormMessage className="text-primary" />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-300">Password</FormLabel>
                  <FormControl>
                    <Input type="password" {...field} className="bg-zinc-900 border-white/10 text-white focus-visible:ring-primary focus-visible:border-primary" />
                  </FormControl>
                  <FormMessage className="text-primary" />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              disabled={form.formState.isSubmitting}
              className="w-full bg-primary hover:bg-red-700 text-white font-bold tracking-widest uppercase transition-colors"
            >
              {form.formState.isSubmitting ? "Signing in..." : "Sign In"}
            </Button>
          </form>
        </Form>
      </motion.div>
    </div>
  );
}
