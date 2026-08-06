import fs from "fs/promises";
import path from "path";
import { Nota } from "./types";

const caminhoArquivo = path.join(process.cwd(), "src/lib/notas.json");

export async function listarNotas(): Promise<Nota[]> {
  const conteudo = await fs.readFile(caminhoArquivo, "utf-8");
  return JSON.parse(conteudo);
}

export async function adicionarNota(titulo: string, conteudo: string): Promise<void> {
  const notas = await listarNotas();

  const novaNota: Nota = {
    id: Date.now().toString(),
    titulo,
    conteudo,
    criadaEm: new Date().toISOString(),
  };

  notas.push(novaNota);

  await fs.writeFile(caminhoArquivo, JSON.stringify(notas, null, 2));
}

export async function removerNota(id: string): Promise<void> {
  const notas = await listarNotas();
  const notasAtualizadas = notas.filter((n) => n.id !== id);
  await fs.writeFile(caminhoArquivo, JSON.stringify(notasAtualizadas, null, 2));
}