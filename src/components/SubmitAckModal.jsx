import React, { useEffect } from 'react'

export default function SubmitAckModal({ open, onClose, onAgain }) {
  useEffect(() => {
    function onKey(e) {
      if (e.key === 'Escape') onClose()
    }
    if (open) document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [open, onClose])

  if (!open) return null
  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-slate-900/50" onClick={onClose} />
      <div className="absolute inset-0 flex items-center justify-center p-4">
        <div className="w-full max-w-xl rounded-2xl bg-white shadow-2xl ring-1 ring-black/5">
          <div className="flex justify-end p-3">
            <button aria-label="Close" onClick={onClose} className="rounded-full p-2 hover:bg-slate-100">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M5 5l10 10M15 5L5 15" stroke="#475569" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </button>
          </div>
          <div className="px-8 pb-8 text-center">
            <div className="mx-auto mb-4 grid h-16 w-16 place-items-center rounded-full bg-emerald-50">
              <svg width="36" height="36" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="12" cy="12" r="10" stroke="#10B981" strokeWidth="2" fill="none" />
                <path d="M8 12l2.5 2.5L16 9" stroke="#10B981" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <h2 className="text-2xl md:text-3xl font-semibold text-slate-900">
              Report Submitted
            </h2>
            <p className="mt-3 text-slate-600">
              Thanks for helping improve your neighborhood. Your report has been received.
            </p>
            <div className="mt-6 rounded-xl bg-slate-50 p-4 text-slate-700">
              Our partners will review your submission and take appropriate action.
            </div>
            <div className="mt-7">
              <button onClick={onAgain} className="inline-flex items-center justify-center rounded-md bg-brand-600 px-4 py-2 font-medium text-white hover:bg-brand-700">
                Report Another Issue
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}


