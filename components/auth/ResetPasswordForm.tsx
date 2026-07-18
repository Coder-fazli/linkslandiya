'use client'

import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import '../auth/LoginForm.css'
import { resetPasswordAction } from "@/app/lib/password-reset-actions"

export function ResetPasswordForm({ token }: { token: string }) {
  const router = useRouter()
  const [pending, startTransition] = useTransition()
  const [error, setError] = useState("")
  const [done, setDone] = useState(false)

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError("")
    const fd = new FormData(e.currentTarget)
    fd.set("token", token)
    startTransition(async () => {
      const result = await resetPasswordAction(fd)
      if (result.error) { setError(result.error); return }
      setDone(true)
      setTimeout(() => router.push("/login"), 2000)
    })
  }

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-card-content">
          <form className="login-form" onSubmit={handleSubmit}>
            <div className="login-header">
              <h1 className="login-title">Set a new password</h1>
              <p className="login-subtitle">Choose a strong password for your account</p>
            </div>

            {done ? (
              <p style={{ textAlign: "center", color: "#16a34a", fontSize: "14px", fontWeight: 500 }}>
                Password updated! Redirecting to login…
              </p>
            ) : (
              <>
                <div className="form-group">
                  <label htmlFor="password" className="form-label">New Password</label>
                  <input id="password" name="password" type="password" className="form-input" required />
                </div>
                <div className="form-group">
                  <label htmlFor="confirmPassword" className="form-label">Confirm Password</label>
                  <input id="confirmPassword" name="confirmPassword" type="password" className="form-input" required />
                </div>
                {error && <p style={{ color: "#ef4444", fontSize: "13px", fontWeight: 500 }}>{error}</p>}
                <button type="submit" className="login-btn" disabled={pending}>
                  {pending ? "Saving…" : "Reset Password"}
                </button>
              </>
            )}
          </form>
        </div>
      </div>
    </div>
  )
}
