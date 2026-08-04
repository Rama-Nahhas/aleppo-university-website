import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function maskEmail(email: string): string {
  const [local, domain] = email.split("@");
  if (!domain || local.length <= 4) return email;

  const firstThree = local.slice(0, 2);
  const lastOne = local.slice(-1);
  const masked = "*".repeat(local.length - 3);
  return `${firstThree}${masked}${lastOne}@${domain}`;
}
