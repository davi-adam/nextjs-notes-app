import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Minhas Anotações",
  description: "Um app simples de notas feito com Next.js",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className="bg-[#1c1c1a] text-[#f2f1ec] min-h-screen">
        {children}
      </body>
    </html>
  );
}