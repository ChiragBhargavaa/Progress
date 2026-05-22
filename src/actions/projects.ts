"use server";

import { db } from "@/db";
import {
  designReferences,
  milestones,
  projects,
  requirements,
} from "@/db/schema";
import {
  decryptPassword,
  encryptPassword,
  generateProjectPassword,
  hashProjectPassword,
  verifyProjectPassword,
} from "@/lib/password";
import { createClientSession, getClientProjectId, clearClientSession } from "@/lib/client-session";
import { auth } from "@/lib/auth";
import { eq, asc, inArray } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import type { ThemeConfig } from "@/db/schema";
import { calcProgress } from "@/lib/progress";

async function requireAdmin() {
  const { data: session } = await auth.getSession();
  if (!session?.user) throw new Error("Unauthorized");
  return session;
}

export async function createProject(data: {
  clientName: string;
  projectName: string;
  initialMilestones?: string[];
}) {
  await requireAdmin();
  const plainPassword = generateProjectPassword(8);
  const passwordHash = await hashProjectPassword(plainPassword);
  const passwordEncrypted = encryptPassword(plainPassword);

  const [project] = await db
    .insert(projects)
    .values({
      clientName: data.clientName.trim(),
      projectName: data.projectName.trim(),
      passwordHash,
      passwordEncrypted,
    })
    .returning();

  if (data.initialMilestones?.length) {
    await db.insert(milestones).values(
      data.initialMilestones
        .filter((t) => t.trim())
        .map((title, i) => ({
          projectId: project!.id,
          title: title.trim(),
          sortOrder: i,
          createdBy: "admin" as const,
        }))
    );
  }

  revalidatePath("/admin");
  return { projectId: project!.id, password: plainPassword };
}

export async function listProjects() {
  await requireAdmin();
  return db.select().from(projects).orderBy(asc(projects.createdAt));
}

export async function getProjectForAdmin(id: string) {
  await requireAdmin();
  const [project] = await db.select().from(projects).where(eq(projects.id, id));
  if (!project) return null;

  const ms = await db
    .select()
    .from(milestones)
    .where(eq(milestones.projectId, id))
    .orderBy(asc(milestones.sortOrder));

  const milestoneIds = ms.map((m) => m.id);
  const reqs =
    milestoneIds.length > 0
      ? await db
          .select()
          .from(requirements)
          .where(inArray(requirements.milestoneId, milestoneIds))
          .orderBy(asc(requirements.sortOrder))
      : [];

  const refs = await db
    .select()
    .from(designReferences)
    .where(eq(designReferences.projectId, id))
    .orderBy(asc(designReferences.sortOrder));

  return { project, milestones: ms, requirements: reqs, designReferences: refs };
}

export async function revealProjectPassword(projectId: string) {
  await requireAdmin();
  const [project] = await db
    .select({ passwordEncrypted: projects.passwordEncrypted })
    .from(projects)
    .where(eq(projects.id, projectId));
  if (!project) throw new Error("Project not found");
  return decryptPassword(project.passwordEncrypted);
}

export async function updateProject(
  id: string,
  data: Partial<{
    clientName: string;
    projectName: string;
    liveSiteUrl: string | null;
    techStack: string[];
    theme: ThemeConfig;
  }>
) {
  await requireAdmin();
  await db
    .update(projects)
    .set({ ...data, updatedAt: new Date() })
    .where(eq(projects.id, id));
  revalidatePath(`/admin/projects/${id}`);
  revalidatePath("/portal");
}

export async function deleteProject(id: string) {
  await requireAdmin();
  await db.delete(projects).where(eq(projects.id, id));
  revalidatePath("/admin");
}

export async function clientLogin(password: string) {
  const all = await db.select().from(projects);
  for (const project of all) {
    const ok = await verifyProjectPassword(password.trim(), project.passwordHash);
    if (ok) {
      await createClientSession(project.id);
      return { success: true as const, projectId: project.id };
    }
  }
  return { success: false as const, error: "Invalid access code. Please check with your team." };
}

export async function clientLogout() {
  await clearClientSession();
}

export async function getProjectForClient() {
  const projectId = await getClientProjectId();
  if (!projectId) return null;
  return getProjectData(projectId);
}

export async function getProjectData(projectId: string) {
  const [project] = await db.select().from(projects).where(eq(projects.id, projectId));
  if (!project) return null;

  const ms = await db
    .select()
    .from(milestones)
    .where(eq(milestones.projectId, projectId))
    .orderBy(asc(milestones.sortOrder));

  const milestoneIds = ms.map((m) => m.id);
  const reqs =
    milestoneIds.length > 0
      ? await db
          .select()
          .from(requirements)
          .where(inArray(requirements.milestoneId, milestoneIds))
          .orderBy(asc(requirements.sortOrder))
      : [];

  const refs = await db
    .select()
    .from(designReferences)
    .where(eq(designReferences.projectId, projectId))
    .orderBy(asc(designReferences.sortOrder));

  const milestoneProgress = ms.map((m) => {
    const mReqs = reqs.filter((r) => r.milestoneId === m.id);
    return { ...m, progress: calcProgress(mReqs), requirements: mReqs };
  });

  const overallProgress = calcProgress(reqs);

  return {
    project,
    milestones: milestoneProgress,
    designReferences: refs,
    overallProgress,
  };
}

