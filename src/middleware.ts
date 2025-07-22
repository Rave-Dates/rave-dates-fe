import { NextRequest, NextResponse } from "next/server";
import { jwtDecode } from "jwt-decode";

export function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname;
  const isAdminRoute = path.startsWith("/admin");

  const tokenName = isAdminRoute ? "token" : "tempToken";
  const token = req.cookies.get(tokenName)?.value;

  // permitir /admin/auth sin token
  if (isAdminRoute && path.startsWith("/admin/auth") && !token) {
    return NextResponse.next();
  }

  // permitir ruta pública sin token
  if (!isAdminRoute && !token) {
    return NextResponse.next();
  }

  if (isAdminRoute && !token) {
    // si no hay token, redirigir
    return NextResponse.redirect(new URL("/admin/auth", req.url));
  }

  if (path === "/admin")  {
    return NextResponse.redirect(new URL("/admin/auth", req.url));
  }

  if (!token) {
    // si no hay token, redirigir
    return NextResponse.redirect(new URL("/", req.url));
  }

  try {
    const decoded: IUserLogin = jwtDecode(token);

    const now = Math.floor(Date.now() / 1000); // tiempo actual en segundos

    if (decoded.exp < now) {
      // token expirado → borrar cookie y redirigir
      console.log("Tu sesión ha expirado. Por favor, inicia sesión nuevamente.");
      const res = NextResponse.redirect(new URL("/", req.url));
      res.cookies.delete(tokenName);
      return res;
    }
    
    if (isAdminRoute && decoded.role !== "ADMIN") {
      return NextResponse.redirect(new URL("/", req.url));
    }
    
    return NextResponse.next();
  } catch {
    // token inválido → borrar cookie y redirigir
    console.log("Token inválido. Por favor, inicia sesión nuevamente.");
    const res = NextResponse.redirect(new URL("/", req.url));
    res.cookies.delete(tokenName);
    return res;
  }
}
