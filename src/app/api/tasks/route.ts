import { NextResponse } from "next/server";
import { prisma } from "@/src/lib/prisma";

export async function GET() {
  const tasks = await prisma.task.findMany({
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json({ tasks });
}

export async function POST(req: Request) {
  const body = await req.json();

  const task = await prisma.task.create({
    data: {
      title: String(body.title ?? "").trim(),
      description: body.description != null ? String(body.description) : undefined,
      assignee: body.assignee != null ? String(body.assignee) : undefined,
      status: String(body.status ?? "TODO"),
      dueDate: body.dueDate ? String(body.dueDate) : undefined,
    },
  });

  return NextResponse.json({ task }, { status: 201 });
}
