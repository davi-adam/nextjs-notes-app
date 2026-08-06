import { listarNotas } from "@/lib/data";
import NotaCard from "@/components/NotaCard";
import Link from "next/link";

export default async function NotasPage() {
  const notas = await listarNotas();

  return (
    <main>
      <div className="flex items-center justify-between mb-5">
        <h1 className="text-xl font-medium">Minhas notas</h1>
        <Link
          href="/notas/nova"
          className="inline-flex items-center gap-1.5 bg-[#D4A574] text-[#3d2a10] text-sm font-medium px-4 py-2 rounded-xl hover:opacity-90 transition-opacity"
        >
          <span aria-hidden="true">+</span> Nova nota
        </Link>
      </div>

      {notas.length === 0 ? (
        <p className="text-sm text-[#8a8983] text-center py-10">
          Você ainda não tem nenhuma nota.
        </p>
      ) : (
        <ul className="flex flex-col gap-2.5">
          {notas.map((nota) => (
            <NotaCard key={nota.id} nota={nota} />
          ))}
        </ul>
      )}
    </main>
  );
}