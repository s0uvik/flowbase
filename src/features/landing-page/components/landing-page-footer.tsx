import Link from "next/link";

export function LandingPageFooter() {
  return (
    <footer className="border-t border-border/70 py-6 text-sm text-muted-foreground">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p>
          Flowbase helps teams build AI-enabled workflows with clarity and
          control.
        </p>
        <div className="flex items-center gap-4">
          <Link href="/login" className="transition hover:text-foreground">
            Login
          </Link>
          <Link href="/signup" className="transition hover:text-foreground">
            Signup
          </Link>
          <Link href="/workflows" className="transition hover:text-foreground">
            Workflows
          </Link>
        </div>
      </div>
    </footer>
  );
}
