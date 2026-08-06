# Minhas Anotações

Aplicação de notas construída para estudo prático de **Next.js 15 (App Router)**, **TypeScript** e **React**. O objetivo do projeto não foi apenas produzir um CRUD funcional, mas entender profundamente cada mecanismo do framework: renderização no servidor, roteamento por arquivos, Server Actions e a separação entre Server e Client Components.

Este README documenta tanto o funcionamento da aplicação quanto os conceitos técnicos estudados durante o desenvolvimento.

## Stack

| Tecnologia | Função no projeto |
|---|---|
| [Next.js 15](https://nextjs.org/) (App Router) | Framework React com renderização híbrida servidor/cliente |
| [TypeScript](https://www.typescriptlang.org/) | Tipagem estática |
| [Tailwind CSS](https://tailwindcss.com/) | Estilização via classes utilitárias |
| [React 19](https://react.dev/) | Biblioteca de componentes |
| Node.js `fs/promises` | Persistência de dados em arquivo JSON local |

Não há banco de dados nesta versão — a persistência é feita lendo e escrevendo um arquivo JSON no servidor. Essa decisão foi intencional (ver seção [Persistência de dados](#persistência-de-dados-e-suas-limitações)).

## Funcionalidades

- Listagem de notas
- Criação de nota via formulário (Server Action)
- Visualização individual por rota dinâmica (`/notas/[id]`)
- Exclusão de nota com confirmação
- Expansão/recolhimento de conteúdo por nota (estado local no cliente)
- Tratamento de rota inexistente (404 customizado via `notFound()`)

## Como rodar localmente

**Pré-requisitos:** Node.js 20+ instalado.

\`\`\`bash
# Clonar o repositório
git clone https://github.com/SEU_USUARIO/nextjs-notes-app.git
cd nextjs-notes-app

# Instalar dependências
npm install

# Copiar o arquivo de dados de exemplo
# (notas.json é ignorado pelo Git — veja "Persistência de dados")
cp src/lib/notas.example.json src/lib/notas.json

# Rodar o servidor de desenvolvimento
npm run dev
\`\`\`

Acesse [http://localhost:3000](http://localhost:3000).

## Estrutura do projeto

\`\`\`
src/
├── app/
│   ├── layout.tsx              # Layout raiz (envolve toda a aplicação)
│   ├── page.tsx                 # Rota "/" — página inicial
│   └── notas/
│       ├── layout.tsx           # Layout aninhado, específico da seção /notas
│       ├── page.tsx             # Rota "/notas" — listagem
│       ├── nova/
│       │   └── page.tsx         # Rota "/notas/nova" — formulário de criação
│       └── [id]/
│           └── page.tsx         # Rota dinâmica "/notas/:id" — detalhe
├── components/
│   ├── NotaCard.tsx              # Client Component — card individual da lista
│   └── BotaoExcluir.tsx          # Client Component — botão de exclusão
└── lib/
    ├── types.ts                  # Definições de tipos TypeScript
    ├── data.ts                   # Camada de acesso a dados (leitura/escrita do JSON)
    ├── actions.ts                 # Server Actions (mutações)
    └── notas.json                 # Dados (ignorado pelo Git)
\`\`\`

A estrutura de pastas segue a convenção de **file-based routing** do Next.js App Router: cada pasta dentro de `app/` corresponde a um segmento de URL, e o arquivo `page.tsx` dentro dela define o conteúdo renderizado nessa rota.

---

## Conceitos técnicos aplicados

### Server Components vs. Client Components

No App Router, todo componente é um **Server Component** por padrão — ele é renderizado inteiramente no servidor, e o navegador recebe apenas o HTML resultante. Isso permite, por exemplo, usar `async/await` diretamente dentro de um componente para buscar dados, sem precisar de `useEffect` + `useState`:

\`\`\`tsx
// src/app/notas/page.tsx
export default async function NotasPage() {
  const notas = await listarNotas(); // execução no servidor
  return (
    <ul>
      {notas.map((nota) => <NotaCard key={nota.id} nota={nota} />)}
    </ul>
  );
}
\`\`\`

Um componente só passa a ser um **Client Component** — executado no navegador, com acesso a hooks como `useState` e a eventos como `onClick` — quando marcado explicitamente com a diretiva `"use client"` no topo do arquivo:

\`\`\`tsx
// src/components/NotaCard.tsx
"use client";

import { useState } from "react";

export default function NotaCard({ nota }: { nota: Nota }) {
  const [expandido, setExpandido] = useState(false);
  // ...
}
\`\`\`

**Decisão de arquitetura:** a interatividade foi isolada nos menores componentes possíveis (`NotaCard`, `BotaoExcluir`), mantendo as páginas (`page.tsx`) como Server Components. Isso reduz a quantidade de JavaScript enviada ao navegador — só o que realmente precisa ser interativo roda no cliente.

### Roteamento por sistema de arquivos

O Next.js App Router não usa um arquivo de configuração de rotas — a URL é determinada pela estrutura de pastas dentro de `app/`:

| Caminho no disco | Rota resultante |
|---|---|
| `app/page.tsx` | `/` |
| `app/notas/page.tsx` | `/notas` |
| `app/notas/nova/page.tsx` | `/notas/nova` |
| `app/notas/[id]/page.tsx` | `/notas/:id` (rota dinâmica) |

Pastas entre colchetes (`[id]`) definem **segmentos dinâmicos**. O valor correspondente da URL é injetado no componente da página via a prop `params`:

\`\`\`tsx
// src/app/notas/[id]/page.tsx
export default async function NotaDetalhePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  // ...
}
\`\`\`

Note que `params` é tipado como uma `Promise` — nas versões recentes do Next.js, esse valor é assíncrono e precisa de `await` antes do uso.

### Layouts aninhados

Além de `page.tsx`, uma pasta pode conter um `layout.tsx`, que envolve todas as rotas daquele nível e dos níveis abaixo. O projeto usa dois layouts:

- `src/app/layout.tsx` — layout raiz, aplicado a toda a aplicação (define `<html>`, `<body>`, fontes, metadados globais)
- `src/app/notas/layout.tsx` — aplicado apenas às rotas dentro de `/notas`, adiciona a navegação de "voltar"

Layouts recebem o conteúdo da rota atual através da prop especial `children`:

\`\`\`tsx
export default function NotasLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div>
      <nav><Link href="/">← Voltar</Link></nav>
      {children}
    </div>
  );
}
\`\`\`

Como `/notas/[id]` e `/notas/nova` estão aninhadas dentro de `notas/`, ambas herdam automaticamente esse layout, sem precisar duplicar a navegação em cada página.

### Server Actions

A criação e exclusão de notas não passam por nenhuma rota de API criada manualmente (`/api/...`). Em vez disso, o projeto usa **Server Actions** — funções marcadas com `"use server"` que podem ser chamadas diretamente do cliente (via formulário ou evento), mas que executam inteiramente no servidor:

\`\`\`tsx
// src/lib/actions.ts
"use server";

export async function criarNotaAction(formData: FormData) {
  const titulo = formData.get("titulo") as string;
  const conteudo = formData.get("conteudo") as string;

  if (!titulo || !conteudo) return;

  await adicionarNota(titulo, conteudo);
  revalidatePath("/notas");
  redirect("/notas");
}
\`\`\`

Essa função é conectada diretamente ao atributo `action` de um formulário HTML nativo:

\`\`\`tsx
// src/app/notas/nova/page.tsx
<form action={criarNotaAction}>
  <input type="text" name="titulo" required />
  <textarea name="conteudo" required />
  <button type="submit">Salvar nota</button>
</form>
\`\`\`

O Next.js empacota automaticamente os campos do formulário em um objeto `FormData` e o repassa como argumento da Server Action — sem necessidade de `fetch`, endpoint HTTP manual, ou serialização explícita.

Para exclusão, a Server Action é chamada de forma imperativa a partir de um Client Component, após confirmação do usuário:

\`\`\`tsx
// src/components/BotaoExcluir.tsx
"use client";

<button onClick={() => {
  if (confirm("Tem certeza?")) removerNotaAction(id);
}}>
  Excluir
</button>
\`\`\`

### Revalidação de cache

O Next.js pode armazenar em cache o resultado de rotas já renderizadas. Após uma mutação (criar ou remover uma nota), é necessário invalidar esse cache explicitamente para que a UI reflita o novo estado:

\`\`\`ts
revalidatePath("/notas");
\`\`\`

Sem essa chamada, a rota `/notas` poderia continuar servindo uma versão desatualizada da lista mesmo depois da escrita no arquivo de dados.

### TypeScript: tipagem da camada de dados

Todas as notas seguem uma interface única, definida centralmente:

\`\`\`ts
// src/lib/types.ts
export interface Nota {
  id: string;
  titulo: string;
  conteudo: string;
  criadaEm: string; // ISO 8601 — datas não têm representação nativa em JSON
}
\`\`\`

Como `JSON.parse()` retorna `any` por padrão (o TypeScript não consegue inferir o formato de um arquivo JSON arbitrário em tempo de compilação), a camada de dados usa uma type assertion para restaurar a segurança de tipos:

\`\`\`ts
export async function listarNotas(): Promise<Nota[]> {
  const conteudo = await fs.readFile(caminhoArquivo, "utf-8");
  return JSON.parse(conteudo) as Nota[];
}
\`\`\`

### Persistência de dados e suas limitações

Os dados são armazenados em `src/lib/notas.json`, lido e escrito via o módulo nativo `fs/promises` do Node.js. Essa escolha foi deliberada: o objetivo do projeto era estudar os mecanismos do Next.js (Server Components, Server Actions, revalidação) sem introduzir simultaneamente a complexidade de configurar um banco de dados externo.

**Isso tem implicações importantes:**

- O arquivo de dados é ignorado pelo Git (`.gitignore`) — um arquivo de exemplo (`notas.example.json`) é versionado no lugar, e precisa ser copiado manualmente antes da primeira execução (ver [Como rodar localmente](#como-rodar-localmente)).
- Esta abordagem **não é adequada para produção**. Ambientes serverless (como a Vercel, plataforma padrão de deploy do Next.js) normalmente têm sistema de arquivos somente-leitura ou efêmero — escritas em disco não persistem entre requisições ou deploys.
- Para evoluir este projeto rumo a um deploy real, a camada `src/lib/data.ts` seria substituída por chamadas a um banco de dados (PostgreSQL via Supabase, SQLite, etc.), mantendo inalterada toda a camada de rotas, componentes e Server Actions — essa separação de responsabilidades foi um objetivo intencional da arquitetura.

## Possíveis evoluções

- [ ] Migrar a camada de persistência para um banco de dados real (Supabase/PostgreSQL)
- [ ] Autenticação de usuários (cada pessoa vê apenas suas próprias notas)
- [ ] Edição de notas existentes (atualmente só é possível criar e excluir)
- [ ] Busca/filtro na listagem
- [ ] Deploy em produção (Vercel)

## Aprendizados

Este projeto foi construído como parte de um estudo guiado e progressivo do ecossistema Next.js/React/TypeScript, partindo de fundamentos (componentes, props, JSX, tipagem estática) até a implementação de um fluxo completo de CRUD usando os mecanismos nativos mais recentes do framework — sem bibliotecas de gerenciamento de estado ou requisição HTTP de terceiros, apoiando-se inteiramente nas capacidades built-in do Next.js 15.

---

Desenvolvido por [Davi](https://github.com/SEU_USUARIO) como projeto de estudo.