import { getVideo } from "@/lib/kv"
import { notFound } from "next/navigation"
import Link from "next/link"

interface Props {
  params: Promise<{ slug: string }>
}

export default async function VideoPage({ params }: Props) {
  const { slug } = await params
  const video = await getVideo(slug)

  if (!video) notFound()

  return (
    <main className="container">
      <div className="video-wrapper">
        <video controls playsInline poster={video.thumbnail || undefined}>
          <source src={video.videoUrl} type="video/mp4" />
          Browser tidak mendukung video.
        </video>
      </div>
      <div style={{marginTop: '1.5rem', display: 'flex', gap: '1rem', flexWrap: 'wrap'}}>
        <Link href={video.affiliateUrl} target="_blank" rel="noopener noreferrer" className="btn">
          Beli / Lihat Produk
        </Link>
        <a href="/" className="btn" style={{background: '#334155'}}>
          Kembali
        </a>
      </div>
      {video.description && (
        <p style={{marginTop: '1rem', color: '#94a3b8', lineHeight: 1.6}}>
          {video.description}
        </p>
      )}
    </main>
  )
}
