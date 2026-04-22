import { NextRequest, NextResponse } from "next/server";
import { jwtDecode } from "jwt-decode";

export function proxy(req: NextRequest) {
  const path = req.nextUrl.pathname;
  const isAdminRoute = path.startsWith("/admin");
  const isOrganizerRoute = path.startsWith("/organizer");
  const isPromoterRoute = path.startsWith("/promoter");
  const isCheckerRoute = path.startsWith("/checker");

  const token = req.cookies.get("token")?.value;
  const tempToken = req.cookies.get("tempToken")?.value;
  const clientToken = req.cookies.get("clientToken")?.value;

  // Rutas públicas sin token
  if (!isAdminRoute && !isOrganizerRoute && !isPromoterRoute && !isCheckerRoute) {
    return NextResponse.next();
  }

  // Revisar que el token no haya expirado
  const validToken = token || tempToken || clientToken;

  if (validToken) {
    try {
      const decoded: IUserLogin = jwtDecode(validToken);
      const now = Math.floor(Date.now() / 1000);

      if (decoded.exp < now) {
        const res = NextResponse.redirect(new URL("/", req.url));

        if (token) res.cookies.delete("token");
        if (tempToken) res.cookies.delete("tempToken");
        if (clientToken) res.cookies.delete("clientToken");

        return res;
      }
    } catch {
      const res = NextResponse.redirect(new URL("/", req.url));

      if (token) res.cookies.delete("token");
      if (tempToken) res.cookies.delete("tempToken");
      if (clientToken) res.cookies.delete("clientToken");

      return res;
    }
  }


  // ------------------------------------------
  // ADMIN AREA
  // ------------------------------------------
  if (isAdminRoute) {
    if (!token) {
      if (path === "/admin/auth") {
        return NextResponse.next();
      }
      return NextResponse.redirect(new URL("/admin/auth", req.url));
    }

    try {
      const decoded: IUserLogin = jwtDecode(token);

      // Si intenta entrar a /admin o /admin/auth y ya tiene un rol, redirigir a su área correspondiente
      if (path === "/admin" || path === "/admin/auth") {
        if (decoded.role === "ADMIN") return NextResponse.redirect(new URL("/admin/users", req.url));
        if (decoded.role === "ORGANIZER") return NextResponse.redirect(new URL("/organizer", req.url));
        if (decoded.role === "PROMOTER") return NextResponse.redirect(new URL("/promoter", req.url));
        // if (decoded.role === "CHECKER") return NextResponse.redirect(new URL("/checker", req.url));
      }

      if (decoded.role !== "ADMIN") {
        const res = NextResponse.redirect(new URL("/", req.url));
        return res;
      }

    } catch {
      const res = NextResponse.redirect(new URL("/", req.url));
      res.cookies.delete("token");
      return res;
    }
  }

  // ------------------------------------------
  // ORGANIZER AREA
  // ------------------------------------------
  if (isOrganizerRoute) {
    if (!token) {
      return NextResponse.redirect(new URL("/admin/auth", req.url));
    }

    try {
      const decoded: IUserLogin = jwtDecode(token);

      if (decoded.role !== "ORGANIZER") {
        const res = NextResponse.redirect(new URL("/", req.url));
        return res;
      }

    } catch {
      const res = NextResponse.redirect(new URL("/", req.url));
      res.cookies.delete("token");
      return res;
    }
  }

  // ------------------------------------------
  // PROMOTER AREA
  // ------------------------------------------
  if (isPromoterRoute) {
    if (!token) {
      return NextResponse.redirect(new URL("/admin/auth", req.url));
    }

    try {
      const decoded: IUserLogin = jwtDecode(token);

      if (decoded.role !== "PROMOTER") {
        const res = NextResponse.redirect(new URL("/", req.url));
        return res;
      }

    } catch {
      const res = NextResponse.redirect(new URL("/", req.url));
      res.cookies.delete("token");
      return res;
    }
  }

  return NextResponse.next();
}
