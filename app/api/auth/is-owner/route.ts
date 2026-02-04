import { NextResponse } from "next/server";
import { verifyOwner } from "@/lib/supabase/auth";

export async function GET() {
  const { isOwner } = await verifyOwner();
  return NextResponse.json({ isOwner });
}
