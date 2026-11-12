import { getAllVideos, updateVideo, deleteVideo } from "@/lib/kv"
import { NextRequest, NextResponse } from "next/server"

export async function GET(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const videos = await getAllVideos()
  const video = videos.find(v => v.id === id)
  if (!video) return NextResponse.json({ error: "Not found" }, { status: 404 })
  return NextResponse.json(video)
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  try {
    const body = await req.json()
    const video = await updateVideo(id, body)
    if (!video) return NextResponse.json({ error: "Not found" }, { status: 404 })
    return NextResponse.json(video)
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 })
  }
}

export async function DELETE(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const ok = await deleteVideo(id)
  if (!ok) return NextResponse.json({ error: "Not found" }, { status: 404 })
  return NextResponse.json({ success: true })
}
