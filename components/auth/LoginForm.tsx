'use client'

import './LoginForm.css'
import { signIn } from "@/app/(auth)/actions"

export function LoginForm() {
  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-card-content">

          <form 
             className="login-form"
              action={async (formData) => {
                const result = await signIn({
                  email: formData.get('email') as string,
                  password: formData.get('password') as string,
                })
                if (result) {
                  alert(result) // Shows error
                }
              }}
             >

            <div className="login-header">
              <h1 className="login-title">Welcome back</h1>
              <p className="login-subtitle">Login to your Linkslandia account</p>
            </div>

            <div className="form-group">
              <label htmlFor="email" className="form-label">Email</label>
              <input
                id="email"
                name='email'
                type="email"
                className="form-input"
                placeholder="m@example.com"
                required
              />
            </div>

            <div className="form-group">
              <div className="password-header">
                <label htmlFor="password" className="form-label">Password</label>
                <a href="/forgot-password" className="forgot-link">Forgot your password?</a>
              </div>
              <input
                id="password"
                name='password'
                type="password"
                className="form-input"
                required
              />
            </div>

            <button type="submit" className="login-btn">Login</button>

            <div className="divider">Or continue with</div>

            <div className="social-buttons">
              <a href="/api/auth/google" className="social-btn google-btn">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48">
                  <path fill="#FFC107" d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8c-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4C12.955 4 4 12.955 4 24s8.955 20 20 20s20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z"/>
                  <path fill="#FF3D00" d="m6.306 14.691l6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4C16.318 4 9.656 8.337 6.306 14.691z"/>
                  <path fill="#4CAF50" d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238A11.9 11.9 0 0 1 24 36c-5.202 0-9.619-3.317-11.283-7.946l-6.522 5.025C9.505 39.556 16.227 44 24 44z"/>
                  <path fill="#1976D2" d="M43.611 20.083H42V20H24v8h11.303a12.04 12.04 0 0 1-4.087 5.571l.003-.002l6.19 5.238C36.971 39.205 44 34 44 24c0-1.341-.138-2.65-.389-3.917z"/>
                </svg>
                Continue with Google
              </a>
            </div>

            <p className="signup-text">
              Don&apos;t have an account? <a href="/register">Sign up</a>
            </p>
          </form>

          <div className="login-image-section">
            <img
              src="/235722222_11112829 (1).jpg"
              alt="Login illustration"
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
