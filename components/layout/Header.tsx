"use client"

import { useState } from 'react'
import Link from 'next/link'
import { InteractiveHoverButton } from '@/components/ui/interactive-hover-button'
import SparkleNavbar from '@/components/ui/SparkleNavbar'

const NAV_ITEMS = [
  { label: 'Websites', href: '/websites' },
  { label: 'Packages', href: '/packages' },
  { label: 'How It Works', href: '/how-it-works' },
  { label: 'Contact', href: '/contact' },
]

type HeaderProps = {
 cartCount?: number;
 isLoggedIn?: boolean;
}

export default function Header ({ cartCount = 0, isLoggedIn = false}: HeaderProps) {
 const[mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <>
       <header className="header">
           <div className="container">
            <div className="header-content">
               <Link href="/" className='logo'>
                <div className='logo-icon'>L</div>
                <span className='logo-text'>Linkslandia</span>   
               </Link>
                <SparkleNavbar items={NAV_ITEMS} className="nav" linkClassName="nav-link" />
                   
                   <div className="header-actions">
                     {isLoggedIn ? (
                       <InteractiveHoverButton href="/admin">Dashboard</InteractiveHoverButton>
                     ) : (
                       <>
               <Link href="/login" className="nav-link">Login</Link>
               <Link href="/register" className="btn btn-primary">Sign Up</Link>
                       </>
                     )}
                     <button
                       className="hamburger-btn"
                       onClick={() => setMobileMenuOpen(true)}
                       aria-label="Open menu"
                     >
                       <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round">
                         <line x1="3" y1="6" x2="21" y2="6"/>
                         <line x1="3" y1="12" x2="21" y2="12"/>
                         <line x1="3" y1="18" x2="21" y2="18"/>
                       </svg>
                     </button>
                   </div>
            </div>
        </div>
       
       </header> 

        <div className={`mobile-nav-overlay ${mobileMenuOpen ? 'show' : ''}`}
         onClick={(e) => {
            if (e.target === e.currentTarget) setMobileMenuOpen(false)
         }}
        >
            <div className="mobile-nav-content">
                {/* Close Button */}
                      <button
                        className="btn-icon mobile-nav-close"
                        onClick={() => setMobileMenuOpen(false)}
                          >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M18 6 6 18M6 6l12 12"></path>
                         </svg>
                     </button>
               
             <nav className="mobile-nav">
                     <Link href="/websites" className="nav-link" onClick={() => setMobileMenuOpen(false)}>
                              Websites
                    </Link>
                      <Link href="/packages" className="nav-link" onClick={() => setMobileMenuOpen(false)}>
                      Packages
                      </Link>
                      <Link href="/how-it-works" className="nav-link" onClick={() => setMobileMenuOpen(false)}>
                          How It Works
                      </Link>
                      <Link href="/contact" className="nav-link" onClick={() => setMobileMenuOpen(false)}>
                      Contact
                       </Link>
                </nav>
             </div>
          </div>
    
    </>
  )
}