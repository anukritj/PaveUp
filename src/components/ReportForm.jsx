import React, { useCallback, useMemo, useRef, useState } from 'react'
import SubmitAckModal from './SubmitAckModal.jsx'
import { analyzeCivicIssue } from '../utils/imageAnalysis.js'
import { getTelanganaPortal } from '../utils/portals.js'
import potholeImg from '../images/pothole.jpeg'
import garbageImg from '../images/Garbage.jpg'
import electricHazardImg from '../images/electric_hazard.jpeg'
import strayCattleImg from '../images/stray cattle.jpeg'
import debrisImg from '../images/construction debris.jpg'
import stagnantWaterImg from '../images/stagnant water.jpeg'
import burningWasteImg from '../images/burning waste.jpeg'
import streetLightImg from '../images/street light.webp'
import sewageImg from '../images/sewage.webp'
import waterLeakageImg from '../images/water pipeline leakage.jpg'
import manholeImg from '../images/missing manhole.jpeg'
import footpathImg from '../images/broken footpath.jpg'
import { useTranslations } from '../hooks/useTranslations.js'
import { useLanguage } from '../context/LanguageContext.jsx'

export default function ReportForm() {
  const t = useTranslations();
  const { language } = useLanguage();

  // Issue type will be inferred from AI analysis; no manual select required
  const [photo, setPhoto] = useState(null)
  const [photoPreview, setPhotoPreview] = useState('')
  const [coords, setCoords] = useState({ lat: '', lng: '' })
  const [statusMsg, setStatusMsg] = useState('')
  const [humanAddress, setHumanAddress] = useState({ display: '', pincode: '' })
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const fileInputRef = useRef(null)
  const [showAck, setShowAck] = useState(false)
  const [errors, setErrors] = useState({ photo: '', phone: '' })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analysis, setAnalysis] = useState(null)
  const [modalPortal, setModalPortal] = useState(null)
  const [modalEta, setModalEta] = useState('')

  const disabled = useMemo(() => !photo || !coords.lat || !coords.lng, [photo, coords])

  // Horizontal example gallery items - ordered by frequency based on GHMC data
  const EXAMPLE_GALLERY = useMemo(() => ([
    // Top 3 most frequent issues
    { key: 'pothole', label: t.issueOptions?.pothole || 'Pothole', src: potholeImg },
    { key: 'garbage', label: t.issueOptions?.garbage || 'Garbage', src: garbageImg },
    { key: 'street-light', label: 'Street Light Issue', src: streetLightImg },
    
    // Water & sewerage issues (very common)
    { key: 'stagnant-water', label: t.issueOptions?.stagnantWater || 'Stagnant Water', src: stagnantWaterImg },
    { key: 'sewerage-overflow', label: 'Sewerage Overflow', src: sewageImg },
    { key: 'water-leakage', label: 'Water Pipe Leakage', src: waterLeakageImg },
    
    // Infrastructure & safety
    { key: 'debris', label: t.issueOptions?.debris || 'Construction Debris', src: debrisImg },
    { key: 'manhole-cover', label: 'Missing Manhole Cover', src: manholeImg },
    { key: 'footpath-repair', label: 'Broken Footpath', src: footpathImg },
    
    // Animals & health
    { key: 'stray-cattle', label: t.issueOptions?.strayCattle || 'Stray Cattle', src: strayCattleImg },
    
    // Utilities & environment
    { key: 'electrical', label: t.issueOptions?.electrical || 'Electrical Hazard', src: electricHazardImg },
    { key: 'burning-waste', label: t.issueOptions?.burningWaste || 'Burning Waste', src: burningWasteImg }
  ]), [t])

  const onPickFile = useCallback(() => fileInputRef.current?.click(), [])

  const onFileChange = useCallback(async (e) => {
    const input = e.target
    const file = input.files?.[0]
    if (!file) return
    
    setPhoto(file)
    const reader = new FileReader()
    reader.onload = () => setPhotoPreview(String(reader.result))
    reader.readAsDataURL(file)
    
    // Analyze image with GPT-4 Vision
    setIsAnalyzing(true)
    try {
      const result = await analyzeCivicIssue(file, language)
      if (result.success) {
        setAnalysis(result.analysis)
      } else {
        setAnalysis(result.fallback)
      }
    } catch (error) {
      console.error('Image analysis failed:', error)
    } finally {
      setIsAnalyzing(false)
    }
    
    // allow re-uploading the same file by clearing the input value
    input.value = ''
  }, [language, t])

  const detectLocation = useCallback(() => {
    if (!('geolocation' in navigator)) {
      setStatusMsg(t.locationNotSupported)
      return
    }
    setStatusMsg(t.detectingLocation)
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords
        setCoords({ lat: latitude.toFixed(6), lng: longitude.toFixed(6) })
        // Reverse geocode to human-readable address (road and PIN)
        fetch(`https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}&addressdetails=1` , {
          headers: { 'Accept': 'application/json' }
        })
          .then((res) => res.json())
          .then((data) => {
            const addr = data?.address || {}
            const road = addr.road || addr.neighbourhood || addr.suburb || ''
            const area = addr.village || addr.suburb || addr.neighbourhood || addr.hamlet || ''
            const city = addr.city || addr.town || addr.county || ''
            const state = addr.state || ''
            const pin = addr.postcode || ''
            const parts = [road, area || city].filter(Boolean)
            const display = parts.join(', ')
            setHumanAddress({ display, pincode: pin })
            setStatusMsg(t.locationDetected)
          })
          .catch(() => {
            setHumanAddress({ display: '', pincode: '' })
            setStatusMsg(t.locationDetected)
          })
      },
      (err) => {
        setStatusMsg(`${t.locationError}${err.message}`)
      },
      { enableHighAccuracy: true, timeout: 10000 }
    )
  }, [t])

  const onSubmit = useCallback((e) => {
    e.preventDefault()
    const newErrors = { photo: '', phone: '' }
    if (!photo) newErrors.photo = t.validationPhoto
    if (phone && phone.length !== 10) newErrors.phone = t.validationPhone
    setErrors(newErrors)
    if (newErrors.photo || newErrors.phone) return
    // Determine portal and ETA for the acknowledgement modal
    const detectedIssue = analysis?.issueType || 'General Civic Issue'
    const recommended = analysis?.recommendedPortal || getTelanganaPortal(
      // map some friendly issue strings to keys used in portal mapping
      (detectedIssue || '').toLowerCase().includes('pothole') ? 'pothole' :
      (detectedIssue || '').toLowerCase().includes('garbage') ? 'garbage' :
      (detectedIssue || '').toLowerCase().includes('stagnant') ? 'stagnant-water' :
      (detectedIssue || '').toLowerCase().includes('sewer') ? 'sewerage-overflow' :
      (detectedIssue || '').toLowerCase().includes('electric') ? 'electrical' :
      (detectedIssue || '').toLowerCase().includes('debris') ? 'debris' :
      (detectedIssue || '').toLowerCase().includes('footpath') ? 'footpath-repair' :
      (detectedIssue || '').toLowerCase().includes('manhole') ? 'manhole-cover' :
      (detectedIssue || '').toLowerCase().includes('cattle') ? 'stray-cattle' :
      'pothole'
    )
    const eta = analysis?.estimatedResolutionTime || recommended?.sla || 'Within standard SLA'

    const payload = {
      issueType: analysis?.issueType || 'General Civic Issue',
      location: { latitude: coords.lat, longitude: coords.lng },
      address: humanAddress.display || undefined,
      pincode: humanAddress.pincode || undefined,
      name: name.trim() || undefined,
      phone: phone.trim() || undefined,
      photoName: photo?.name || undefined,
      timestamp: new Date().toISOString(),
    }
    // For now, just log the structured data
    // eslint-disable-next-line no-console
    console.log('PaveUp form submission:', payload)
    setIsSubmitting(true)
    setModalPortal(recommended || null)
    setModalEta(eta)
    setTimeout(() => {
      setIsSubmitting(false)
      setShowAck(true)
    }, 2000)
  }, [analysis, coords, humanAddress, name, phone, photo, t])

  const setPhoneSafe = useCallback((val) => {
    const onlyNums = val.replace(/[^0-9]/g, '').slice(0, 10)
    setPhone(onlyNums)
  }, [])

  return (
    <form className="space-y-8" onSubmit={onSubmit}>
      {/* Form header (moved inside the form as requested) */}
      <div className="text-center mb-2">
        <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-slate-900 mb-2">
          {t.homeTitle}
        </h2>
        <p className="text-slate-600">
          {t.homeSubtitle}
        </p>
      </div>
      <div className="divider-soft" />

      <div className="space-y-2">
        <label className="text-sm font-medium text-slate-700">{t.uploadPhotoLabel} <span className="text-red-500">*</span></label>
        <div className="relative">
          {!photoPreview ? (
            <label
              htmlFor="paveup-photo"
              className="glass relative block h-40 rounded-xl border-2 border-dashed border-slate-300 grid place-items-center cursor-pointer hover:border-brand-400 hover:bg-brand-50/50 transition-all duration-200 group"
            >
              <span className="pointer-events-none absolute inset-0 rounded-xl border-2 border-dashed border-brand-300/70"></span>
              <div className="text-center">
                <div className="mx-auto mb-2 h-8 w-8 rounded-full bg-slate-100 group-hover:bg-brand-100 flex items-center justify-center">
                  <svg className="h-4 w-4 text-slate-400 group-hover:text-brand-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                </div>
                <p className="text-sm text-slate-500 group-hover:text-brand-600">{t.uploadPhotoPlaceholder}</p>
              </div>
            </label>
          ) : (
            <div className="relative h-40 rounded-xl overflow-hidden border bg-white/80 backdrop-blur-sm">
              <img src={photoPreview} alt="Preview" className="h-full w-full object-cover" />
              <button
                type="button"
                onClick={() => { setPhoto(null); setPhotoPreview(''); setAnalysis(null); }}
                className="absolute right-2 top-2 inline-flex h-8 w-8 items-center justify-center rounded-full bg-red-500/90 text-white shadow hover:bg-red-600"
                aria-label="Remove image"
              >
                ✕
              </button>
            </div>
          )}
          <input id="paveup-photo" ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={onFileChange} />
        </div>
        {errors.photo && <p className="text-xs text-red-600 mt-1">{errors.photo}</p>}
        
        {/* AI Analysis Results */}
        {isAnalyzing && (
          <div className="mt-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
            <div className="flex items-center gap-2 text-blue-700">
              <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" d="M4 12a8 8 0 018-8" stroke="currentColor" strokeWidth="4"></path>
              </svg>
              <span className="text-sm font-medium">{t.analyzingWithAI}</span>
            </div>
          </div>
        )}
        
        {analysis && (
          <div className={`mt-3 p-4 rounded-lg border ${analysis.issueType === 'Unclear Image' ? 'bg-red-50 border-red-300' : analysis.isCivicIssue ? 'bg-green-50 border-green-200' : 'bg-yellow-50 border-yellow-300'}`}>
            <h4 className={`text-sm font-semibold mb-2 ${analysis.issueType === 'Unclear Image' ? 'text-red-800' : analysis.isCivicIssue ? 'text-green-800' : 'text-yellow-800'}`}>🤖 {t.aiAnalysisTitle}</h4>
            <div className="space-y-2 text-sm">
              <div>
                <span className={`font-medium ${analysis.issueType === 'Unclear Image' ? 'text-red-700' : analysis.isCivicIssue ? 'text-green-700' : 'text-yellow-700'}`}>{t.aiIssueDetected}</span> 
                <span className={`ml-1 ${analysis.issueType === 'Unclear Image' ? 'text-red-600' : analysis.isCivicIssue ? 'text-green-600' : 'text-yellow-600'}`}>{analysis.issueType}</span>
                {analysis.isCivicIssue && analysis.severity && (
                  <span className={`ml-2 px-2 py-0.5 rounded text-xs font-medium ${
                    analysis.severity === 'High' ? 'bg-red-100 text-red-700' :
                    analysis.severity === 'Medium' ? 'bg-yellow-100 text-yellow-700' :
                    'bg-green-100 text-green-700'
                  }`}>
                    {analysis.severity} Priority
                  </span>
                )}
              </div>
              
              {analysis.description && (
                <div>
                  <span className={`font-medium ${analysis.issueType === 'Unclear Image' ? 'text-red-700' : analysis.isCivicIssue ? 'text-green-700' : 'text-yellow-700'}`}>{t.aiDescription}</span>
                  <p className={`mt-1 ${analysis.issueType === 'Unclear Image' ? 'text-red-600' : analysis.isCivicIssue ? 'text-green-600' : 'text-yellow-600'}`}>{analysis.description}</p>
                </div>
              )}
              
              {/* Recommended portal moved to submission acknowledgement modal */}
              
              {/* Next Steps intentionally removed as per requirements */}
            </div>
          </div>
        )}
      </div>

      {!photoPreview && (
        <div className="space-y-2">
          <p className="text-sm font-medium text-slate-700">{t.exampleImages}</p>
          <div className="-mx-1">
            <div
              className="flex gap-3 overflow-x-auto px-1 pb-2 snap-x snap-mandatory scrollbar-thin scrollbar-thumb-slate-300/70 scrollbar-track-transparent"
              aria-label="Examples of civic issues"
            >
              {EXAMPLE_GALLERY.map((item) => (
                <figure key={item.key} className="glass min-w-[160px] max-w-[180px] snap-start shrink-0 rounded-xl overflow-hidden">
                  <img src={item.src} alt={`${item.label} example`} className="h-24 w-full object-cover" loading="lazy" />
                  <figcaption className="px-2 py-1 text-xs text-slate-700 truncate">{item.label}</figcaption>
                </figure>
              ))}
            </div>
          </div>
        </div>
      )}

      <div className="space-y-2">
        <label className="text-sm font-medium text-slate-700">{t.locationLabel}</label>
        <div className="flex flex-wrap items-center gap-3">
          <button type="button" onClick={detectLocation} className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-lg bg-brand-600 text-white px-4 py-3 hover:bg-brand-700 font-medium shadow-lg hover:shadow-xl transition-all duration-200 glass-hover focus-ring">
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span>{t.detectLocationBtn}</span>
          </button>
          <div className="flex items-center gap-2 text-sm text-slate-600 w-full sm:w-auto">
            {humanAddress.display && (
              <>
                <span className="px-2 py-1 bg-slate-100 rounded max-w-full sm:max-w-[220px] truncate" title={humanAddress.display}>📍 {humanAddress.display}</span>
                {humanAddress.pincode && (
                  <span className="px-2 py-1 bg-slate-100 rounded">PIN: {humanAddress.pincode}</span>
                )}
              </>
            )}
          </div>
        </div>
        {statusMsg && <p className="text-xs text-slate-500">{statusMsg}</p>}
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">{t.nameLabel}</label>
          <input value={name} onChange={(e) => setName(e.target.value)} placeholder={t.nameLabel} className="w-full rounded-lg border border-slate-300 px-4 py-3 shadow-sm transition-colors bg-white/95 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 focus-ring" />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">{t.phoneLabel}</label>
          <input value={phone} onChange={(e) => setPhoneSafe(e.target.value)} placeholder={t.phoneLabel} inputMode="numeric" className={`w-full rounded-lg border px-4 py-3 shadow-sm transition-colors bg-white/95 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus-ring ${errors.phone ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : 'border-slate-300 focus:border-brand-500'}`} />
          {errors.phone && <p className="text-xs mt-1 text-red-600">{errors.phone}</p>}
        </div>
      </div>

      <button type="submit" disabled={disabled || isSubmitting} className={`w-full md:w-auto inline-flex items-center justify-center gap-3 rounded-xl px-6 py-4 font-semibold text-lg transition-all duration-200 glass-hover ${disabled || isSubmitting ? 'bg-slate-300 text-slate-600 cursor-not-allowed' : 'bg-gradient-to-r from-brand-600 to-brand-700 hover:from-brand-700 hover:to-brand-800 text-white shadow-lg hover:shadow-xl transform hover:-translate-y-0.5'}`}>
        {isSubmitting && (
          <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" d="M4 12a8 8 0 018-8" stroke="currentColor" strokeWidth="4"></path>
          </svg>
        )}
        {isSubmitting ? t.submitting : t.submitBtn}
      </button>

      <SubmitAckModal
        open={showAck}
        onClose={() => setShowAck(false)}
        onAgain={() => {
          // reset form for another report
          setPhoto(null)
          setPhotoPreview('')
          setCoords({ lat: '', lng: '' })
          setHumanAddress({ display: '', pincode: '' })
          setStatusMsg('')
          setName('')
          setPhone('')
          setAnalysis(null)
          setShowAck(false)
        }}
        portal={modalPortal}
        eta={modalEta}
      />
    </form>
  )
}


