import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { absoluteUrl } from "@/lib/seo/site-url";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function appUrl(path = ""): string {
  return absoluteUrl(path.startsWith("/") ? path : `/${path}`);
}
