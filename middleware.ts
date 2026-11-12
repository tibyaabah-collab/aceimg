import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD

export function middleware(request: NextRequest) {
  if (!request.nextUrl.pathname.startsWith("/admin")) {
    return NextResponse.next()
  }
  if (!ADMIN_PASSWORD) {
    console.warn("ADMIN_PASSWORD not set")
    return NextResponse.next()
  }

  const auth = request.headers.get("authorization")
  if (!auth) {
    return new NextResponse("Authentication required", {
      status: 401,
      headers: { "WWW-Authenticate": 'Basic realm="Admin Area"' },
    })
  }

  const [scheme, encoded] = auth.split(" ")
  if (scheme !== "Basic") {
    return new NextResponse("Invalid auth scheme", { status: 401 })
  }

  const decoded = Buffer.from(encoded, "base64").toString()
  const [, password] = decoded.split(":")

  if (password !== ADMIN_PASSWORD) {
    return new NextResponse("Invalid password", { status: 401 })
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/admin/:path*"],
}
