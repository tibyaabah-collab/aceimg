import { kv } from "@vercel/kv"

export interface Video {
  id: string
  slug: string
  videoUrl: string
  thumbnail?: string
  affiliateUrl: string
  description?: string
  createdAt: number
  updatedAt: number
}

const VIDEOS_KEY = "videos:list"
const VIDEO_PREFIX = "video:"

export async function getAllVideos(): Promise<Video[]> {
  const ids = await kv.lrange<string>(VIDEOS_KEY, 0, -1)
  if (!ids.length) return []
  const videos = await kv.mget<Video>(...ids.map(id => `${VIDEO_PREFIX}${id}`))
  return videos.filter((v): v is Video => v !== null).sort((a, b) => b.createdAt - a.createdAt)
}

export async function getVideo(slug: string): Promise<Video | null> {
  const ids = await kv.lrange<string>(VIDEOS_KEY, 0, -1)
  for (const id of ids) {
    const video = await kv.get<Video>(`${VIDEO_PREFIX}${id}`)
    if (video && video.slug === slug) return video
  }
  return null
}

export async function createVideo(data: Omit<Video, "id" | "createdAt" | "updatedAt">): Promise<Video> {
  const id = crypto.randomUUID()
  const now = Date.now()
  const video: Video = { ...data, id, createdAt: now, updatedAt: now }
  await kv.set(`${VIDEO_PREFIX}${id}`, video)
  await kv.lpush(VIDEOS_KEY, id)
  return video
}

export async function updateVideo(id: string, data: Partial<Video>): Promise<Video | null> {
  const existing = await kv.get<Video>(`${VIDEO_PREFIX}${id}`)
  if (!existing) return null
  const updated: Video = { ...existing, ...data, updatedAt: Date.now() }
  await kv.set(`${VIDEO_PREFIX}${id}`, updated)
  return updated
}

export async function deleteVideo(id: string): Promise<boolean> {
  const existing = await kv.get<Video>(`${VIDEO_PREFIX}${id}`)
  if (!existing) return false
  await kv.del(`${VIDEO_PREFIX}${id}`)
  await kv.lrem(VIDEOS_KEY, 0, id)
  return true
}
