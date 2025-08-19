import { auth } from "./auth"
import { NextResponse } from "next/server"

export default auth((req) => {
  const isAuth = !!req.auth
  const isAuthPage = req.nextUrl.pathname.startsWith("/auth")

  // Protect /protected routes
  if (req.nextUrl.pathname.startsWith("/protected") && !isAuth) {
    const newUrl = new URL("/auth/signin", req.nextUrl.origin)
    return NextResponse.redirect(newUrl)
  }

  // Protect /admin routes
  if (req.nextUrl.pathname.startsWith("/admin") && !isAuth) {
    const newUrl = new URL("/auth/signin", req.nextUrl.origin)
    return NextResponse.redirect(newUrl)
  }

  return NextResponse.next()
})

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
}