import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ChevronRight, ChevronLeft, Sparkles } from 'lucide-react'
import { useBuilderStore } from '../../store/builderStore'
import { landingPageService } from '../../services/landingPageService'
import { Button } from '../../components/ui/Button'
import { Step1_ContentInput } from './steps/Step1_ContentInput'
import { Step2_FormFields } from './steps/Step2_FormFields'
import { Step3_Colors } from './steps/Step3_Colors'
import { Step4_PickVariant } from './steps/Step4_PickVariant'

const STEPS = [
  { label: 'תוכן',   description: 'טקסט, לוגו ותמונות' },
  { label: 'טופס',   description: 'שדות יצירת קשר' },
  { label: 'עיצוב',  description: 'סגנון, צבעים ומראה' },
  { label: 'יוצר…',  description: 'AI מעצב את הדף' },
]

export default function BuilderPage() {
  const navigate = useNavigate()
  const {
    step, setStep, inputData, landingPageId, setLandingPageId,
    formFields, settings, selectedStyleIds, setGeneratedVariants, setIsGenerating, reset,
  } = useBuilderStore()

  const [logo, setLogo]     = useState<File | null>(null)
  const [images, setImages] = useState<File[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError]   = useState('')

  const createAndGenerate = async () => {
    if (!inputData.title.trim()) { setError('נדרש שם לדף'); return }
    setLoading(true)
    setError('')
    try {
      let pageId = landingPageId

      if (!pageId) {
        const fd = new FormData()
        fd.append('title', inputData.title)
        fd.append('input_text', inputData.input_text)
        fd.append('input_url', inputData.input_url)
        formFields.forEach((f) => fd.append('form_fields[]', f))
        fd.append('settings', JSON.stringify({ ...settings, selected_style_ids: selectedStyleIds }))
        if (logo)   fd.append('logo', logo)
        images.forEach((img) => fd.append('images[]', img))

        const { data } = await landingPageService.create(fd)
        pageId = data.id
        setLandingPageId(pageId)
      } else {
        await landingPageService.update(pageId, { form_fields: formFields, settings: { ...settings, selected_style_ids: selectedStyleIds } })
      }

      setIsGenerating(true)
      setStep(4) // Show loading screen

      const { data: genData } = await landingPageService.generateVariants(pageId)
      setGeneratedVariants(genData.variants)

      // Auto-select first variant — user will switch in the editor
      if (genData.variants.length > 0) {
        await landingPageService.selectVariant(pageId, genData.variants[0].id)
      }

      reset()
      navigate(`/editor/${pageId}`)
    } catch (e: any) {
      setError(e?.response?.data?.message ?? 'שגיאה ביצירת הדף')
      setStep(1)
    } finally {
      setLoading(false)
      setIsGenerating(false)
    }
  }

  const canAdvance = () => {
    if (step === 1) return inputData.title.trim().length > 0
    if (step === 2) return formFields.length > 0
    if (step === 3) return selectedStyleIds.length === 2
    return false // Step 4 auto-navigates, no manual advance
  }

  const handleNext = async () => {
    if (step === 3) await createAndGenerate()
    else setStep(step + 1)
  }

  return (
    <div className="max-w-2xl mx-auto px-6 py-8">
      {/* Progress */}
      <div className="flex items-center gap-2 mb-8">
        {STEPS.map((s, i) => (
          <div key={i} className="flex items-center gap-2 flex-1">
            <div className={`flex items-center gap-2 ${i + 1 === step ? 'text-slate-900' : i + 1 < step ? 'text-indigo-600' : 'text-slate-400'}`}>
              <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-all ${
                i + 1 === step ? 'bg-indigo-600 border-indigo-600 text-white' :
                i + 1 < step  ? 'bg-indigo-50 border-indigo-400 text-indigo-600' :
                                 'bg-white border-slate-200 text-slate-400'
              }`}>
                {i + 1}
              </div>
              <span className="text-xs hidden sm:block font-medium">{s.label}</span>
            </div>
            {i < STEPS.length - 1 && (
              <div className={`flex-1 h-px ${i + 1 < step ? 'bg-indigo-400' : 'bg-slate-200'}`} />
            )}
          </div>
        ))}
      </div>

      {/* Step content */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 mb-6 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-900 mb-1">{STEPS[step - 1].label}</h2>
        <p className="text-slate-500 text-sm mb-5">{STEPS[step - 1].description}</p>

        {step === 1 && <Step1_ContentInput logo={logo} images={images} setLogo={setLogo} setImages={setImages} />}
        {step === 2 && <Step2_FormFields />}
        {step === 3 && <Step3_Colors />}
        {step === 4 && <Step4_PickVariant />}
      </div>

      {error && <p className="text-red-500 text-sm mb-4 text-center">{error}</p>}

      {/* Hide navigation on Step 4 — auto-navigates */}
      {step < 4 && (
        <div className="flex items-center gap-3">
          {step > 1 && (
            <Button variant="secondary" onClick={() => setStep(step - 1)} disabled={loading}>
              <ChevronRight className="w-4 h-4" />
              הקודם
            </Button>
          )}
          <Button onClick={handleNext} loading={loading} disabled={!canAdvance()} className="flex-1" size="lg">
            {step === 3 ? (
              <><Sparkles className="w-4 h-4" /> צור דפי נחיתה עם AI</>
            ) : (
              <>הבא <ChevronLeft className="w-4 h-4" /></>
            )}
          </Button>
        </div>
      )}
    </div>
  )
}
