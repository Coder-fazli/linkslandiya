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
                <a href="#" className="forgot-link">Forgot your password?</a>
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
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                  <path
                    d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
                    fill="currentColor"
                  />
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
