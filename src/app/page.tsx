import Link from "next/link";

export default function Home() {
  return (
    <main className="max-w-md mx-auto px-6 py-20 text-center">
      <div className="w-12 h-12 bg-[#302f2c] rounded-xl flex items-center justify-center mx-auto mb-4">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="22"
          height="22"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#D4A574"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M9 3h6l4 4v11a2 2 0 0 1 -2 2h-8a2 2 0 0 1 -2 -2v-13a2 2 0 0 1 2 -2z" />
          <path d="M13 3v5h5" />
          <path d="M9 13h6" />
          <path d="M9 17h4" />
        </svg>
      </div>
      <h1 className="text-2xl font-medium mb-1.5">Minhas anotações</h1>
      <p className="text-sm text-[#8a8983] mb-6">
        Suas ideias, organizadas num só lugar.
      </p>
      <Link
        href="/notas"
        className="inline-flex items-center gap-1.5 bg-[#D4A574] text-[#3d2a10] text-sm font-medium px-5 py-2.5 rounded-xl hover:opacity-90 transition-opacity"
      >
        Ver minhas notas
        <span aria-hidden="true">→</span>
      </Link>
    </main>
  );
}