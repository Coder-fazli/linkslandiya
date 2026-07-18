import { User } from "./user"

// Human-readable name for a user: real name → email prefix → short id
export function displayName(
    user?: Pick<User, "name" | "firstName" | "lastName" | "email"> | null,
    fallbackId?: string
): string {
    if (user) {
        if (user.name?.trim()) return user.name.trim()
        const full = [user.firstName, user.lastName].filter(Boolean).join(" ").trim()
        if (full) return full
        if (user.email) return user.email.split("@")[0]
    }
    return fallbackId ? `#${fallbackId.slice(-6).toUpperCase()}` : "Unknown"
}
