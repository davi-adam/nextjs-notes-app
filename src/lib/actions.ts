"use server"

import { adicionarNota, removerNota } from "./data";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function criarNotaAction(formData: FormData) {
    const titulo = formData.get("titulo") as string;
    const conteudo = formData.get("conteudo") as string;

    if (!titulo || !conteudo) {
        return;
    }

    await adicionarNota(titulo, conteudo);

    revalidatePath("/notas");
    redirect("/notas");
}

export async function removerNotaAction(id: string) {
    await removerNota(id);
    revalidatePath("/notas");
    redirect("/notas");
}