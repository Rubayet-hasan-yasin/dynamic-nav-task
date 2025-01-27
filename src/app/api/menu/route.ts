import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();


export async function GET() {
  try {
    const menuData = await prisma.menu.findMany();

    // Function to transform flat data into a nested structure
    interface MenuItem {
      id: number;
      title: string;
      slug: string;
      parentId: number | null;
      isActive: boolean;
      children?: MenuItem[];
    }

    const buildMenuTree = (menuItems: MenuItem[], parentId: number | null = null): MenuItem[] => {
      return menuItems
        .filter((item) => item.parentId === parentId)
        .map((item) => ({
          id: item.id,
          title: item.title,
          slug: item.slug,
          parentId: item.parentId,
          isActive: item.isActive,
          children: buildMenuTree(menuItems, item.id),
        }));
    };

    const navItems = buildMenuTree(menuData);

    return NextResponse.json({navItems, menuData}, { status: 200 });
  } catch (error) {
    console.error("Error fetching menus:", error);
    return NextResponse.json({ message: "Failed to fetch menus" }, { status: 500 });
  }
}



export async function POST(request: Request) {
  try {
    const body = await request.json();

    if (!body || Object.keys(body).length === 0) {
      return NextResponse.json({ message: "Invalid request body" }, { status: 400 });
    }

    const { menuTitle, slug, parentId, order } = body;

    const newMenu = await prisma.menu.create({
      data: {
        title: menuTitle,
        slug,
        order,
        parentId: parentId ? Number(parentId) : null,
      },
    });

    return NextResponse.json(newMenu, { status: 201 });
  } catch (error) {
    return NextResponse.json({ message: "Failed to create menu", error }, { status: 500 });
  }
}



