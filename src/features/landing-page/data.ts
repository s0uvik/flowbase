import {
  Bot,
  Clock3,
  GitBranchPlus,
  type LucideIcon,
  Sparkles,
  Webhook,
  Workflow,
  Zap,
} from "lucide-react";

export const integrations = [
  { name: "Google Forms", icon: "/icons/googleform.svg" },
  { name: "Stripe", icon: "/icons/stripe.svg" },
  { name: "OpenAI", icon: "/icons/openai.svg" },
  { name: "Gemini", icon: "/icons/gemini.svg" },
  { name: "Slack", icon: "/icons/slack.svg" },
  { name: "Discord", icon: "/icons/discord.svg" },
];

export const featureCards: Array<{
  title: string;
  description: string;
  icon: LucideIcon;
}> = [
  {
    title: "Visual workflow builder",
    description:
      "Map triggers, AI steps, and outbound actions in a drag-and-drop canvas that is easy to reason about.",
    icon: Workflow,
  },
  {
    title: "Reliable background execution",
    description:
      "Flowbase is wired for async execution so heavy jobs and event-driven flows do not block the UI.",
    icon: Clock3,
  },
  {
    title: "AI nodes built in",
    description:
      "Use OpenAI and Gemini directly inside workflows for classification, generation, and decision-making.",
    icon: Bot,
  },
  {
    title: "Webhook and credential ready",
    description:
      "Connect forms, payments, APIs, and team tools with reusable credentials and trigger endpoints.",
    icon: Webhook,
  },
];

export const steps: Array<{
  title: string;
  description: string;
  icon: LucideIcon;
}> = [
  {
    title: "Start with a trigger",
    description:
      "Kick off flows manually or from live events like Google Form submissions and Stripe activity.",
    icon: GitBranchPlus,
  },
  {
    title: "Add logic and AI",
    description:
      "Chain HTTP requests, LLM steps, and handoff nodes together to shape the data exactly how you need.",
    icon: Sparkles,
  },
  {
    title: "Ship outcomes",
    description:
      "Send results to Slack, Discord, or your own APIs and track the execution trail from one place.",
    icon: Zap,
  },
];

export const highlights = [
  "Node-based workflow editor powered by React Flow",
  "Execution tracking and async orchestration with Inngest",
  "Authentication, billing, and credentials ready for SaaS workflows",
];

export const pricingPlans = [
  {
    name: "Starter",
    price: "Free",
    description:
      "A clean way to explore the builder, run your first automation, and validate the flow before you scale it out.",
    summary: "Best for solo testing and first workflows",
    features: [
      "Create and run 1 workflow",
      "Visual builder with execution history",
      "Manual and event-based workflow runs",
      "Email and social sign-in",
    ],
  },
  {
    name: "Pro",
    price: "Premium",
    description:
      "Unlock the paid workflow path for teams that need multiple automations, reusable credentials, and a smoother production setup.",
    summary: "Best for active automations and team handoff",
    features: [
      "Create more than 1 workflow",
      "Save and reuse credentials",
      "Unlock premium-gated product features",
      "Manage billing from your account",
    ],
  },
];
