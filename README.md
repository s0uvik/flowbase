# 🌊 Flowbase

Welcome to **Flowbase** — a powerful, node-based visual workflow builder with built-in AI capabilities and robust background task execution.

Flowbase allows you to visually design complex processes, automate tasks, integrate with LLMs (Google Gemini & OpenAI), and execute them reliably at scale.

---

## 🚀 Features

- **Visual Workflow Builder:** Drag-and-drop node interface powered by React Flow.
- **Reliable Execution:** Background jobs and asynchronous task orchestration handled by [Inngest](https://www.inngest.com/).
- **AI Integrations:** Native support for Google Gemini and OpenAI right in your workflows.
- **Type-Safe APIs:** End-to-end type safety using tRPC, React Query, and Prisma.
- **Secure Authentication:** Managed with Better Auth with GitHub and Google social login support.
- **Modern UI:** Built with Tailwind CSS v4, Radix UI Primitives, and Shadcn UI for a clean, accessible interface.

---

## 🛠️ Tech Stack

- **Framework:** [Next.js 15 (App Router)](https://nextjs.org/) + React 19
- **Visuals:** [React Flow](https://reactflow.dev/) (`@xyflow/react`)
- **Database:** PostgreSQL with [Prisma ORM](https://www.prisma.io/)
- **Background Jobs:** [Inngest](https://inngest.com/)
- **API & Data Fetching:** [tRPC](https://trpc.io/) + [TanStack/React Query](https://tanstack.com/query/latest)
- **Styling:** Tailwind CSS v4 + [shadcn/ui](https://ui.shadcn.com/)
- **Authentication:** [Better Auth](https://better-auth.com/)
- **Linting & Formatting:** [Biome](https://biomejs.dev/)

---

## ⚙️ Prerequisites

Before you begin, ensure you have the following installed on your machine:

- **Node.js** (v20 or higher recommended)
- **npm** (or your preferred package manager like yarn/pnpm)
- A running instance of **PostgreSQL**
- An **Inngest** account or local Inngest CLI setup

---

## 🏁 Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/your-username/flowbase.git
cd flowbase
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up environment variables

Copy the example environment file into `.env` and fill in your connection strings and API keys.

```bash
cp .env.example .env
```

_(Ensure you provide the `DATABASE_URL`, `ENCRYPTION_KEY`, AI provider keys, Inngest keys, and Better Auth variables)._

### 4. Setup Database

Push the Prisma schema to your PostgreSQL database and generate the Prisma Client:

```bash
npx prisma db push
npx prisma generate
```

### 5. Start the development server

To run both the Next.js development server and the local Inngest dev server concurrently, run:

```bash
npm run dev:all
```

Alternatively, you can run them separately:

- Next.js server: `npm run dev`
- Inngest server: `npm run inngest:dev`

Open [http://localhost:3000](http://localhost:3000) with your browser to see the app.

---

## 📚 Documentation & Guides

- **[Local Webhook Testing](./docs/local-webhook-testing.md):** Learn how to use Ngrok to test external webhooks with Flowbase locally.

_(More developer guides coming soon!)_

---

## 🧑‍💻 Contributing

We welcome contributions! To ensure code quality, this project uses **Biome** for linting and formatting.

Before submitting a pull request, run:

```bash
npm run format
npm run lint
```

---

## 📝 License

No License
