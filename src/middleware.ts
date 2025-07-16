import { NextRequest, NextResponse } from "next/server";
import { jwtDecode } from "jwt-decode";

export function middleware(req: NextRequest) {
  const token = req.cookies.get("token")?.value;
  const path = req.nextUrl.pathname;

  // si se quiere loguear y no tiene token se deja pasar
  if (path.startsWith("/admin/auth") && !token) {
    return NextResponse.next();
  }
  
  // si no hay token → redirigir
  if (!token) {
    return NextResponse.redirect(new URL("/admin/auth", req.url));
  }
  
  // si es admin y esta en la ruta /admin se deja pasar
  try {
    const decoded: IUserLogin = jwtDecode(token);
    const role = decoded.role;
    
    if (req.nextUrl.pathname.startsWith("/admin") && role !== "ADMIN") {
      return NextResponse.redirect(new URL("/", req.url));
    }
  } catch (error) {
    console.log(error)
    return NextResponse.redirect(new URL("/", req.url));
  }

  return NextResponse.next();
}

// rutas donde funciona
export const config = {
  matcher: ["/admin/:path*"],
};