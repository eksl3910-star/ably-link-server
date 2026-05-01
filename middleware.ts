import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { SESSION_COOKIE } from "@/lib/constants";
import { getMaintenanceOnSafe } from "@/lib/database";

// ── Path classifiers ──────────────────────────────────────────────────────────

/** 점검 중에도 접근 허용 (관리·설정 조회). */
function isMaintenanceExempt(pathname: string): boolean {
  if (pathname === "/maintenance" || pathname.startsWith("/maintenance/")) return true;
  if (pathname === "/admin" || pathname.startsWith("/admin/")) return true;
  if (pathname.startsWith("/api/admin")) return true;
  if (pathname === "/api/settings" || pathname.startsWith("/api/settings/")) return true;
  return false;
}

function isProtectedUserRoute(pathname: string): boolean {
  return (
    pathname === "/" ||
    pathname.startsWith("/api/links/") ||
    pathname.startsWith("/api/auth/logout") ||
    pathname.startsWith("/api/auth/delete") ||
    pathname.startsWith("/api/auth/me")
  );
}

// ── Middleware ────────────────────────────────────────────────────────────────

export async function middleware(req: NextRequest): Promise<NextResponse> {
  const { pathname } = req.nextUrl;
  const maintenanceOn = await getMaintenanceOnSafe();

  const hasSession = Boolean(req.cookies.get(SESSION_COOKIE)?.value);

  if (
    (pathname === "/welcome" || pathname.startsWith("/welcome/")) &&
    hasSession
  ) {
    const homeUrl = req.nextUrl.clone();
    homeUrl.pathname = "/";
    homeUrl.search = "";
    return NextResponse.redirect(homeUrl);
  }

  if (maintenanceOn) {
    if (!isMaintenanceExempt(pathname)) {
      if (pathname.startsWith("/api/")) {
        return NextResponse.json(
          { error: "현재 점검 중입니다. 잠시 후 다시 시도해주세요." },
          { status: 503 }
        );
      }
      const maintenanceUrl = req.nextUrl.clone();
      maintenanceUrl.pathname = "/maintenance";
      maintenanceUrl.search = "";
      return NextResponse.redirect(maintenanceUrl);
    }
  } else {
    if (pathname === "/maintenance" || pathname.startsWith("/maintenance/")) {
      const homeUrl = req.nextUrl.clone();
      homeUrl.pathname = "/";
      homeUrl.search = "";
      return NextResponse.redirect(homeUrl);
    }
  }

  if (isProtectedUserRoute(pathname)) {
    if (!hasSession) {
      if (pathname.startsWith("/api/")) {
        return NextResponse.json({ error: "인증이 필요합니다." }, { status: 401 });
      }
      const welcomeUrl = req.nextUrl.clone();
      welcomeUrl.pathname = "/welcome";
      welcomeUrl.search = "";
      return NextResponse.redirect(welcomeUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/|favicon\\.ico).*)"],
};
