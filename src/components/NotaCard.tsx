"use client";

import { useState } from "react";
import { Nota } from "@/lib/types";
import Link from "next/link";

function formatarData(dataISO: string) {
  return new Date(dataISO).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "short",
  });
}

export default function NotaCard({ nota }: { nota: Nota }) {
  const [expandido, setExpandido] = useState(false);

  return (
    <li className="bg-[#252420] border border-[#38372f] rounded-xl p-4">
      <div className="flex items-center justify-between mb-2 gap-3">
        <h2 className="font-medium text-[#f2f1ec] truncate">{nota.titulo}</h2>
        <span className="text-xs text-[#8a8983] bg-[#302f2c] px-2 py-0.5 rounded-md shrink-0">
          {formatarData(nota.criadaEm)}
        </span>
      </div>

      {expandido && (
        <p className="text-sm text-[#b3b2ab] leading-relaxed mb-2.5">
          {nota.conteudo}
        </p>
      )}

      <div className="flex gap-4 text-sm">
        <button
          onClick={() => setExpandido(!expandido)}
          className="text-[#D4A574] hover:opacity-80 transition-opacity"
        >
          {expandido ? "Ver menos" : "Ver mais"}
        </button>
        <Link
          href={`/notas/${nota.id}`}
          className="text-[#8a8983] hover:text-[#f2f1ec] transition-colors"
        >
          Abrir
        </Link>
      </div>
    </li>
  );
}