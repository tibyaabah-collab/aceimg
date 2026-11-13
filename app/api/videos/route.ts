import { getAllVideos, createVideo } from "@/lib/kv"
import { NextRequest, NextResponse } from "next/server"

export async function GET() {
  const videos = await getAllVideos()
  return NextResponse.json(videos)
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { slug, videoUrl, thumbnail, affiliateUrls, description } = body
    if (!slug || !videoUrl || !affiliateUrls || !affiliateUrls.length) {
      return NextResponse.json({ error: "Field wajib: slug, videoUrl, affiliateUrls (minimal 1)" }, { status: 400 })
    }
    const existing = await getAllVideos()
    if (existing.some(v => v.slug === slug)) {
      return NextResponse.json({ error: "Slug sudah dipakai" }, { status: 409 })
    }
    const video = await createVideo({ slug, videoUrl, thumbnail, affiliateUrls, description })
    return NextResponse.json(video, { status: 201 })
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 })
  }
}
