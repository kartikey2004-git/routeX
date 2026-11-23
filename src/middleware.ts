import { NextResponse, type NextRequest } from "next/server";

const PROTECTED_PREFIXES = ["/app", "/realtime"];
const SESSION_COOKIES = [
  "better-auth.session_token",
  "__Secure-better-auth.session_token",
];

export function middleware(request: NextRequest) {
  const { pathname, search } = request.nextUrl;

  const isProtected = PROTECTED_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
  );
  if (!isProtected) return NextResponse.next();

  // Pass the requested path on, so the layout can keep it if the session turns out to be invalid.
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-pathname", `${pathname}${search}`);

  const hasSession = SESSION_COOKIES.some((name) => request.cookies.has(name));
  if (hasSession) return NextResponse.next({ request: { headers: requestHeaders } });

  const signIn = request.nextUrl.clone();
  signIn.pathname = "/sign-in";
  signIn.search = `?callbackUrl=${encodeURIComponent(`${pathname}${search}`)}`;
  return NextResponse.redirect(signIn);
}

export const config = {
  matcher: ["/app/:path*", "/realtime/:path*"],
};
