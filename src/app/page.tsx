import type { Metadata } from "next";
import { LandingPage } from "@/features/landing-page/components/landing-page";

export const metadata: Metadata = {
  title: "Flowbase | Visual AI Workflow Builder",
  description:
    "Design AI-powered workflows visually, trigger them from webhooks, and run them reliably with execution tracking built in.",
};

export default function Page() {
  return <LandingPage />;
}
