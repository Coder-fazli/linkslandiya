'use client'

import './LoginForm.css'
import { useState } from 'react'
import { signUp } from '@/app/(auth)/actions'

const RULES = [
  { label: "At least 8 characters",   test: (p: string) => p.length >= 8 },
  { label: "One uppercase letter",     test: (p: string) => /[A-Z]/.test(p) },
  { label: "One lowercase letter",     test: (p: string) => /[a-z]/.test(p) },
  { label: "One number",               test: (p: string) => /[0-9]/.test(p) },
  { label: "One special character",    test: (p: string) => /[^A-Za-z0-9]/.test(p) },
]

export function RegisterForm() {
  const [password, setPassword]               = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showRules, setShowRules]             = useState(false)
  const [error, setError]                     = useState("")

  const passwordsMatch    = confirmPassword.length > 0 && password === confirmPassword
  const passwordMismatch  = confirmPassword.length > 0 && password !== confirmPassword

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-card-content">
          <form
            className="login-form"
            action={async (formData) => {
              const result = await signUp({
                email:           formData.get('email')           as string,
                password:        formData.get('password')        as string,
                confirmPassword: formData.get('confirmPassword') as string,
                name:            formData.get('name')            as string,
              })
              if (result) setError(result)
            }}
          >
            <div className="login-header">
              <h1 className="login-title">Create an account</h1>
              <p className="login-subtitle">Enter your details to get started</p>
            </div>

            {error && (
              <p style={{ color: "#ef4444", fontSize: "13px", marginBottom: "8px" }}>{error}</p>
            )}

            <div className="form-group">
              <label htmlFor="name" className="form-label">Full Name</label>
              <input
                id="name"
                name="name"
                type="text"
                className="form-input"
                placeholder="John Doe"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="email" className="form-label">Email</label>
              <input
                id="email"
                name="email"
                type="email"
                className="form-input"
                placeholder="m@example.com"
                required
              />
            </div>

            {/* Password with live rules */}
            <div className="form-group">
              <label htmlFor="password" className="form-label">Password</label>
              <input
                id="password"
                name="password"
                type="password"
                className="form-input"
                value={password}
                onChange={e => { setPassword(e.target.value); setShowRules(true) }}
                required
              />
              {showRules && (
                <ul style={{ listStyle: "none", padding: "8px 0 0", margin: 0, display: "flex", flexDirection: "column", gap: "4px" }}>
                  {RULES.map(rule => {
                    const passed = rule.test(password)
                    return (
                      <li key={rule.label} style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "12px", color: passed ? "#16a34a" : "#94a3b8" }}>
                        <svg viewBox="0 0 16 16" fill="none" width="13" height="13">
                          {passed
                            ? <path d="M3 8l3.5 3.5L13 4.5" stroke="#16a34a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            : <circle cx="8" cy="8" r="5" stroke="#cbd5e1" strokeWidth="1.5"/>
                          }
                        </svg>
                        {rule.label}
                      </li>
                    )
                  })}
                </ul>
              )}
            </div>

            {/* Confirm password with match indicator */}
            <div className="form-group">
              <label htmlFor="confirmPassword" className="form-label">Confirm Password</label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                className="form-input"
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
                style={{
                  borderColor: passwordMismatch ? "#ef4444" : passwordsMatch ? "#16a34a" : undefined,
                }}
                required
              />
              {passwordMismatch && (
                <p style={{ margin: "4px 0 0", fontSize: "12px", color: "#ef4444" }}>Passwords do not match</p>
              )}
              {passwordsMatch && (
                <p style={{ margin: "4px 0 0", fontSize: "12px", color: "#16a34a" }}>✓ Passwords match</p>
              )}
            </div>

            <button type="submit" className="login-btn">Sign Up</button>

            <div className="divider">Or continue with</div>

            <div className="social-buttons">
              <a href="/api/auth/google" className="social-btn google-btn">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                  <path d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z" fill="currentColor"/>
                </svg>
                Continue with Google
              </a>
            </div>

            <p className="signup-text">
              Already have an account? <a href="/login">Login</a>
            </p>
          </form>

          <div className="login-image-section">
            <img
              src="/235722222_11112829 (1).jpg"
              alt="Register illustration"
              className="login-image"
            />
          </div>
        </div>
      </div>

      <p className="terms-text">
        By clicking continue, you agree to our <a href="#">Terms of Service</a>{" "}
        and <a href="#">Privacy Policy</a>.
      </p>
    </div>
  )
}
