"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Lock } from "lucide-react";
import Link from "next/link";
import { BrandLogo } from "@/components/BrandLogo";

export default function AdminLoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = searchParams.get("next") ?? "/admin/submissions";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const resp = await fetch("/api/admin/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await resp.json();
      if (!resp.ok) {
        setError(data.error ?? "Login failed");
        return;
      }
      router.push(next);
      router.refresh();
    } catch {
      setError("Network error — please try again");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-brand-cream flex items-center justify-center px-4 pt-20">
      <div className="card-brand rounded-2xl p-10 w-full max-w-sm text-center shadow-card-md">
        <div className="flex justify-center mb-6">
          <BrandLogo onDark={false} />
        </div>
        <div className="w-12 h-12 bg-brand-blue-light rounded-full flex items-center justify-center mx-auto mb-6">
          <Lock size={20} className="text-brand-blue" />
        </div>
        <h1 className="font-heading font-bold text-xl text-brand-navy mb-2">Admin Login</h1>
        <p className="text-sm text-brand-muted mb-7">Sign in with your authorized admin account.</p>
        <form onSubmit={handleSubmit} className="space-y-3 text-left">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            required
            className="w-full border border-brand-border rounded-lg h-11 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue/30"
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            required
            className="w-full border border-brand-border rounded-lg h-11 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue/30"
          />
          {error && <p className="text-sm text-red-600 text-center">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-brand-blue hover:bg-brand-blue-hover text-white font-heading font-semibold h-11 rounded-lg text-sm disabled:opacity-60"
          >
            {loading ? "Signing in…" : "Sign in →"}
          </button>
        </form>
        <p className="text-xs text-brand-subtle mt-6">
          <Link href="/" className="hover:text-brand-navy">
            ← Back to site
          </Link>
        </p>
      </div>
    </div>
  );
}
