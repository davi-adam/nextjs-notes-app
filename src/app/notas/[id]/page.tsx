import { listarNotas } from "@/lib/data";
import { notFound } from "next/navigation";
import BotaoExcluir from "@/components/BotaoExcluir";

export default async function NotaDetalhePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const notas = await listarNotas();
  const nota = notas.find((n) => n.id === id);

  if (!nota) {
    notFound();
  }

  const dataFormatada = new Date(nota.criadaEm).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

  return (
    <main>
      <h1 className="text-xl font-medium mb-2">{nota.titulo}</h1>
      <p className="text-xs text-[#8a8983] mb-4">
        Criada em {dataFormatada}
      </p>
      <p className="text-sm text-[#b3b2ab] leading-relaxed whitespace-pre-wrap mb-6">
        {nota.conteudo}
      </p>
      <BotaoExcluir id={nota.id} />
    </main>
  );
}