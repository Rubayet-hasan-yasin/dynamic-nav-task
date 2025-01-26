import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  const { id } = params;

  try {
    const body = await request.json();
    const { isActive } = body;

    if (typeof isActive !== "boolean") {
      return NextResponse.json({ message: "Invalid request data" }, { status: 400 });
    }

    const updatedMenu = await prisma.menu.update({
      where: { id: Number(id) },
      data: { isActive },
    });

    return NextResponse.json({ message: "Menu status updated successfully", updatedMenu }, { status: 200 });
  } catch (error) {
    console.error("Error updating menu status:", error);
    return NextResponse.json({ message: "Failed to update menu status" }, { status: 500 });
  }
}
