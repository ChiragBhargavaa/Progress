"use client";

import { clientLogin } from "@/actions/projects";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function ClientLoginPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  return (
    <main className="flex flex-1 items-center justify-center px-6 py-12">
      <Card className="w-full max-w-md">
        <Link
          href="/"
          className="text-sm text-foreground/60 hover:text-foreground"
        >
          Back to home
        </Link>
        <h1 className="mt-4 text-2xl font-bold">Client access</h1>
        <p className="mt-2 text-sm text-foreground/70">
          Enter the 8-character access code your team shared with you.
        </p>
        <form
          className="mt-6 space-y-4"
          onSubmit={async (e) => {
            e.preventDefault();
            setError("");
            setLoading(true);
            const result = await clientLogin(password);
            setLoading(false);
            if (result.success) {
              router.push("/portal");
              router.refresh();
            } else {
              setError(result.error ?? "Login failed");
            }
          }}
        >
          <div>
            <Label htmlFor="password">Access code</Label>
            <Input
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="8 characters"
              maxLength={8}
              minLength={8}
              required
              autoComplete="off"
              className="mt-1 font-mono tracking-widest"
            />
          </div>
          {error && (
            <p className="text-sm text-red-700" role="alert">
              {error}
            </p>
          )}
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Signing in..." : "View my project"}
          </Button>
        </form>
      </Card>
    </main>
  );
}
