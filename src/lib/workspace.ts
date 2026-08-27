import { prisma } from "./prisma";

export async function getOrCreateWorkspace() {
  const existing = await prisma.workspace.findFirst({
    orderBy: { createdAt: "asc" },
  });
  if (existing) return existing;
  return prisma.workspace.create({
    data: { name: "Default workspace" },
  });
}
