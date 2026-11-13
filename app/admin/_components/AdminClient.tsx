"use client"
import { useEffect, useState, FormEvent } from "react"

export interface Video {
  id: string
  slug: string
  videoUrl: string
  thumbnail?: string
  affiliateUrls: string[]
  description?: string
  createdAt: number
  updatedAt: number
}

export default function AdminClient() {
  const [videos, setVideos] = useState<Video[]>([])
  const [editingId, setEditingId] = useState<string | null>(null)

  useEffect(() => { fetchVideos() }, [])

  async function fetchVideos() {
    const res = await fetch("/api/videos")
    if (res.ok) {
      const data = await res.json()
      setVideos(data)
      updateCount(data.length)
    }
  }

  function updateCount(n: number) {
    const el = document.getElementById("video-count")
    if (el) el.textContent = `${n} video`
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
      e.preventDefault()
      const form = e.currentTarget
      const data = Object.fromEntries(new FormData(form).entries())
      const id = data.id as string
      const affiliateUrls = (data.affiliateUrls as string)
        .split("\n")
        .map(u => u.trim())
        .filter(u => u.length > 0)
      const payload = {
        slug: data.slug,
        videoUrl: data.videoUrl,
        thumbnail: data.thumbnail || undefined,
        affiliateUrls,
        description: data.description || undefined,
      }
      const url = id ? `/api/videos/${id}` : "/api/videos"
      const method = id ? "PUT" : "POST"
      const res = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) })
      if (res.ok) {
        resetForm()
        fetchVideos()
      } else {
        const err = await res.json()
        alert(err.error || "Gagal menyimpan")
      }
    }

  function editVideo(v: Video) {
      setEditingId(v.id)
      ;(document.getElementById("video-id") as HTMLInputElement).value = v.id
      ;(document.getElementById("slug") as HTMLInputElement).value = v.slug
      ;(document.getElementById("videoUrl") as HTMLInputElement).value = v.videoUrl
      ;(document.getElementById("thumbnail") as HTMLInputElement).value = v.thumbnail || ""
      ;(document.getElementById("affiliateUrls") as HTMLTextAreaElement).value = v.affiliateUrls.join("\n")
      ;(document.getElementById("description") as HTMLTextAreaElement).value = v.description || ""
      window.scrollTo({ top: 0, behavior: "smooth" })
    }

  function resetForm() {
    setEditingId(null)
    ;(document.getElementById("video-form") as HTMLFormElement).reset()
  }

  async function handleDelete(id: string) {
    if (!confirm("Hapus video ini?")) return
    const res = await fetch(`/api/videos/${id}`, { method: "DELETE" })
    if (res.ok) fetchVideos()
  }

  return (
      <>
        <form className="card" id="video-form" onSubmit={handleSubmit}>
          <h2 style={{marginBottom: '1rem'}}>{editingId ? "Edit Video" : "Tambah Video"}</h2>
          <input type="hidden" name="id" id="video-id" />
          <input className="input" name="slug" id="slug" placeholder="Slug (unik, misal: hardi-deal)" required />
          <input className="input" name="videoUrl" id="videoUrl" placeholder="URL Video (MP4, bisa dari Vercel Blob / CDN)" required />
          <input className="input" name="thumbnail" id="thumbnail" placeholder="Thumbnail URL (opsional)" />
          <textarea className="input" name="affiliateUrls" id="affiliateUrls" placeholder="Link Affiliate Tujuan (satu per baris)" required rows={4}></textarea>
          <textarea className="input" name="description" id="description" placeholder="Deskripsi (opsional)" rows={3}></textarea>
          <div style={{display: 'flex', gap: '0.5rem'}}>
            <button type="submit" className="btn">{editingId ? "Update" : "Simpan"}</button>
            {editingId && <button type="button" className="btn" style={{background: '#64748b'}} onClick={resetForm}>Batal</button>}
          </div>
        </form>
        <div className="card">
          <h2 style={{marginBottom: '1rem', display: 'flex', justifyContent: 'space-between'}}>
            Daftar Video
            <span id="video-count" style={{fontSize: '0.875rem', color: '#94a3b8', fontWeight: 'normal'}}></span>
          </h2>
          <div id="video-list" className="grid">
            {videos.map(v => (
              <div key={v.id} className="card" style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem'}}>
                <div>
                  <strong>{v.slug}</strong>
                  <div style={{fontSize: '0.75rem', color: '#94a3b8'}}>
                    {v.affiliateUrls.map((u, i) => <div key={i}>{i + 1}. {u}</div>)}
                  </div>
                </div>
                <div style={{display: 'flex', gap: '0.5rem'}}>
                  <button className="btn" style={{padding: '0.4rem 0.8rem', fontSize: '0.875rem'}} onClick={() => editVideo(v)}>Edit</button>
                  <button className="btn" style={{padding: '0.4rem 0.8rem', fontSize: '0.875rem', background: '#dc2626'}} onClick={() => handleDelete(v.id)}>Hapus</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </>
    )
}
