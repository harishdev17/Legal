import { NextResponse } from "next/server";
import { decrypt } from "./app/_lib/session";

export async function middleware(req) {
   
    // In middleware, we need to use req.cookies instead of the cookies() function
    const sessionCookie = req.cookies.get('session')?.value;
    
    console.log("Cookie Value:", sessionCookie);
    
    let session = null;
    try {
        session = sessionCookie ? await decrypt(sessionCookie) : null;
        console.log("Session:", session);
    } catch (error) {
        console.log("Failed to decrypt session:", error);
    }
    
       if (req.nextUrl.pathname === "/login") {
        // If user is already logged in, redirect to home
        if (session) {
            console.log("Logged-in user trying to access login page, redirecting to home");
            return NextResponse.redirect(new URL("/home", req.url));
        }
        // Otherwise, allow access to login
        return NextResponse.next();
    }
     if (!session) {
        console.log("No valid session, redirecting to login");
        return NextResponse.redirect(new URL("/login", req.url));
    }
    if (session?.role === "Constable" && req.nextUrl.pathname === "/home") {
        console.log("Constable trying to access /home, redirecting to login");
        return NextResponse.redirect(new URL("/login", req.url));
    }
    
    return NextResponse.next();
}

export const config = {
    matcher: [
        '/((?!api|_next|static|.*\\..*$).*)'
    ],
}