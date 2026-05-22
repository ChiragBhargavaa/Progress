import { auth } from "@/lib/auth";
import { AdminHeader } from "@/components/admin-header";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function NewProjectLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session } = await auth.getSession();
  if (!session) redirect("/admin/login");

  return (
    <>
      <AdminHeader email={session.user.email} />
      {children}
    </>
  );
}
