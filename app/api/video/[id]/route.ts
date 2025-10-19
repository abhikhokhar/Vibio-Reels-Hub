import { NextResponse } from "next/server";
import Video from "@/models/Video";
import { connectToDatabase } from "@/lib/db";

export async function GET(
  req: Request,
  context: { params: Promise<{ id: string }> } 
) {
  try {
    const { id } = await context.params;
    await connectToDatabase();

    const video = await Video.findById(id);

    if (!video) {
      return NextResponse.json({ error: "Video not found" }, { status: 404 });
    }

    return NextResponse.json(video);
  } catch (error) {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
