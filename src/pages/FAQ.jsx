import React, { useState } from 'react'
import { Link } from 'react-router-dom'

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState(2) // Start with "Do I need to create an account?" open

  const faqs = [
    {
      question: "What is PaveUp?",
      answer: "PaveUp is a civic-issue reporting platform that lets you instantly report potholes, garbage, electrical hazards, construction debris and more. It auto-detects your location and routes the complaint to the right authority."
    },
    {
      question: "How do I submit a report?",
      answer: "Choose the issue type, upload a photo, and allow location detection. PaveUp automatically sends your report to the correct civic agency."
    },
    {
      question: "Do I need to create an account?",
      answer: "No. PaveUp is designed to be as frictionless as possible. You can submit reports without creating an account or sharing personal details."
    },
    {
      question: "What types of issues can I report?",
      answer: "Road damage, potholes, garbage overflow, electrical hazards, broken streetlights, construction debris, illegal dumping and more."
    },
    {
      question: "How does location detection work?",
      answer: "With your permission, PaveUp uses your device or browser's GPS to pinpoint your location and route the complaint to the right agency."
    },
    {
      question: "Why do you need photos?",
      answer: "Photos provide evidence, help agencies prioritise and verify complaints, and improve fix accuracy."
    },
    {
      question: "How quickly will issues be fixed?",
      answer: "Timelines vary by city and department. PaveUp forwards your report immediately; the fix schedule is determined by the authority."
    },
    {
      question: "Can I track the status of my report?",
      answer: "Yes. After submitting, you'll get a unique tracking link to monitor progress and receive updates."
    },
    {
      question: "Is my data private?",
      answer: "Yes. PaveUp stores only the minimum information needed to process your report and never sells or shares personal data."
    },
    {
      question: "Is PaveUp available in my city?",
      answer: "We're rolling out city by city. Check availability on the homepage or allow location detection; we'll notify you if your area is supported."
    }
  ]

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? -1 : index)
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-8 md:py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-slate-900 mb-3">
              Frequently Asked Questions
            </h1>
            <p className="text-slate-600">
              Find answers to common questions about using PaveUp
            </p>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="glass rounded-xl">
            <div className="p-6 md:p-8">
              <div className="space-y-4">
                {faqs.map((faq, index) => (
                  <div key={index} className="border-b border-slate-200 last:border-b-0">
                    <button
                      onClick={() => toggleFAQ(index)}
                      className="w-full text-left py-4 flex items-center justify-between hover:bg-slate-50/50 rounded-lg px-2 -mx-2 transition-colors"
                    >
                      <h3 className="font-semibold text-slate-900 pr-4">
                        {faq.question}
                      </h3>
                      <div className="flex-shrink-0">
                        <svg
                          className={`w-5 h-5 text-slate-500 transition-transform duration-200 ${
                            openIndex === index ? 'rotate-180' : ''
                          }`}
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 9l-7 7-7-7"
                          />
                        </svg>
                      </div>
                    </button>
                    {openIndex === index && (
                      <div className="pb-4 px-2">
                        <p className="text-slate-600 leading-relaxed">
                          {faq.answer}
                        </p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="glass rounded-xl p-6 md:p-8 text-center">
            <h2 className="text-xl md:text-2xl font-bold text-slate-900 mb-4">
              Still have questions?
            </h2>
            <p className="text-slate-600 mb-6">
              If you couldn't find the answer you were looking for, please feel free to contact us directly.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="inline-flex items-center justify-center px-6 py-3 border border-slate-300 rounded-lg font-medium text-slate-700 hover:bg-slate-50 transition-colors">
                Contact Us
              </button>
              <Link 
                to="/" 
                className="inline-flex items-center justify-center px-6 py-3 bg-brand-600 text-white rounded-lg font-medium hover:bg-brand-700 transition-colors"
              >
                Report an Issue
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
