# Video Affiliate - Self-hosted di Vercel

Project Next.js 14 untuk mengelola video affiliate dengan slug custom.

## Fitur
- `/v/[slug]` → Halaman player video + tombol affiliate
- `/admin` → Kelola video (CRUD) + password protection (via ENV)
- Data tersimpan di **Vercel KV** (gratis, serverless)
- Deploy 1-klik ke Vercel

## Deploy Cepat

1. **Push ke GitHub**
   ```bash
   git init
   git add .
   git commit -m "init"
   gh repo create video-affiliate --private --source=. --push
   ```

2. **Buat Vercel KV Storage**
   - Buka [vercel.com/storage](https://vercel.com/storage) → Create Database → **KV**
   - Copy `KV_REST_API_URL` dan `KV_REST_API_TOKEN`

3. **Deploy ke Vercel**
   - Import repo di [vercel.com/new](https://vercel.com/new)
   - Tambah Environment Variables:
     - `KV_REST_API_URL` → dari langkah 2
     - `KV_REST_API_TOKEN` → dari langkah 2
     - `ADMIN_PASSWORD` → password kuat untuk halaman `/admin`
   - Deploy

4. **Akses**
   - Admin: `https://domain-kamu.vercel.app/admin` (masukkan `ADMIN_PASSWORD` via prompt browser)
   - Player: `https://domain-kamu.vercel.app/v/slug-kamu`

## Struktur URL Affiliate untuk xskill
```
https://domain-kamu.vercel.app/v/hardi-deal
```
Gunakan link ini di skill `xskill` untuk posting ke X.

## Catatan
- Video di-host terpisah (Vercel Blob, Cloudflare R2, Bunny CDN, dll) → masukkan URL MP4 ke field `videoUrl`
- Thumbnail opsional (URL gambar)
- `ADMIN_PASSWORD` dipakai via HTTP Basic Auth middleware (lihat `middleware.ts` jika ditambah)
