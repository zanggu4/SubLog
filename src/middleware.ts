export { auth as middleware } from "@/lib/auth";

export const config = {
  matcher: ["/dashboard/:path*", "/api/subscriptions/:path*", "/api/commits/:path*"],
};
