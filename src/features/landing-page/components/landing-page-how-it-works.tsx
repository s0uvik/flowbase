import { ShieldCheck } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { steps } from "../data";

export function LandingPageHowItWorks() {
  return (
    <section id="how-it-works" className="pb-16 sm:pb-20">
      <div className="grid gap-8 rounded-[2rem] border border-border/70 bg-muted/35 p-6 sm:p-8 lg:grid-cols-[0.95fr_1.05fr] lg:p-10">
        <div>
          <Badge variant="secondary" className="rounded-full px-3 py-1">
            How it works
          </Badge>
          <h2 className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl">
            Move from incoming event to completed action without losing the plot
          </h2>
          <p className="mt-4 text-lg leading-7 text-muted-foreground">
            Flowbase is structured around a simple loop: trigger a workflow,
            shape the data, execute the steps, and review what happened.
          </p>

          <div className="mt-8 rounded-3xl border border-border/70 bg-background p-5 shadow-sm">
            <div className="flex items-start gap-4">
              <div className="flex size-12 items-center justify-center rounded-2xl bg-primary/12 text-primary">
                <ShieldCheck className="size-6" />
              </div>
              <div>
                <p className="text-lg font-semibold">Operational confidence</p>
                <p className="mt-2 leading-7 text-muted-foreground">
                  Credentials, auth, async jobs, and execution visibility are
                  already part of the app, so the homepage can promise a
                  complete system instead of a rough prototype.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid gap-4">
          {steps.map(({ title, description, icon: Icon }, index) => (
            <div
              key={title}
              className="flex gap-4 rounded-3xl border border-border/70 bg-background p-5 shadow-sm"
            >
              <div className="flex flex-col items-center">
                <div className="flex size-12 items-center justify-center rounded-2xl bg-secondary text-secondary-foreground">
                  <Icon className="size-5" />
                </div>
                {index < steps.length - 1 ? (
                  <div className="mt-3 h-full w-px bg-border" />
                ) : null}
              </div>

              <div>
                <p className="text-sm font-semibold tracking-[0.22em] uppercase text-muted-foreground">
                  Step {index + 1}
                </p>
                <h3 className="mt-2 text-xl font-semibold">{title}</h3>
                <p className="mt-2 leading-7 text-muted-foreground">
                  {description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
