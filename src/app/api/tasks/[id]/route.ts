import { NextResponse } from "next/server";
import { prisma } from "@/src/lib/prisma";

export async function GET(_: Request, { params }: { params: { id: string } }) {
  const task = await prisma.task.findUnique({ where: { id: params.id } });
  if (!task) return NextResponse.json({ error: "not found" }, { status: 404 });
  return NextResponse.json({ task });
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  const body = await req.json().catch(() => ({}));

  const task = await prisma.task.update({
    where: { id: params.id },
    data: {
      title: body.title !== undefined ? String(body.title).trim() : undefined,
      description: body.description !== undefined ? String(body.description) : undefined,
      assignee: body.assignee !== undefined ? String(body.assignee) : undefined,
      dueDate: body.dueDate !== undefined ? String(body.dueDate) : undefined,
      status: body.status !== undefined ? String(body.status) : undefined,
    },
  });

  return NextResponse.json({ task });
}

export async function DELETE(_: Request, { params }: { params: { id: string } }) {
  await prisma.task.delete({ where: { id: params.id } });
  return NextResponse.json({ ok: true });
}
