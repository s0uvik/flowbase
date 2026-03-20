import { redirect } from "next/navigation";
import { Loader2 } from "lucide-react";

export default function Page() {
  redirect("/workflows");

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background">
      <Loader2 className="w-8 h-8 animate-spin mb-4 text-primary" />
      <p className="text-muted-foreground font-medium animate-pulse">
        Redirecting to Workflows...
      </p>
    </div>
  );
}