export async function addMilestone(
  projectId: string,
  title: string,
  createdBy: "admin" | "client"
) {
  if (createdBy === "admin") await requireAdmin();
  else {
    const pid = await getClientProjectId();
    if (pid !== projectId) throw new Error("Unauthorized");
  }

  const existing = await db
    .select()
    .from(milestones)
    .where(eq(milestones.projectId, projectId));
  const sortOrder = existing.length;

  const [m] = await db
    .insert(milestones)
    .values({ projectId, title: title.trim(), sortOrder, createdBy })
    .returning();

  revalidatePath("/portal");
  revalidatePath(`/admin/projects/${projectId}`);
  return m;
}

export async function updateMilestoneTitle(id: string, title: string, asAdmin: boolean) {
  if (asAdmin) await requireAdmin();
  else {
    const pid = await getClientProjectId();
    const [m] = await db.select().from(milestones).where(eq(milestones.id, id));
    if (!m || m.projectId !== pid) throw new Error("Unauthorized");
  }
  await db
    .update(milestones)
    .set({ title: title.trim(), updatedAt: new Date() })
    .where(eq(milestones.id, id));
  revalidatePath("/portal");
}

export async function addRequirement(
  milestoneId: string,
  body: string,
  createdBy: "admin" | "client"
) {
  if (createdBy === "admin") await requireAdmin();
  else {
    const pid = await getClientProjectId();
    const [m] = await db.select().from(milestones).where(eq(milestones.id, milestoneId));
    if (!m || m.projectId !== pid) throw new Error("Unauthorized");
  }

  const existing = await db
    .select()
    .from(requirements)
    .where(eq(requirements.milestoneId, milestoneId));

  await db.insert(requirements).values({
    milestoneId,
    body: body.trim(),
    createdBy,
    sortOrder: existing.length,
  });

  revalidatePath("/portal");
}

export async function toggleRequirementComplete(id: string) {
  await requireAdmin();
  const [req] = await db.select().from(requirements).where(eq(requirements.id, id));
  if (!req) return;
  await db
    .update(requirements)
    .set({ isCompleted: !req.isCompleted, updatedAt: new Date() })
    .where(eq(requirements.id, id));
  revalidatePath("/portal");
}

export async function updateRequirementBody(
  id: string,
  body: string,
  asAdmin: boolean
) {
  if (asAdmin) await requireAdmin();
  else {
    const pid = await getClientProjectId();
    const [req] = await db.select().from(requirements).where(eq(requirements.id, id));
    const [m] = req
      ? await db.select().from(milestones).where(eq(milestones.id, req.milestoneId))
      : [undefined];
    if (!m || m.projectId !== pid) throw new Error("Unauthorized");
  }
  await db
    .update(requirements)
    .set({ body: body.trim(), updatedAt: new Date() })
    .where(eq(requirements.id, id));
  revalidatePath("/portal");
}

export async function deleteRequirement(id: string, asAdmin: boolean) {
  if (asAdmin) await requireAdmin();
  else {
    const pid = await getClientProjectId();
    const [req] = await db.select().from(requirements).where(eq(requirements.id, id));
    const [m] = req
      ? await db.select().from(milestones).where(eq(milestones.id, req.milestoneId))
      : [undefined];
    if (!m || m.projectId !== pid) throw new Error("Unauthorized");
  }
  await db.delete(requirements).where(eq(requirements.id, id));
  revalidatePath("/portal");
}

export async function updateClientPreferences(data: {
  techStack: string[];
  theme: ThemeConfig;
}) {
  const projectId = await getClientProjectId();
  if (!projectId) throw new Error("Unauthorized");
  await db
    .update(projects)
    .set({
      techStack: data.techStack,
      theme: data.theme,
      updatedAt: new Date(),
    })
    .where(eq(projects.id, projectId));
  revalidatePath("/portal");
}

export async function addDesignReference(data: {
  url: string;
  comment: string;
  source: string;
}) {
  const projectId = await getClientProjectId();
  if (!projectId) throw new Error("Unauthorized");

  const existing = await db
    .select()
    .from(designReferences)
    .where(eq(designReferences.projectId, projectId));

  await db.insert(designReferences).values({
    projectId,
    url: data.url,
    comment: data.comment || null,
    source: data.source as "dribbble" | "awwwards" | "behance" | "pinterest" | "siteinspire" | "custom",
    sortOrder: existing.length,
  });
  revalidatePath("/portal");
}

export async function deleteDesignReference(id: string) {
  const projectId = await getClientProjectId();
  if (!projectId) throw new Error("Unauthorized");
  const [ref] = await db
    .select()
    .from(designReferences)
    .where(eq(designReferences.id, id));
  if (!ref || ref.projectId !== projectId) throw new Error("Unauthorized");
  await db.delete(designReferences).where(eq(designReferences.id, id));
  revalidatePath("/portal");
}

export async function adminSignupWithInvite(data: {
  name: string;
  email: string;
  password: string;
  inviteCode: string;
}) {
  if (data.inviteCode !== process.env.ADMIN_INVITE_CODE) {
    return { error: "Invalid invite code" };
  }
  const { error } = await auth.signUp.email({
    email: data.email,
    password: data.password,
    name: data.name,
  });
  if (error) {
    return { error: error.message ?? "Signup failed" };
  }
  return { success: true };
}
