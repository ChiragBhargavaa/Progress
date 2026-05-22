import { getProjectForAdmin } from "@/actions/projects";
import { AdminHeader } from "@/components/admin-header";
import { auth } from "@/lib/auth";
import { redirect, notFound } from "next/navigation";

export const dynamic = "force-dynamic";
import Link from "next/link";
import { AdminProjectClient } from "./admin-project-client";

export default async function AdminProjectPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const { data: session } = await auth.getSession();
  if (!session) redirect("/admin/login");

  const data = await getProjectForAdmin(id);
  if (!data) notFound();

  return (
    <>
      <AdminHeader email={session.user.email} />
      <main className="mx-auto w-full max-w-3xl flex-1 px-6 py-8">
        <Link href="/admin" className="text-sm text-foreground/60 hover:text-foreground">
          Back to projects
        </Link>
        <h1 className="mt-4 text-2xl font-bold">{data.project.projectName}</h1>
        <p className="text-foreground/70">{data.project.clientName}</p>
        <div className="mt-8">
          <AdminProjectClient
            project={data.project}
            milestones={data.milestones}
            requirements={data.requirements}
          />
        </div>
      </main>
    </>
  );
}
