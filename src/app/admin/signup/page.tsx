"use client";

import { adminSignupWithInvite } from "@/actions/projects";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function AdminSignupPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    inviteCode: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  return (
    <main className="flex flex-1 items-center justify-center px-6 py-12">
      <Card className="w-full max-w-md">
        <Link href="/admin/login" className="text-sm text-foreground/60 hover:text-foreground">
          Back to login
        </Link>
        <h1 className="mt-4 text-2xl font-bold">Create admin account</h1>
        <p className="mt-2 text-sm text-foreground/70">
          You need an invite code from your organization to register.
        </p>
        <form
          className="mt-6 space-y-4"
          onSubmit={async (e) => {
            e.preventDefault();
            setError("");
            setLoading(true);
            const result = await adminSignupWithInvite(form);
            setLoading(false);
            if (result.error) {
              setError(result.error);
              return;
            }
            router.push("/admin/login");
          }}
        >
          <div>
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
            />
          </div>
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              required
            />
          </div>
          <div>
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              minLength={8}
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              required
            />
          </div>
          <div>
            <Label htmlFor="invite">Invite code</Label>
            <Input
              id="invite"
              value={form.inviteCode}
              onChange={(e) => setForm({ ...form, inviteCode: e.target.value })}
              required
            />
          </div>
          {error && <p className="text-sm text-red-700">{error}</p>}
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Creating account..." : "Create account"}
          </Button>
        </form>
      </Card>
    </main>
  );
}
