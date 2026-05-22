import { NextRequest, NextResponse } from "next/server";
import { getSessionCookie } from "better-auth/cookies";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith("/admin")) {
    const publicPaths = ["/admin/login", "/admin/signup"];
    if (publicPaths.some((p) => pathname === p || pathname.startsWith(p + "/"))) {
      return NextResponse.next();
    }
    const session = getSessionCookie(request);
    if (!session) {
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }
  }

  if (pathname.startsWith("/portal")) {
    const clientToken = request.cookies.get("progress_client_session");
    if (!clientToken) {
      return NextResponse.redirect(new URL("/login/client", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/portal/:path*"],
};
