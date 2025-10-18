import { authOptions } from "@/lib/auth";
import { connectToDatabase } from "@/lib/db";
import Video, { IVideo } from "@/models/Video";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

// ==================== GET ====================
export async function GET(request: NextRequest) {
  try {
    await connectToDatabase();

    const session = await getServerSession(authOptions);
    const userEmail = session?.user?.email;

    // Support query param filtering as a fallback
    const { searchParams } = new URL(request.url);
    const queryEmail = searchParams.get("userEmail");

    const filter = userEmail || queryEmail ? { userEmail: userEmail ?? queryEmail } : {};

    const videos = await Video.find(filter).sort({ createdAt: -1 });

    if (!videos || videos.length === 0) {
  return NextResponse.json([], { status: 200 });
}

    return NextResponse.json(videos);
  } catch (error) {
    console.error("Error fetching videos:", error);
    return NextResponse.json(
      { error: "Failed to fetch videos" },
      { status: 500 }
    );
  }
}

// ==================== POST ====================
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectToDatabase();
    console.log("Connected to database");

    const body: IVideo = await request.json();

    if (!body.title || !body.description || !body.videoUrl) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const videoData = {
      ...body,
      userEmail: session.user.email, // ✅ store which user uploaded it
      controls: body?.controls ?? true,
      transformation: {
        height: body?.transformation?.height ?? 1920,
        width: body?.transformation?.width ?? 1080,
        quality: body?.transformation?.quality ?? 100,
      },
    };

    const newVideo = await Video.create(videoData);
    console.log("New video created:", newVideo);

    return NextResponse.json(newVideo);
  } catch (error) {
    console.error("Video creation error:", error);
    return NextResponse.json(
      {
        error: "Failed to create video",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
