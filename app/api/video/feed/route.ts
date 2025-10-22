import { authOptions } from "@/lib/auth";
import { connectToDatabase } from "@/lib/db";
import Video from "@/models/Video";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ error: "unauthorised" }, { status: 401 });
        }
        await connectToDatabase();
        const videos = await Video.find().sort({ createdAt: -1 });
        if (!videos || videos.length === 0) {
            return NextResponse.json({ videos: [] }, { status: 200 });
        }
        return NextResponse.json({ videos }, { status: 200 });
    } catch (error) {
        console.error("Error fetching videos:", error);
        return NextResponse.json({ error: "Failed to fetch videos" }, { status: 500 });
    }


}