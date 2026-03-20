import { ArrowRight, CheckCircle2, Play } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { highlights } from "../data";
import type { LandingPageCta } from "../types";

type Props = {
  cta: LandingPageCta;
};

export function LandingPageHero({ cta }: Props) {
  return (
    <section className="relative py-16 sm:py-20 lg:py-24">
      <div className="grid items-center gap-12 lg:grid-cols-[1.05fr_0.95fr]">
        <div className="max-w-3xl">
          <Badge variant="secondary" className="mb-5 rounded-full px-3 py-1">
            AI workflows, webhooks, and execution tracking in one place
          </Badge>
          <h1 className="max-w-3xl text-4xl font-semibold tracking-tight text-balance sm:text-5xl lg:text-6xl">
            Build the flow once. Let Flowbase run the busy work.
          </h1>
          <p className="mt-6 max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg">
            Flowbase gives teams a visual canvas for automations that combine
            triggers, HTTP actions, Slack or Discord delivery, and LLM steps
            from OpenAI or Gemini without losing control of execution.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button asChild size="lg" className="shadow-lg shadow-primary/20">
              <Link href={cta.primaryHref}>
                {cta.primaryLabel}
                <ArrowRight />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link href="#features">See product highlights</Link>
            </Button>
          </div>

          <div className="mt-8 grid gap-3 text-sm text-muted-foreground sm:grid-cols-3">
            {highlights.map((item) => (
              <div
                key={item}
                className="flex items-start gap-3 rounded-2xl border border-border/70 bg-card/70 p-4 shadow-sm backdrop-blur"
              >
                <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-primary" />
                <p>{item}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="relative">
          <div className="absolute -left-6 top-8 hidden size-28 rounded-full bg-primary/18 blur-3xl sm:block" />
          <div className="absolute bottom-0 right-0 hidden size-24 rounded-full bg-orange-300/30 blur-3xl sm:block" />

          <Card className="relative overflow-hidden border-border/70 bg-card/90 py-0 shadow-2xl shadow-primary/10">
            <div className="border-b border-border/70 bg-muted/40 px-5 py-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold">
                    Lead qualification flow
                  </p>
                  <p className="text-sm text-muted-foreground">
                    From form submission to AI summary and team handoff
                  </p>
                </div>
                <Badge className="rounded-full px-3 py-1">Live</Badge>
              </div>
            </div>

            <CardContent className="space-y-6 p-5 sm:p-6">
              <div className="grid gap-4 sm:grid-cols-3">
                <WorkflowNode
                  eyebrow="Trigger"
                  title="Google Form"
                  description="Incoming submission"
                  iconPath="/icons/googleform.svg"
                  accent="from-emerald-100 to-white"
                />
                <WorkflowNode
                  eyebrow="AI Step"
                  title="OpenAI"
                  description="Summarize intent"
                  iconPath="/icons/openai.svg"
                  accent="from-orange-100 to-white"
                />
                <WorkflowNode
                  eyebrow="Delivery"
                  title="Slack"
                  description="Post to sales channel"
                  iconPath="/icons/slack.svg"
                  accent="from-sky-100 to-white"
                />
              </div>

              <div className="rounded-2xl border border-border/70 bg-muted/35 p-4">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold">Execution timeline</p>
                    <p className="text-sm text-muted-foreground">
                      Every node result is visible while the workflow runs.
                    </p>
                  </div>
                  <div className="flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700">
                    <Play className="size-3.5 fill-current" />
                    Running
                  </div>
                </div>

                <div className="mt-4 space-y-3">
                  <ExecutionRow
                    label="Form payload received"
                    detail="Lead source, company size, and free-text request captured"
                    status="Completed"
                  />
                  <ExecutionRow
                    label="AI summary generated"
                    detail="Priority scored high and routed to human follow-up"
                    status="Completed"
                  />
                  <ExecutionRow
                    label="Slack notification sent"
                    detail="Delivered to #sales-ops with original submission attached"
                    status="Queued"
                    queued
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}

function WorkflowNode({
  eyebrow,
  title,
  description,
  iconPath,
  accent,
}: {
  eyebrow: string;
  title: string;
  description: string;
  iconPath: string;
  accent: string;
}) {
  return (
    <div
      className={`rounded-3xl border border-border/70 bg-gradient-to-br ${accent} p-4 shadow-sm`}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold tracking-[0.22em] uppercase text-muted-foreground">
            {eyebrow}
          </p>
          <p className="mt-2 text-lg font-semibold">{title}</p>
        </div>
        <div className="rounded-2xl border border-background/70 bg-background/80 p-2 shadow-sm">
          <Image src={iconPath} alt={title} width={20} height={20} />
        </div>
      </div>
      <p className="mt-4 text-sm leading-6 text-muted-foreground">
        {description}
      </p>
    </div>
  );
}

function ExecutionRow({
  label,
  detail,
  status,
  queued = false,
}: {
  label: string;
  detail: string;
  status: string;
  queued?: boolean;
}) {
  return (
    <div className="flex items-start justify-between gap-4 rounded-2xl border border-border/70 bg-background/85 px-4 py-3">
      <div className="flex items-start gap-3">
        <div
          className={`mt-1 size-2.5 rounded-full ${queued ? "bg-amber-500" : "bg-emerald-500"}`}
        />
        <div>
          <p className="font-medium">{label}</p>
          <p className="text-sm leading-6 text-muted-foreground">{detail}</p>
        </div>
      </div>
      <span
        className={`rounded-full px-2.5 py-1 text-xs font-medium ${queued ? "bg-amber-100 text-amber-800" : "bg-emerald-100 text-emerald-800"}`}
      >
        {status}
      </span>
    </div>
  );
}
