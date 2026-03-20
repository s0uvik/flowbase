import Image from "next/image";
import { integrations } from "../data";

export function LandingPageIntegrations() {
  return (
    <section
      id="integrations"
      className="border-y border-border/70 py-8 sm:py-10"
    >
      <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
        <div className="max-w-xl">
          <p className="text-sm font-semibold tracking-[0.2em] uppercase text-muted-foreground">
            Integrations in the flow
          </p>
          <p className="mt-2 text-lg text-foreground/85">
            Connect events, AI models, and delivery channels without rebuilding
            the same glue code each time.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:flex lg:flex-wrap lg:justify-end">
          {integrations.map((integration) => (
            <div
              key={integration.name}
              className="flex items-center gap-3 rounded-2xl border border-border/70 bg-card px-4 py-3 shadow-sm"
            >
              <Image
                src={integration.icon}
                alt={integration.name}
                width={20}
                height={20}
              />
              <span className="text-sm font-medium">{integration.name}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
