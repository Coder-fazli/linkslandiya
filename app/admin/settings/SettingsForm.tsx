"use client"
import { useState } from "react"
import "./settings.css"

type Props = {
  user: {
    _id?: string
    name: string
    email: string
    createdAt: Date
    activeMode: string
    isAdmin: boolean
    canBuy: boolean
    canPublish: boolean
    balance: number
    firstName: string
    lastName: string
    country: string
    phone: string
    companyWebsite: string
    identity: string
    paymentCountry: string
    paymentMethod: string
    paypalEmail: string
  }
}

export default function SettingsForm({ user }: Props) {
  const initial = user.name?.charAt(0).toUpperCase() || "U"
  const joinDate = new Date(user.createdAt).toLocaleDateString("en-US", {
    day: "numeric", month: "long", year: "numeric"
  })

  const [basic, setBasic] = useState({
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    country: user.country,
    phone: user.phone,
    companyWebsite: user.companyWebsite,
    identity: user.identity,
  })

  const [payment, setPayment] = useState({
    paymentCountry: user.paymentCountry,
    paymentMethod: user.paymentMethod,
    paypalEmail: user.paypalEmail,
  })

  return (
    <div className="section-content active">
      <h1 className="profile-page-title">My Profile</h1>

      <div className="profile-layout">

        {/* ── Left Column ── */}
        <div className="profile-left">

          <div className="profile-card profile-identity-card">
            <div className="profile-avatar-wrap">
              <div className="profile-avatar">{initial}</div>
              <div className="profile-online-dot" />
            </div>
            <div className="profile-name">{user.name}</div>
            <div className="profile-role">{user.activeMode === "publisher" ? "Publisher" : "Advertiser"}</div>

            <div className="profile-stats">
              <div className="profile-stat">
                <span className="profile-stat-value green">Active</span>
                <span className="profile-stat-label">Status</span>
              </div>
              <div className="profile-stat-divider" />
              <div className="profile-stat">
                <span className="profile-stat-value amber">${user.balance.toFixed(2)}</span>
                <span className="profile-stat-label">Balance</span>
              </div>
            </div>

            <div className="profile-joined">
              <span className="profile-joined-label">Joined on</span>
              <span className="profile-joined-date">{joinDate}</span>
            </div>
          </div>

          <div className="profile-card profile-password-card">
            <span className="profile-password-label">Password</span>
            <a href="#" className="profile-change-link">Change</a>
          </div>

        </div>

        {/* ── Right Column ── */}
        <div className="profile-right">

          {/* Basic Information */}
          <div className="profile-card">
            <div className="profile-section-header">
              <span className="profile-section-title">Basic Information</span>
              <button className="profile-edit-btn">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                </svg>
                Edit
              </button>
            </div>

            <div className="profile-fields-grid">
              <div className="profile-field">
                <label className="profile-field-label">First Name</label>
                <input className="profile-field-input" type="text" value={basic.firstName}
                  onChange={e => setBasic({...basic, firstName: e.target.value})} placeholder="First name" />
              </div>
              <div className="profile-field">
                <label className="profile-field-label">Last Name</label>
                <input className="profile-field-input" type="text" value={basic.lastName}
                  onChange={e => setBasic({...basic, lastName: e.target.value})} placeholder="Last name" />
              </div>
              <div className="profile-field">
                <label className="profile-field-label">Email Address</label>
                <input className="profile-field-input" type="email" value={basic.email}
                  onChange={e => setBasic({...basic, email: e.target.value})} placeholder="Email" />
              </div>
              <div className="profile-field">
                <label className="profile-field-label">Country</label>
                <select className="profile-field-input" value={basic.country}
                  onChange={e => setBasic({...basic, country: e.target.value})}>
                  <option value="">Select Country</option>
                  <option value="US">United States</option>
                  <option value="UK">United Kingdom</option>
                  <option value="DE">Germany</option>
                  <option value="FR">France</option>
                  <option value="ES">Spain</option>
                  <option value="AZ">Azerbaijan</option>
                  <option value="KZ">Kazakhstan</option>
                  <option value="TR">Turkey</option>
                  <option value="IN">India</option>
                  <option value="BR">Brazil</option>
                </select>
              </div>
              <div className="profile-field">
                <label className="profile-field-label">Phone Number</label>
                <input className="profile-field-input" type="tel" value={basic.phone}
                  onChange={e => setBasic({...basic, phone: e.target.value})} placeholder="+1 234 567 890" />
              </div>
              <div className="profile-field">
                <label className="profile-field-label">Company Website</label>
                <input className="profile-field-input" type="url" value={basic.companyWebsite}
                  onChange={e => setBasic({...basic, companyWebsite: e.target.value})} placeholder="https://yoursite.com" />
              </div>
              <div className="profile-field">
                <label className="profile-field-label">Identity</label>
                <select className="profile-field-input" value={basic.identity}
                  onChange={e => setBasic({...basic, identity: e.target.value})}>
                  <option value="">Select Identity</option>
                  <option value="Agency">Agency</option>
                  <option value="Individual">Individual</option>
                  <option value="Brand">Brand</option>
                  <option value="Freelancer">Freelancer</option>
                </select>
              </div>
            </div>

            <div className="profile-save-row">
              <button className="profile-save-btn">Save Changes</button>
            </div>
          </div>

          {/* Payment Information */}
          <div className="profile-card">
            <div className="profile-section-header">
              <span className="profile-section-title">Payment Information</span>
              <button className="profile-edit-btn">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                </svg>
                Edit
              </button>
            </div>

            <div className="profile-fields-grid">
              <div className="profile-field">
                <label className="profile-field-label">Payment Country</label>
                <select className="profile-field-input" value={payment.paymentCountry}
                  onChange={e => setPayment({...payment, paymentCountry: e.target.value})}>
                  <option value="">Select Country</option>
                  <option value="US">United States</option>
                  <option value="UK">United Kingdom</option>
                  <option value="DE">Germany</option>
                  <option value="FR">France</option>
                  <option value="ES">Spain</option>
                  <option value="AZ">Azerbaijan</option>
                  <option value="KZ">Kazakhstan</option>
                  <option value="TR">Turkey</option>
                  <option value="IN">India</option>
                  <option value="BR">Brazil</option>
                </select>
              </div>
              <div className="profile-field">
                <label className="profile-field-label">Preferred Method</label>
                <select className="profile-field-input" value={payment.paymentMethod}
                  onChange={e => setPayment({...payment, paymentMethod: e.target.value})}>
                  <option value="">Select Method</option>
                  <option value="paypal">PayPal</option>
                  <option value="bank">Bank Transfer</option>
                  <option value="crypto">Crypto</option>
                  <option value="stripe">Stripe</option>
                </select>
              </div>
              <div className="profile-field">
                <label className="profile-field-label">PayPal Email</label>
                <input className="profile-field-input" type="email" value={payment.paypalEmail}
                  onChange={e => setPayment({...payment, paypalEmail: e.target.value})} placeholder="paypal@email.com" />
              </div>
            </div>

            <div className="profile-save-row">
              <button className="profile-save-btn">Save Changes</button>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}
