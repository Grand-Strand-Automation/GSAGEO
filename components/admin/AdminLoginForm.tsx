"use client";

import { useActionState } from "react";
import { useSearchParams } from "next/navigation";
import { Lock } from "lucide-react";
import Link from "next/link";
import { BrandLogo } from "@/components/BrandLogo";
import { signInAdmin, type AdminAuthState } from "@/lib/auth/actions";

const initialState: AdminAuthState = {};

export default function AdminLoginForm() {
  const searchParams = useSearchParams();
  const next = searchParams.get("next") ?? "/admin/submissions";
  const queryError =
    searchParams.get("error") === "unauthorized"
      ? "Your account is not authorized for admin access."
      : searchParams.get("error") === "config"
        ? "Admin auth is not configured yet. Set Supabase environment variables in Vercel and redeploy."
        : "";

  const [state, formAction, pending] = useActionState(signInAdmin, initialState);
  const error = state.error ?? queryError;

  return (
    <div className="min-h-screen bg-brand-cream flex items-center justify-center px-4 py-12">
      <div className="card-brand rounded-2xl p-10 w-full max-w-sm text-center shadow-card-md">
        <div className="flex justify-center mb-6">
          <BrandLogo onDark={false} />
        </div>
        <div className="w-12 h-12 bg-brand-blue-light rounded-full flex items-center justify-center mx-auto mb-6">
          <Lock size={20} className="text-brand-blue" />
        </div>
        <h1 className="font-heading font-bold text-xl text-brand-navy mb-2">Admin Login</h1>
        <p className="text-sm text-brand-muted mb-7">
          Sign in with your authorized admin account. Public signup is disabled.
        </p>
        <form action={formAction} className="space-y-3 text-left">
          <input type="hidden" name="next" value={next} />
          <label className="block">
            <span className="sr-only">Email</span>
            <input
              type="email"
              name="email"
              autoComplete="email"
              placeholder="Email"
              required
              className="w-full border border-brand-border rounded-lg h-11 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue/30"
            />
          </label>
          <label className="block">
            <span className="sr-only">Password</span>
            <input
              type="password"
              name="password"
              autoComplete="current-password"
              placeholder="Password"
              required
              className="w-full border border-brand-border rounded-lg h-11 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue/30"
            />
          </label>
          {error && (
            <p className="text-sm text-red-600 text-center" role="alert">
              {error}
            </p>
          )}
          <button
            type="submit"
            disabled={pending}
            className="w-full bg-brand-blue hover:bg-brand-blue-hover text-white font-heading font-semibold h-11 rounded-lg text-sm disabled:opacity-60"
          >
            {pending ? "Signing in…" : "Sign in →"}
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
