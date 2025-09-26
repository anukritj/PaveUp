import React, { useMemo } from 'react'
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

  return (
    <div className="min-h-full flex flex-col">
      <header className="sticky top-0 z-10 bg-white/90 backdrop-blur-md border-b border-slate-200/50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
              <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-brand-500 to-brand-700 text-white grid place-items-center shadow-lg">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-label="PaveUp logo">
                  {/* Minimal map pin */}
                  <path d="M12 21s-6-6.5-6-11a6 6 0 1 1 12 0c0 4.5-6 11-6 11Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  {/* Upward chevron indicating improvement */}
                  <path d="M8.5 11l3.5-3.5L15.5 11" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <div className="leading-tight">
                <h1 className="font-bold text-xl tracking-tight text-slate-900">PaveUp</h1>
                <p className="text-xs text-slate-500 font-medium">{t.tagline}</p>
              </div>
            </Link>
            <div className="flex items-center gap-4">
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
                <a className="hover:text-brand-600 transition-colors" href="#contact">{t.navContact}</a>
              </nav>
              <LanguageToggle />
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1">
        <Routes>
          <Route path="/" element={
            <section className="min-h-screen relative overflow-hidden">
              {/* Background overlay */}
              <div 
                className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-30"
                style={{
                  backgroundImage: `url(${potholeImg})`,
                  filter: 'blur(6px) brightness(0.8)',
                  transform: 'scale(1.1)'
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-br from-slate-50/70 via-white/50 to-slate-100/70" />
              
              {/* Content */}
              <div className="relative z-10 max-w-xl mx-auto px-4 sm:px-6 py-12 md:py-16">
                <div className="text-center mb-8">
                  <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-slate-900 mb-3">
                    {t.homeTitle}
                  </h1>
                  <p className="text-slate-600 text-lg">{t.homeSubtitle}</p>
                </div>
                <div className="glass rounded-2xl p-6 md:p-8 backdrop-blur-sm bg-white/80 border border-white/20 shadow-xl">
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