import { criarNotaAction } from "@/lib/actions";

export default function NovaNotaPage() {
  return (
    <main>
      <h1 className="text-xl font-medium mb-5">Nova nota</h1>
      <form action={criarNotaAction} className="flex flex-col gap-4">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="titulo" className="text-xs text-[#8a8983]">
            Título
          </label>
          <input
            type="text"
            id="titulo"
            name="titulo"
            required
            placeholder="Dê um nome para sua nota"
            className="bg-[#252420] border border-[#38372f] rounded-lg px-3.5 py-2.5 text-sm text-[#f2f1ec] placeholder:text-[#5a594f] focus:outline-none focus:border-[#D4A574] transition-colors"
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label htmlFor="conteudo" className="text-xs text-[#8a8983]">
            Conteúdo
          </label>
          <textarea
            id="conteudo"
            name="conteudo"
            required
            rows={6}
            placeholder="O que você quer registrar?"
            className="bg-[#252420] border border-[#38372f] rounded-lg px-3.5 py-2.5 text-sm text-[#f2f1ec] placeholder:text-[#5a594f] focus:outline-none focus:border-[#D4A574] transition-colors resize-none"
          />
        </div>
        <button
          type="submit"
          className="inline-flex items-center justify-center gap-1.5 bg-[#D4A574] text-[#3d2a10] text-sm font-medium px-4 py-2.5 rounded-xl hover:opacity-90 transition-opacity self-start"
        >
          Salvar nota
        </button>
      </form>
    </main>
  );
}