import type { Metadata } from "next";
import { Geist, Geist_Mono, Source_Serif_4 } from "next/font/google";
import type { ReactNode } from "react";
import { TooltipProvider } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import "katex/dist/katex.min.css";
import "./globals.css";

const sans = Geist({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: "variable",
  display: "swap",
});

const serif = Source_Serif_4({
  variable: "--font-serif",
  subsets: ["latin"],
  weight: "variable",
  display: "swap",
});

const mono = Geist_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: "variable",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Probabilidad y Estadística — Mgr Alfredo Delgadillo Cossio",
  description:
    "Aula de Probabilidad y Estadística para Ingeniería Civil e Informática. Docente Mgr Alfredo Delgadillo Cossio.",
};

export default function RootLayout({ children }: { readonly children: ReactNode }) {
  return (
    <html className={cn(sans.variable, serif.variable, mono.variable)} lang="es">
      <body>
        <TooltipProvider>{children}</TooltipProvider>
      </body>
    </html>
  );
}
