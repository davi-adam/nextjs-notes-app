import Link from "next/link";

export default function NotasLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="max-w-md mx-auto px-6 py-10">
      <nav className="mb-6">
        <Link
          href="/"
          className="text-sm text-[#8a8983] hover:text-[#f2f1ec] transition-colors inline-flex items-center gap-1.5"
        >
          <span aria-hidden="true">←</span> Voltar
        </Link>
      </nav>
      {children}
    </div>
  );
}