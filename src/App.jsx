import React, { useMemo } from 'react'
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom'
import ReportForm from './components/ReportForm.jsx'
import About from './pages/About.jsx'
import FAQ from './pages/FAQ.jsx'

function AppContent() {
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
                <p className="text-xs text-slate-500 font-medium">See it. Report it. Improve it.</p>
              </div>
            </Link>
            <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600">
              <Link 
                to="/" 
                className={`hover:text-brand-600 transition-colors ${location.pathname === '/' ? 'text-brand-600' : ''}`}
              >
                Home
              </Link>
              <Link 
                to="/about" 
                className={`hover:text-brand-600 transition-colors ${location.pathname === '/about' ? 'text-brand-600' : ''}`}
              >
                About
              </Link>
              <Link 
                to="/faq" 
                className={`hover:text-brand-600 transition-colors ${location.pathname === '/faq' ? 'text-brand-600' : ''}`}
              >
                FAQ
              </Link>
              <a className="hover:text-brand-600 transition-colors" href="#contact">Contact</a>
            </nav>
          </div>
        </div>
      </header>

      <main className="flex-1">
        <Routes>
          <Route path="/" element={
            <section className="min-h-screen">
              <div className="max-w-xl mx-auto px-4 sm:px-6 py-12 md:py-16">
                <div className="text-center mb-8">
                  <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-slate-900 mb-3">
                    Report a civic issue
                  </h1>
                  <p className="text-slate-600 text-lg">Help us improve your neighborhood in under 30 seconds</p>
                </div>
                <div className="glass rounded-2xl p-6 md:p-8">
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
          <p>© {year} PaveUp</p>
          <p>Built with ❤️ for better streets</p>
        </div>
      </footer>
    </div>
  )
}

export default function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  )
}