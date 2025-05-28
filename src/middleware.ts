import { NextRequest, NextResponse } from "next/server";
import { getAuthenticatedAppForUser } from "./utils/firebase/server-app";

export async function middleware(req: NextRequest) {
    const { pathname } = req.nextUrl;
    console.log(pathname)
    // Allow public routes
    if (pathname.startsWith("/auth") || pathname === "/") {
        return NextResponse.next();
    }

    // Get the token from the __session cookie
    const token = req.cookies.get("__session")?.value;

    if (!token) {
        return NextResponse.redirect(new URL("/auth", req.url));
    }

    try {
        const { currentUser } = await getAuthenticatedAppForUser();
        if (!currentUser) {
            return NextResponse.redirect(new URL("/auth", req.url));
        }
        return NextResponse.next();
    } catch (error) {
        return NextResponse.redirect(new URL("/auth", req.url));
    }
}

export const config = {
    matcher: ['/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)'],
};
