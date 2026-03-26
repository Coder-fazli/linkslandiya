"use client"

import { useState } from 'react'
import Link from 'next/link'
import { InteractiveHoverButton } from '@/components/ui/interactive-hover-button'

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
                <nav className="nav">
                    <Link href="/websites" className="nav-link">Websites</Link>
                    <Link href="/packages" className="nav-link">Packages</Link>
                    <Link href="/how-it-works" className="nav-link">How It Works</Link>
                    <Link href="/contact" className="nav-link">Contact</Link>
                </nav>
                   
                   <div className="header-actions">
                     {isLoggedIn ? (
                       <InteractiveHoverButton href="/admin">Dashboard</InteractiveHoverButton>
                     ) : (
                       <>                                             
               <Link href="/login"                          className="nav-link">Login</Link>                    
                    <Link href="/register" 
                    className="btn btn-primary">Sign Up</Link>  </>              
                     )} </div>
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