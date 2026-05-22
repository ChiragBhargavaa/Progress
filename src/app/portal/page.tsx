import { getProjectForClient } from "@/actions/projects";
import { redirect } from "next/navigation";
import { PortalClient } from "./portal-client";

export default async function PortalPage() {
  const data = await getProjectForClient();
  if (!data) redirect("/login/client");

  return <PortalClient data={data} />;
}
