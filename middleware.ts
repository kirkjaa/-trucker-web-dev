import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

import { ERoles, Routers } from "./app/types/enum";
import { EOrganizationType } from "./app/types/organization/organizationEnum";

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // Skip middleware during build if NEXTAUTH_SECRET is not set
  if (!process.env.NEXTAUTH_SECRET) {
    // During build, just allow all requests
    if (process.env.NODE_ENV === "production" && !process.env.NEXTAUTH_SECRET) {
      return NextResponse.next();
    }
  }

  // Retrieve the token
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET || "temp-secret-for-build",
  });

  // Allow health-check requests
  if (pathname === "/health-check") {
    return NextResponse.next();
  }

  if (!token?.accessToken) {
    if (!pathname.startsWith("/auth")) {
      return NextResponse.redirect(new URL("/auth/login", request.url));
    }
    return NextResponse.next();
  }

  const role: string = token?.role?.toString().toUpperCase() || "";
  const type: string = token?.type?.toString().toUpperCase() || "";

  if (role === ERoles.ORGANIZATION && type === EOrganizationType.FACTORY) {
    if (
      !pathname.startsWith("/factory") &&
      !pathname.startsWith(Routers.NOTIFICATION)
    ) {
      return NextResponse.redirect(
        new URL("/factory/list-of-rfq", request.url)
      );
    }
  } else if (
    role === ERoles.ORGANIZATION &&
    type === EOrganizationType.COMPANY
  ) {
    if (
      !pathname.startsWith("/company") &&
      !pathname.startsWith(Routers.NOTIFICATION)
    ) {
      return NextResponse.redirect(
        new URL("/company/quotation-factory", request.url)
      );
    }
  } else if (role === ERoles.ADMIN) {
    if (
      !pathname.startsWith("/admin") &&
      !pathname.startsWith(Routers.NOTIFICATION)
    ) {
      return NextResponse.redirect(new URL("/admin/factories", request.url));
    }
  } else {
    return NextResponse.redirect(new URL("/auth/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|public|images|firebase-messaging-sw.js).*)",
  ],
};
