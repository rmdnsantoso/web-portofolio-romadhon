import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    // Melakukan query ringan ke tabel Project
    await prisma.project.findFirst(); 
    
    return NextResponse.json({ 
      status: "success", 
      message: "Database kept alive!" 
    });
  } catch (error) {
    return NextResponse.json({ status: "error" }, { status: 500 });
  }
}