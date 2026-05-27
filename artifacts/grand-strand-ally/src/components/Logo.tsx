import React from "react";
import { Link } from "wouter";

export function Logo({ className = "" }: { className?: string }) {
  return (
    <Link href="/" className={`flex items-center gap-2 group ${className}`}>
      <svg
        width="32"
        height="32"
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="text-accent flex-shrink-0"
      >
        <path
          d="M16 2L3 8V16C3 23.5 8.5 30 16 32C23.5 30 29 23.5 29 16V8L16 2Z"
          fill="currentColor"
          fillOpacity="0.2"
        />
        <path
          d="M16 4.5L5.5 9.5V16C5.5 22 10 27.5 16 29C22 27.5 26.5 22 26.5 16V9.5L16 4.5Z"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M16 11V22M11 16H21"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>
      <span className="font-heading font-bold text-xl text-primary tracking-tight group-hover:text-accent transition-colors">
        Grand Strand Ally
      </span>
    </Link>
  );
}
