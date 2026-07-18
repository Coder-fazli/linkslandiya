'use client'

import { useState, useTransition } from "react"
import '../auth/LoginForm.css'
import { requestPasswordResetAction } from "@/app/lib/password-reset-actions"

export function ForgotPasswordForm() {
  const [pending, startTransition] = useTransition()
  const [message, setMessage] = useState("")
  const [error, setError] = useState("")

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError("")
    setMessage("")
    const fd = new FormData(e.currentTarget)
    startTransition(async () => {
      const result = await requestPasswordResetAction(fd)
      if ("error" in result) { setError(result.error); return }
      setMessage(result.message)
    })
  }

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-card-content">
          <form className="login-form" onSubmit={handleSubmit}>
            <div className="login-header">
              <h1 className="login-title">Forgot your password?</h1>
              <p className="login-subtitle">Enter your email and we&apos;ll send you a reset link</p>
            </div>

            {message ? (
              <p style={{ textAlign: "center", color: "#16a34a", fontSize: "14px", fontWeight: 500 }}>{message}</p>
            ) : (
              <>
                <div className="form-group">
                  <label htmlFor="email" className="form-label">Email</label>
                  <input id="email" name="email" type="email" className="form-input" placeholder="m@example.com" required />
                </div>
                {error && <p style={{ color: "#ef4444", fontSize: "13px", fontWeight: 500 }}>{error}</p>}
                <button type="submit" className="login-btn" disabled={pending}>
                  {pending ? "Sending…" : "Send Reset Link"}
                </button>
              </>
            )}

            <p className="signup-text">
              Remembered your password? <a href="/login">Back to login</a>
            </p>
          </form>
        </div>
      </div>
    </div>
  )
}
