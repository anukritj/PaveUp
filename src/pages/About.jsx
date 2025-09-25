import React from 'react'
import { Link } from 'react-router-dom'

export default function About() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-brand-50/30">
      {/* Hero Section */}
      <section className="relative py-8 md:py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-slate-900 mb-3">
              About PaveUp
            </h1>
            <p className="text-slate-600">
              Empowering citizens to create cleaner, safer neighborhoods
            </p>
          </div>
        </div>
      </section>

      {/* Our Vision Section */}
      <section className="py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white/90 backdrop-blur-sm rounded-xl p-6 md:p-8 shadow-lg border border-white/30">
            <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-4">Our Vision</h2>
            <div className="text-slate-700 leading-relaxed space-y-4">
              <p>
                PaveUp is built with a vision to simplify how citizens report civic issues. From potholes to waste dumping, 
                we want to make it effortless for people to notify the right authorities — without jumping through hoops.
              </p>
              <p>
                By enabling quick, visual, and location-based reports, PaveUp aims to help create cleaner, safer, 
                and better-organized neighborhoods.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* What Problem Are We Solving Section */}
      <section className="py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white/90 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-white/30">
              <h2 className="text-xl md:text-2xl font-bold text-slate-900 mb-4">What Problem Are We Solving?</h2>
              <div className="space-y-3 text-slate-700">
                <p>
                  Reporting everyday civic problems is often frustrating — long forms, unclear contacts, 
                  or apps that require logins and time-consuming steps.
                </p>
                <p>
                  PaveUp eliminates all that friction. No downloads, no accounts — just a simple, 
                  intuitive web interface that gets your report where it needs to go.
                </p>
              </div>
            </div>
            <div className="bg-white/90 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-white/30">
              <h2 className="text-xl md:text-2xl font-bold text-slate-900 mb-4">How It Works</h2>
              <div className="space-y-3 text-slate-700">
                <p>
                  PaveUp connects citizens directly with local government departments responsible for addressing community issues. 
                  When you submit a report, it's automatically routed to the appropriate department based on the category and location information you provide.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Key Benefits Section */}
      <section className="py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white/90 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-white/30">
            <h2 className="text-xl md:text-2xl font-bold text-slate-900 mb-6">Key Benefits</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-brand-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <svg className="w-4 h-4 text-brand-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900 mb-1">Smart Location</h3>
                  <p className="text-slate-600 text-sm">We automatically grab your location to pinpoint where the issue exists</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-brand-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <svg className="w-4 h-4 text-brand-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900 mb-1">Visual First</h3>
                  <p className="text-slate-600 text-sm">Upload a photo to show exactly what's wrong — no need for long descriptions</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-brand-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <svg className="w-4 h-4 text-brand-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900 mb-1">Web-Based & Simple</h3>
                  <p className="text-slate-600 text-sm">No app install, no login — just visit, report, and done</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-brand-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <svg className="w-4 h-4 text-brand-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900 mb-1">Fast & Frictionless</h3>
                  <p className="text-slate-600 text-sm">Submit a report in under a minute. It's that easy</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>


      {/* Call to Action Section */}
      <section className="py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="bg-white/90 backdrop-blur-sm rounded-xl p-8 shadow-lg border border-white/30">
            <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-4">
              Ready to make your streets better?
            </h2>
            <p className="text-slate-600 mb-6">
              Join thousands of citizens who are already making a difference in their communities
            </p>
            <Link 
              to="/" 
              className="inline-flex items-center gap-3 bg-brand-600 text-white px-6 py-3 rounded-lg font-semibold shadow-lg hover:bg-brand-700 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Report an Issue
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
