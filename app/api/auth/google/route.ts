import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import crypto from "crypto"

// Step 1 of Google sign-in: redirect the user to Google's consent screen
export async function GET(req: Request) {
    const clientId = process.env.GOOGLE_CLIENT_ID
    if (!clientId) {
        return NextResponse.redirect(new URL("/login?error=google_not_configured", req.url))
    }

    const appUrl = process.env.APP_URL ?? new URL(req.url).origin

    // Random state — verified in the callback to block CSRF
    const state = crypto.randomBytes(16).toString("hex")
    const cookieStore = await cookies()
    cookieStore.set("google_oauth_state", state, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 600, // 10 minutes
        path: "/",
    })

    const params = new URLSearchParams({
        client_id: clientId,
        redirect_uri: `${appUrl}/api/auth/google/callback`,
        response_type: "code",
        scope: "openid email profile",
        state,
        prompt: "select_account",
    })

    return NextResponse.redirect(`https://accounts.google.com/o/oauth2/v2/auth?${params}`)
}
