import { listProjects } from "@/actions/projects";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Link from "next/link";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";
import { AdminHeader } from "@/components/admin-header";

export default async function AdminDashboardPage() {
  const { data: session } = await auth.getSession();
  if (!session) redirect("/admin/login");

  const projectList = await listProjects();

  return (
    <>
      <AdminHeader email={session.user.email} />
      <main className="mx-auto w-full max-w-5xl flex-1 px-6 py-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold">Projects</h1>
            <p className="text-sm text-foreground/70">
              Manage client projects, milestones, and progress.
            </p>
          </div>
          <Link href="/admin/projects/new">
            <Button>New project</Button>
          </Link>
        </div>

        {projectList.length === 0 ? (
          <Card className="mt-8 text-center">
            <p className="text-foreground/70">No projects yet.</p>
            <Link href="/admin/projects/new" className="mt-4 inline-block">
              <Button variant="secondary">Create your first project</Button>
            </Link>
          </Card>
        ) : (
          <ul className="mt-8 grid gap-4 sm:grid-cols-2">
            {projectList.map((p) => (
              <li key={p.id}>
                <Link href={`/admin/projects/${p.id}`}>
                  <Card className="transition-shadow hover:shadow-md">
                    <h2 className="font-semibold">{p.projectName}</h2>
                    <p className="text-sm text-foreground/70">{p.clientName}</p>
                  </Card>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </main>
    </>
  );
}
