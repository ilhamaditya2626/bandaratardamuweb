import { NextRequest, NextResponse } from "next/server";
import { listDocuments } from "@/services/information.service";
export async function GET(request: NextRequest) { const q=new URL(request.url).searchParams; return NextResponse.json({ success:true, data:await listDocuments(q.get("category") || undefined, q.get("latest") === "true") }); }
