"use client";

import { authClient } from "@/lib/auth-client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export function AdminHeader({ email }: { email: string }) {
  const router = useRouter();

  return (
    <header className="border-b border-border bg-card">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
        <Link href="/admin" className="text-lg font-bold">
          Progress Admin
        </Link>
        <div className="flex items-center gap-4">
          <span className="hidden text-sm text-foreground/70 sm:inline">{email}</span>
          <Button
            variant="ghost"
            type="button"
            onClick={async () => {
              await authClient.signOut();
              router.push("/admin/login");
            }}
          >
            Sign out
          </Button>
        </div>
      </div>
    </header>
  );
}
