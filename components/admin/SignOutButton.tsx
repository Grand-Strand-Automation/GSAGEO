"use client";

import { signOutAdmin } from "@/lib/auth/actions";

export function SignOutButton() {
  return (
    <form action={signOutAdmin}>
      <button
        type="submit"
        className="text-sm text-brand-blue font-semibold hover:underline"
      >
        Sign out
      </button>
    </form>
  );
}
