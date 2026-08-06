"use client";

import { removerNotaAction } from "@/lib/actions";

export default function BotaoExcluir({ id }: { id: string }) {
  return (
    <button
      onClick={() => {
        const confirmou = confirm("Tem certeza que deseja excluir esta nota?");
        if (confirmou) {
          removerNotaAction(id);
        }
      }}
      className="inline-flex items-center gap-1.5 text-sm text-[#e08585] border border-[#6b3030] px-3.5 py-2 rounded-xl hover:bg-[#6b3030]/10 transition-colors"
    >
      Excluir nota
    </button>
  );
}