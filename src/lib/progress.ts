import type { requirements } from "@/db/schema";

type Requirement = Pick<typeof requirements.$inferSelect, "isCompleted">;

export function calcProgress(items: Requirement[]): number {
  if (items.length === 0) return 0;
  const done = items.filter((r) => r.isCompleted).length;
  return Math.round((done / items.length) * 100);
}
