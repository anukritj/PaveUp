import React, { useCallback, useMemo, useRef, useState } from 'react'
import SubmitAckModal from './SubmitAckModal.jsx'
import { analyzeCivicIssue } from '../utils/imageAnalysis.js'
import potholeImg from '../images/pothole.jpeg'
import garbageImg from '../images/Garbage.jpg'
import { useTranslations } from '../hooks/useTranslations.js'
import { useLanguage } from '../context/LanguageContext.jsx'

export default function ReportForm() {
  const t = useTranslations();
  const { language } = useLanguage();

  const ISSUE_OPTIONS = useMemo(() => [
    { value: 'pothole', label: t.issueOptions.pothole },
    { value: 'garbage', label: t.issueOptions.garbage },
    { value: 'electrical', label: t.issueOptions.electrical },
    { value: 'stray-cattle', label: t.issueOptions.strayCattle },
    { value: 'debris', label: t.issueOptions.debris },
    { value: 'stagnant-water', label: t.issueOptions.stagnantWater },
    { value: 'burning-waste', label: t.issueOptions.burningWaste },
  ], [t]);

  const [issueType, setIssueType] = useState('')
  const [photo, setPhoto] = useState(null)
  const [photoPreview, setPhotoPreview] = useState('')
  const [coords, setCoords] = useState({ lat: '', lng: '' })
  const [statusMsg, setStatusMsg] = useState('')
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const fileInputRef = useRef(null)
  const [showAck, setShowAck] = useState(false)
  const [errors, setErrors] = useState({ issue: '', photo: '', phone: '' })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analysis, setAnalysis] = useState(null)

  const disabled = useMemo(() => !issueType || !photo || !coords.lat || !coords.lng, [issueType, photo, coords])

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
        // Auto-suggest issue type only if it's a confirmed civic issue
        if (result.analysis.isCivicIssue && result.analysis.issueType) {
          const matchedOption = ISSUE_OPTIONS.find(opt => 
            opt.label.toLowerCase().includes(result.analysis.issueType.toLowerCase()) ||
            result.analysis.issueType.toLowerCase().includes(opt.label.toLowerCase())
          )
          if (matchedOption) {
            setIssueType(matchedOption.value)
          }
        }
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
  }, [language, ISSUE_OPTIONS, t])

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
        setStatusMsg(t.locationDetected)
      },
      (err) => {
        setStatusMsg(`${t.locationError}${err.message}`)
      },
      { enableHighAccuracy: true, timeout: 10000 }
    )
  }, [t])

  const onSubmit = useCallback((e) => {
    e.preventDefault()
    const newErrors = { issue: '', photo: '', phone: '' }
    if (!issueType) newErrors.issue = t.validationIssue
    if (!photo) newErrors.photo = t.validationPhoto
    if (phone && phone.length !== 10) newErrors.phone = t.validationPhone
    setErrors(newErrors)
    if (newErrors.issue || newErrors.photo || newErrors.phone) return
    const payload = {
      issueType,
      location: { latitude: coords.lat, longitude: coords.lng },
      name: name.trim() || undefined,
      phone: phone.trim() || undefined,
      photoName: photo?.name || undefined,
      timestamp: new Date().toISOString(),
    }
    // For now, just log the structured data
    // eslint-disable-next-line no-console
    console.log('PaveUp form submission:', payload)
    setIsSubmitting(true)
    setTimeout(() => {
      setIsSubmitting(false)
      setShowAck(true)
    }, 2000)
  }, [issueType, coords, name, phone, photo, t])

  const setPhoneSafe = useCallback((val) => {
    const onlyNums = val.replace(/[^0-9]/g, '').slice(0, 10)
    setPhone(onlyNums)
  }, [])

  return (
    <form className="space-y-8" onSubmit={onSubmit}>
      <div className="space-y-1">
        <label className="text-sm font-medium text-slate-700" htmlFor="issue">{t.issueTypeLabel} <span className="text-red-500">*</span></label>
        <select
          id="issue"
          value={issueType}
          onChange={(e) => setIssueType(e.target.value)}
          className="w-full rounded-lg border border-slate-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 bg-white text-slate-700 font-medium shadow-sm transition-colors"
        >
          <option value="" disabled>{t.issueTypeLabel}...</option>
          {ISSUE_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
        {errors.issue && <p className="text-xs text-red-600 mt-1">{errors.issue}</p>}
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-slate-700">{t.uploadPhotoLabel} <span className="text-red-500">*</span></label>
        <div className="relative">
          {!photoPreview ? (
            <label
              htmlFor="paveup-photo"
              className="block h-40 rounded-xl border-2 border-dashed border-slate-300 grid place-items-center cursor-pointer hover:border-brand-400 hover:bg-brand-50/50 transition-all duration-200 group"
            >
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
            <div className="relative h-40 rounded-xl overflow-hidden border">
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
              
              {analysis.isCivicIssue && analysis.recommendedPortal && (
                <div className="mt-3 p-3 bg-white rounded border border-green-300">
                  <div className="font-medium text-green-800 mb-1">📍 {t.aiRecommendedPortal}</div>
                  <div className="text-green-700">
                    <div className="font-semibold">{analysis.recommendedPortal.name}</div>
                    <div className="text-sm">{analysis.recommendedPortal.department}</div>
                    {analysis.recommendedPortal.helpline && (
                      <div className="text-sm mt-1">
                        📞 Helpline: <span className="font-mono">{analysis.recommendedPortal.helpline}</span>
                      </div>
                    )}
                    {analysis.recommendedPortal.website && (
                      <div className="text-sm">
                        🌐 Website: <a href={analysis.recommendedPortal.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">{analysis.recommendedPortal.website}</a>
                      </div>
                    )}
                  </div>
                </div>
              )}
              
              {analysis.isCivicIssue && analysis.actionSteps && analysis.actionSteps.length > 0 && (
                <div className="mt-2">
                  <span className="font-medium text-green-700">{t.aiNextSteps}</span>
                  <ul className="list-disc list-inside text-green-600 text-xs mt-1 space-y-0.5">
                    {analysis.actionSteps.map((step, idx) => (
                      <li key={idx}>{step}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {!photoPreview && (
      <div className="space-y-2">
        <p className="text-sm font-medium text-slate-700">{t.exampleImages}</p>
        <div className="grid grid-cols-2 gap-3">
          <figure className="overflow-hidden rounded-lg border">
            <img src={potholeImg} alt="Pothole example" className="h-28 w-full object-cover" />
            <figcaption className="px-2 py-1 text-xs text-slate-700">{t.examplePothole}</figcaption>
          </figure>
          <figure className="overflow-hidden rounded-lg border">
            <img src={garbageImg} alt="Garbage example" className="h-28 w-full object-cover" />
            <figcaption className="px-2 py-1 text-xs text-slate-700">{t.exampleGarbage}</figcaption>
          </figure>
        </div>
      </div>
      )}

      <div className="space-y-2">
        <label className="text-sm font-medium text-slate-700">{t.locationLabel}</label>
        <div className="flex flex-wrap items-center gap-3">
          <button type="button" onClick={detectLocation} className="inline-flex items-center gap-2 rounded-lg bg-brand-600 text-white px-4 py-3 hover:bg-brand-700 font-medium shadow-lg hover:shadow-xl transition-all duration-200">
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span>{t.detectLocationBtn}</span>
          </button>
          <div className="flex items-center gap-2 text-sm text-slate-600">
            <span className="px-2 py-1 bg-slate-100 rounded">Lat: {coords.lat || '-'}</span>
            <span className="px-2 py-1 bg-slate-100 rounded">Lng: {coords.lng || '-'}</span>
          </div>
        </div>
        {statusMsg && <p className="text-xs text-slate-500">{statusMsg}</p>}
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">{t.nameLabel}</label>
          <input value={name} onChange={(e) => setName(e.target.value)} placeholder={t.nameLabel} className="w-full rounded-lg border border-slate-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 shadow-sm transition-colors" />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">{t.phoneLabel}</label>
          <input value={phone} onChange={(e) => setPhoneSafe(e.target.value)} placeholder={t.phoneLabel} inputMode="numeric" className={`w-full rounded-lg border px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand-500 shadow-sm transition-colors ${errors.phone ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : 'border-slate-300 focus:border-brand-500'}`} />
          <p className={`text-xs mt-1 ${errors.phone ? 'text-red-600' : 'text-slate-500'}`}>{errors.phone || t.phoneHint}</p>
        </div>
      </div>

      <button type="submit" disabled={disabled || isSubmitting} className={`w-full md:w-auto inline-flex items-center justify-center gap-3 rounded-xl px-6 py-4 font-semibold text-lg transition-all duration-200 ${disabled || isSubmitting ? 'bg-slate-300 text-slate-600 cursor-not-allowed' : 'bg-gradient-to-r from-brand-600 to-brand-700 hover:from-brand-700 hover:to-brand-800 text-white shadow-lg hover:shadow-xl transform hover:-translate-y-0.5'}`}>
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
          setIssueType('')
          setPhoto(null)
          setPhotoPreview('')
          setCoords({ lat: '', lng: '' })
          setStatusMsg('')
          setName('')
          setPhone('')
          setAnalysis(null)
          setShowAck(false)
        }}
      />
    </form>
  )
}


