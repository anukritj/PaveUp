import React, { useEffect, useMemo, useState } from 'react'
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom'
import ReportForm from './components/ReportForm.jsx'
import About from './pages/About.jsx'
import FAQ from './pages/FAQ.jsx'
import { LanguageProvider } from './context/LanguageContext.jsx'
import LanguageToggle from './components/LanguageToggle.jsx'
import { useTranslations } from './hooks/useTranslations.js'
import potholeImg from './images/pothole.jpeg'

function AppContent() {
  const t = useTranslations();
  const year = useMemo(() => new Date().getFullYear(), [])
  const location = useLocation()
  const isAboutPage = location.pathname === '/about'

  // Navbar collapse/shrink on scroll
  const [isScrolled, setIsScrolled] = useState(false)
  const [isHidden, setIsHidden] = useState(false)
  const [lastY, setLastY] = useState(0)
  const [mobileOpen, setMobileOpen] = useState(false)
  useEffect(() => {
    let ticking = false
    const onScroll = () => {
      const y = window.scrollY || 0
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setIsScrolled(y > 24)
          // Hide header when scrolling down beyond 120px, show on scroll up
          setIsHidden(y > lastY && y > 120)
          setLastY(y)
          ticking = false
        })
        ticking = true
      }
    }
    const closeOnResize = () => {
      if (window.innerWidth >= 768) setMobileOpen(false)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', closeOnResize, { passive: true })
    onScroll()
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', closeOnResize)
    }
  }, [lastY])

  return (
    <div className="min-h-full flex flex-col">
      <header
        className={`fixed top-0 left-0 right-0 z-20 border-b border-slate-200/50 transition-all duration-300 ease-out ${
          isScrolled ? 'bg-white/80 backdrop-blur-md shadow-md' : 'bg-white/90 backdrop-blur-md shadow-sm'
        } ${isHidden ? '-translate-y-full' : 'translate-y-0'}`}
        aria-label="Main navigation"
      >
        <div className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 transition-[padding] duration-300 ${isScrolled ? 'py-2' : 'py-3'}`}>
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
              <div className={`rounded-lg bg-gradient-to-br from-brand-500 to-brand-700 text-white grid place-items-center shadow-lg transition-all ${isScrolled ? 'h-8 w-8' : 'h-10 w-10'}`}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-label="PaveUp logo">
                  {/* Minimal map pin */}
                  <path d="M12 21s-6-6.5-6-11a6 6 0 1 1 12 0c0 4.5-6 11-6 11Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  {/* Upward chevron indicating improvement */}
                  <path d="M8.5 11l3.5-3.5L15.5 11" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <div className="leading-tight">
                <h1 className={`font-bold tracking-tight text-slate-900 transition-all ${isScrolled ? 'text-lg' : 'text-xl'}`}>PaveUp</h1>
                {!isScrolled && (
                  <p className="hidden sm:block text-xs text-slate-500 font-medium">{t.tagline}</p>
                )}
              </div>
            </Link>
            <div className="flex items-center gap-2 sm:gap-4">
              {/* Desktop nav */}
              <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600">
                <Link 
                  to="/" 
                  className={`hover:text-brand-600 transition-colors ${location.pathname === '/' ? 'text-brand-600' : ''}`}
                >
                  {t.navHome}
                </Link>
                <Link 
                  to="/about" 
                  className={`hover:text-brand-600 transition-colors ${location.pathname === '/about' ? 'text-brand-600' : ''}`}
                >
                  {t.navAbout}
                </Link>
                <Link 
                  to="/faq" 
                  className={`hover:text-brand-600 transition-colors ${location.pathname === '/faq' ? 'text-brand-600' : ''}`}
                >
                  {t.navFAQ}
                </Link>
              </nav>
              <LanguageToggle />
              {/* Mobile hamburger */}
              <button
                type="button"
                className="inline-flex md:hidden items-center justify-center w-9 h-9 rounded-lg border border-slate-200 bg-white/70 hover:bg-white shadow-sm"
                aria-label="Toggle navigation menu"
                aria-expanded={mobileOpen}
                onClick={() => setMobileOpen((v) => !v)}
              >
                <svg className={`w-5 h-5 transition-transform ${mobileOpen ? 'rotate-90' : ''}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" d="M4 7h16M4 12h16M4 17h16" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile menu drawer */}
      <div
        className={`md:hidden fixed top-[56px] left-0 right-0 z-10 px-4 transition-all duration-200 ${mobileOpen ? 'opacity-100 translate-y-0 pointer-events-auto' : 'opacity-0 -translate-y-2 pointer-events-none'}`}
      >
        <div className="mx-auto max-w-7xl">
          <nav className="glass rounded-xl p-4 bg-white/90 backdrop-blur shadow-lg border border-white/30">
            <ul className="flex flex-col gap-2 text-slate-700">
              <li>
                <Link onClick={() => setMobileOpen(false)} to="/" className="flex items-center justify-between rounded-lg px-3 py-2 hover:bg-slate-50">
                  <span>{t.navHome}</span>
                  {location.pathname === '/' && <span className="text-brand-600 text-xs font-semibold">•</span>}
                </Link>
              </li>
              <li>
                <Link onClick={() => setMobileOpen(false)} to="/about" className="flex items-center justify-between rounded-lg px-3 py-2 hover:bg-slate-50">
                  <span>{t.navAbout}</span>
                  {location.pathname === '/about' && <span className="text-brand-600 text-xs font-semibold">•</span>}
                </Link>
              </li>
              <li>
                <Link onClick={() => setMobileOpen(false)} to="/faq" className="flex items-center justify-between rounded-lg px-3 py-2 hover:bg-slate-50">
                  <span>{t.navFAQ}</span>
                  {location.pathname === '/faq' && <span className="text-brand-600 text-xs font-semibold">•</span>}
                </Link>
              </li>
              
            </ul>
          </nav>
        </div>
      </div>

      <main className="flex-1 pt-[64px] sm:pt-[64px]">
        <Routes>
          <Route path="/" element={
            <section className="min-h-screen relative overflow-hidden">
              {/* Background: Layer 1 - Civic image */}
              <div
                className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-40 md:opacity-45"
                style={{
                  backgroundImage: `url(${potholeImg})`,
                  filter: 'blur(4px) saturate(1.05) contrast(1.05) brightness(0.95)',
                  transform: 'scale(1.15)'
                }}
                aria-hidden="true"
              />

              {/* Background: Layer 2 - Brand tint */}
              <div className="absolute inset-0 pointer-events-none bg-gradient-to-br from-brand-100/60 via-white/35 to-brand-200/50" aria-hidden="true" />

              {/* Background: Layer 3 - Subtle pattern (inline SVG) */}
              <div
                className="absolute inset-0 opacity-20 mix-blend-overlay"
                style={{
                  backgroundImage:
                    "url('data:image/svg+xml;utf8,<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"160\" height=\"160\" viewBox=\"0 0 160 160\"><defs><linearGradient id=\"g\" x1=\"0\" y1=\"0\" x2=\"1\" y2=\"1\"><stop offset=\"0\" stop-color=\"%23e2e8f0\"/><stop offset=\"1\" stop-color=\"%23ffffff\"/></linearGradient></defs><path d=\"M0 80h160v1H0zM80 0v160h1V0z\" fill=\"url(%23g)\" opacity=\"0.35\"/></svg>')",
                  backgroundRepeat: 'repeat'
                }}
                aria-hidden="true"
              />

              {/* Background: Layer 4 - Civic accent color wash (meaningful) */}
              <div
                className="absolute inset-0 pointer-events-none"
                style={{
                  background:
                    'linear-gradient(120deg, rgba(30, 64, 175, 0.10) 0%, rgba(59, 130, 246, 0.08) 30%, rgba(250, 204, 21, 0.10) 100%)'
                }}
                aria-hidden="true"
              />

              {/* Background: Layer 5 - Spotlights to guide focus */}
              <div
                className="absolute inset-0 pointer-events-none"
                style={{
                  background:
                    'radial-gradient(600px 280px at 20% 85%, rgba(251, 191, 36, 0.16), rgba(251, 191, 36, 0) 60%), radial-gradient(500px 240px at 85% 10%, rgba(59, 130, 246, 0.15), rgba(59, 130, 246, 0) 55%)'
                }}
                aria-hidden="true"
              />

              {/* Background: Layer 6 - Vignette */}
              <div
                className="absolute inset-0 pointer-events-none"
                style={{
                  background: 'radial-gradient(ellipse at 50% 10%, rgba(0,0,0,0.18) 0%, rgba(0,0,0,0.10) 22%, rgba(0,0,0,0.06) 35%, rgba(0,0,0,0.00) 55%)'
                }}
                aria-hidden="true"
              />
              
              {/* Content */}
              <div className="relative z-10 max-w-xl mx-auto px-4 sm:px-6 py-12 md:py-16">
                
                <div className="glass-deep glass-hover rounded-2xl p-6 md:p-8">
                  <ReportForm />
                </div>
              </div>
            </section>
          } />
          <Route path="/about" element={<About />} />
          <Route path="/faq" element={<FAQ />} />
        </Routes>
      </main>

      <footer className="border-t border-slate-200 bg-white/60 backdrop-blur">
        <div className="max-w-6xl mx-auto px-6 py-6 text-sm text-slate-600 flex flex-col md:flex-row items-center justify-between gap-2">
          <p>{t.footerCopyright}</p>
          <p>{t.footerTagline}</p>
        </div>
      </footer>
    </div>
  )
}

export default function App() {
  return (
    <LanguageProvider>
      <Router>
        <AppContent />
      </Router>
    </LanguageProvider>
  )
}