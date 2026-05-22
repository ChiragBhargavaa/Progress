import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function HomePage() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center px-6 py-16">
      <div className="w-full max-w-lg text-center">
        <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
          Progress
        </h1>
        <p className="mt-4 text-lg text-foreground/75">
          A simple, beautiful way to track your project milestones and requirements
          with your team.
        </p>
        <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Link href="/login/client">
            <Button className="w-full sm:w-auto" variant="primary">
              Login as Client
            </Button>
          </Link>
          <Link href="/admin/login">
            <Button className="w-full sm:w-auto" variant="outline">
              Admin login
            </Button>
          </Link>
        </div>
      </div>
      <p className="mt-16 text-center text-xs text-foreground/50">
        Free and open source client management portal
      </p>
    </main>
  );
}
