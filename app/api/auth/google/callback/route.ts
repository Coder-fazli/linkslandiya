import { NextResponse } from "next/server"
import { cookies, headers } from "next/headers"
import { getUserByEmail, createUser, linkGoogleAccount } from "@/app/lib/user"
import { createSession } from "@/app/lib/session"

// Step 2 of Google sign-in: Google redirects back here with a one-time code.
// Exchange it for the user's profile, then find-or-create the account and log in.
export async function GET(req: Request) {
    const url = new URL(req.url)
    const code = url.searchParams.get("code")
    const state = url.searchParams.get("state")
    const appUrl = process.env.APP_URL ?? url.origin
    const fail = (reason: string) => NextResponse.redirect(`${appUrl}/login?error=${reason}`)

    const clientId = process.env.GOOGLE_CLIENT_ID
    const clientSecret = process.env.GOOGLE_CLIENT_SECRET
    if (!clientId || !clientSecret) return fail("google_not_configured")

    // Verify the anti-CSRF state set when the flow started
    const cookieStore = await cookies()
    const savedState = cookieStore.get("google_oauth_state")?.value
    cookieStore.delete("google_oauth_state")
    if (!code || !state || !savedState || state !== savedState) return fail("google_auth_failed")

    // Exchange the code for tokens
    const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
            code,
            client_id: clientId,
            client_secret: clientSecret,
            redirect_uri: `${appUrl}/api/auth/google/callback`,
            grant_type: "authorization_code",
        }),
    })
    if (!tokenRes.ok) return fail("google_auth_failed")
    const { access_token: accessToken } = await tokenRes.json()
    if (!accessToken) return fail("google_auth_failed")

    // Fetch the verified profile
    const profileRes = await fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
        headers: { Authorization: `Bearer ${accessToken}` },
    })
    if (!profileRes.ok) return fail("google_auth_failed")
    const profile: { sub: string; email?: string; email_verified?: boolean; name?: string } = await profileRes.json()
    if (!profile.email || !profile.email_verified) return fail("google_email_unverified")

    const email = profile.email.toLowerCase()

    // Existing account (any kind) → log in, linking Google on first use
    const existing = await getUserByEmail(email)
    if (existing) {
        if (!existing.googleId) {
            await linkGoogleAccount(existing._id!.toString(), profile.sub)
        }
        await createSession(existing._id!.toString())
        return NextResponse.redirect(`${appUrl}/admin`)
    }

    // New account — same defaults as the regular sign-up flow, but passwordless
    const headersList = await headers()
    const ip = headersList.get("x-real-ip")
        ?? headersList.get("x-forwarded-for")?.split(",")[0]?.trim()
        ?? "unknown"

    const result = await createUser({
        name: profile.name?.trim() || email.split("@")[0],
        email,
        googleId: profile.sub,
        canBuy: false,
        canPublish: false,
        activeMode: "buyer",
        isAdmin: false,
        hasSelectedRole: false,
        balance: 10,
        registrationIp: ip,
    })

    await createSession(result.insertedId.toString())
    return NextResponse.redirect(`${appUrl}/admin`)
}
