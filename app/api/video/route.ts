import { authOptions } from "@/lib/auth";
import { connectToDatabase } from "@/lib/db";
import Video, { IVideo } from "@/models/Video";
import { connect } from "http2";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function GET(){
    try{
        await connectToDatabase();
        const videos = await Video.find().sort({ createdAt: -1 });
        if (!videos || videos.length === 0){
            return NextResponse.json({
                error: "No videos found"
            },{
                status: 404
            })
        }
        return NextResponse.json(videos);
    }catch(error){
        return NextResponse.json({
            error : "Failed to fetch videos"
        },{
            status: 500
        });
    }
}



export async function POST(request: NextRequest){
    try{
        const session = await getServerSession(authOptions);
        if(!session){
            return NextResponse.json({
                error: "Unauthorized"
            },{
                status: 401
            });
        }
        await connectToDatabase();
        console.log("Connected to database");
        const body: IVideo = await request.json();
        if (!body.title || !body.description || !body.videoUrl){
            return NextResponse.json({
                error:"Missing required fields"
            },{
                status: 400
            });
        }
        console.log("Creating video with data:", body);
        const videoData = {
            ...body,
            controls: body?.controls ?? true,
            transformation: {
                height: body?.transformation?.height ?? 1920,
                width: body?.transformation?.width ?? 1080,
                quality: body?.transformation?.quality ?? 100,
            }
        }

        const newVideo = await Video.create(videoData);
        console.log("New video created:", newVideo);
        return NextResponse.json(newVideo)
    }catch(error){
    console.error("Video creation error:", error);
    return NextResponse.json({
        error: "Failed to create video",
        details: error instanceof Error ? error.message : String(error)
    },{
        status: 500
    });
}

}