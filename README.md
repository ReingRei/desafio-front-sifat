# Desafio Técnico Full Stack - SIFAT Sistemas: Front-End

## Objetivo do Projeto

Este repositório contém a solução Front-End para o Desafio Técnico da SIFAT Sistemas.pdf, source 2]. O objetivo é construir uma aplicação React moderna, responsiva e de alta qualidade para interagir com os microsserviços do backend, demonstrando proficiência no consumo de APIs REST e gerenciamento de estado.

## Arquitetura e Modo de Operação

A aplicação foi projetada para funcionar em dois modos de operação, conforme especificado no desafio.pdf, source 9]:

1.  **Modo API (Padrão):**
    * Quando a variável de ambiente `VITE_PRODUCT_API_URL` (ou `VITE_INVENTORY_API_URL`) é detectada, a aplicação entra em modo de produção.
    * Todas as chamadas (CRUD de produtos, ajuste de estoque) são feitas para as APIs REST dos microsserviços de backend.
    * Um interceptor global do Axios é usado para tratar erros da API de forma centralizada, exibindo mensagens de erro legíveis para o usuário.

2.  **Modo Local (Fallback):**
    * Se as variáveis de ambiente da API não estiverem configuradas, a aplicação entra automaticamente em modo local.pdf, source 9].
    * Os "Services" (ex: `ProductService`) redirecionam as chamadas para uma implementação "fake" (`products-local.ts`) que persiste os dados no **LocalStorage** do navegador.
    * Isso permite que o frontend seja totalmente testável e funcional sem depender do backend.

---

## Padrões de Estrutura e Qualidade

O projeto foi estruturado visando clareza, manutenibilidade e reutilização:

* **`src/pages`**: Contém os componentes "container" (ex: `ProductListPage.tsx`), responsáveis por gerenciar o estado principal, buscar dados e lidar com a lógica da página.
* **`src/components`**: Contém componentes "burros" (reutilizáveis), que apenas recebem `props` e exibem UI (ex: `ProductTable.tsx`, `TopActionBar.tsx`).
* **`src/components/modals`**: Componentes de modal especializados (ex: `ProductFormModal.tsx`), que gerenciam seu próprio estado de formulário.
* **`src/api`**: Camada de abstração de dados. Separa a lógica de `axios` (`-api.ts`), a lógica de `LocalStorage` (`-local.ts`) e o "decisor" (`-service.ts`) que exporta a implementação correta.
* **`src/types`**: Definições TypeScript (interfaces) para `Product`, `Category`, `PageResponse`, etc., garantindo type-safety em toda a aplicação.

### Tecnologias Principais

| Categoria | Tecnologia | Uso no Projeto |
| :--- | :--- | :--- |
| **Framework** | React 18+ | Biblioteca principal da UI. |
| **Build Tool** | Vite | Ambiente de desenvolvimento e build de alta performance.pdf, source 16]. |
| **Estilização** | TailwindCSS | Framework CSS utility-first (assumido, baseado nos `className`). |
| **Testes** | Vitest & React Testing Library | Testes unitários e de componentes. |
| **Requisições** | Axios | Cliente HTTP para consumo da API REST.pdf, source 18]. |
| **Ícones** | Heroicons | Biblioteca de ícones SVG. |
| **Estado** | React Hooks (useState/useEffect) | Gerenciamento de estado local e de componentes. |

---

## Instruções de Execução

### Pré-requisitos

* Node.js (v18 ou superior)
* NPM ou Yarn

### 1. Setup (Variáveis de Ambiente)

O projeto utiliza um arquivo `.env.example` para listar as variáveis necessárias.

1.  Clone o repositório.
2.  Execute o comando para instalar as dependências:
  ```bash
    npm install
    ```
3.  Na raiz do projeto, copie o arquivo de exemplo:
    ```bash
    cp .env.example .env
    ```
### 2. Configurando os Modos de Operação

#### Modo Local

Para rodar usando o LocalStorage (sem o backend):

1.  Garanta que seu arquivo `.env` esteja com as variáveis de API vazias ou comentadas.
2.  Inicie o servidor de desenvolvimento:
    ```bash
    npm install
    npm run dev
    ```
3.  Acesse `http://localhost:5173` (ou a porta indicada pelo Vite).

#### Modo API (Conectado ao Backend)

Para conectar ao backend (que deve estar rodando via Docker):

1.  Garanta que as variáveis de API estão preenchidas conforme o arquivo .env.example;
2.  Rode `npm run dev` (reinicie se já estiver rodando). A aplicação detectará as URLs e se conectará à API.

### 3. Scripts Disponíveis

| Comando | Descrição |
| :--- | :--- |
| `npm run dev` | Inicia o servidor de desenvolvimento em modo *watch*. |
| `npm run build` | Gera a build de produção (estática) na pasta `/dist`. |
| `npm test` | Roda os testes unitários (Vitest) em modo *watch*. |
| `npm run coverage` | Roda os testes uma vez e gera um relatório de cobertura. |

---

## ✅ Cobertura de Testes Automatizados

O projeto inclui testes unitários automatizados usando **Vitest** e **React Testing Library**.

Foram incluídos testes de somente alguns components.

* **Testes de Componentes/Páginas:** Focam em testar o comportamento da UI como um usuário final (renderização condicional, interações de clique e digitação).
* **Mocks:** Os serviços de API (`ProductService`) são "mockados" para simular cenários de sucesso, erro e carregamento, validando a