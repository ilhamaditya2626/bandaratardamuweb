import { NextRequest, NextResponse } from "next/server";
import { getDocument } from "@/services/information.service";
export async function GET(_r:NextRequest,{params}:{params:Promise<{id:string}>}) { const d=await getDocument(Number((await params).id)); return d?NextResponse.json({success:true,data:d}):NextResponse.json({error:"Tidak ditemukan"},{status:404}); }
