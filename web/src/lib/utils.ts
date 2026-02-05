import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Document helpers (CPF/CNPJ)
export function onlyDigits(s: string) {
  return s.replace(/\D/g, "");
}

export function formatCPF(d: string) {
  const v = d.slice(0, 11);
  return v
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d{1,2})$/, "$1-$2");
}

export function formatCNPJ(d: string) {
  const v = d.slice(0, 14);
  return v
    .replace(/(\d{2})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d)/, "$1/$2")
    .replace(/(\d{4})(\d{1,2})$/, "$1-$2");
}

export function maskByPersonType(d: string, type: "juridica" | "fisica") {
  return type === "juridica" ? formatCNPJ(d) : formatCPF(d);
}

export function maxDigitsByPersonType(type: "juridica" | "fisica") {
  return type === "juridica" ? 14 : 11;
}
