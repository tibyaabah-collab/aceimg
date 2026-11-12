import type { Metadata } from "next"
import "./globals.css"

export const metadata: Metadata = {
  title: "Video Affiliate Player",
  description: "Player video dengan link affiliate",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="id">
      <body>{children}</body>
    </html>
  )
}
