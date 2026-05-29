import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ChevronRight, ChevronLeft, Sparkles } from 'lucide-react'
import { useBuilderStore } from '../../store/builderStore'
import { landingPageService } from '../../services/landingPageService'
import { Button } from '../../components/ui/Button'
import { Step1_ContentInput } from './steps/Step1_ContentInput'
import { Step2_ContentPicker } from './steps/Step2_ContentPicker'
import { Step2_FormFields as Step3_FormFields } from './steps/Step2_FormFields'
import { Step3_Colors as Step4_Colors } from './steps/Step3_Colors'
import { Step4_PickVariant as Step5_PickVariant } from './steps/Step4_PickVariant'

const STEPS = [
  { label: 'תוכן',    description: 'טקסט, לוגו ותמונות' },
  { label: 'קריאטיב', description: 'בחר כותרות ושירותים' },
  { label: 'טופס',    description: 'שדות יצירת קשר' },
  { label: 'עיצוב',   description: 'סגנון ומראה' },
  { label: 'יוצר…',   description: 'AI מעצב את הדף' },
]

export default function BuilderPage() {
  const navigate = useNavigate()
  const {
    step, setStep, inputData, landingPageId, setLandingPageId,
    formFields, settings, selectedStyleIds, variantContents,
    setContentIdeas, setGeneratedVariants, setIsGenerating, reset,
  } = useBuilderStore()

  const [logo, setLogo]                     = useState<File | null>(null)
  const [images, setImages]                 = useState<File[]>([])
  const [referenceImage, setReferenceImage] = useState<File | null>(null)
  const [loading, setLoading]               = useState(false)
  const [error, setError]                   = useState('')

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
        fd.append('settings', JSON.stringify({
          ...settings,
          selected_style_ids: selectedStyleIds,
          variant_contents: variantContents,
        }))
        if (logo)           fd.append('logo', logo)
        if (referenceImage) fd.append('reference_page', referenceImage)
        images.forEach((img) => fd.append('images[]', img))

        const { data } = await landingPageService.create(fd)
        pageId = data.id
        setLandingPageId(pageId)
      } else {
        await landingPageService.update(pageId, {
          form_fields: formFields,
          settings: { ...settings, selected_style_ids: selectedStyleIds, variant_contents: variantContents },
        })
      }

      setIsGenerating(true)
      setStep(5)

      const { data: genData } = await landingPageService.generateVariants(pageId)
      setGeneratedVariants(genData.variants)

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
    if (step === 2) {
      const v0 = variantContents[0]
      const v1 = variantContents[1]
      return (
        v0.headline_line1.trim().length > 0 && v0.services.length === 4 &&
        v1.headline_line1.trim().length > 0 && v1.services.length === 4
      )
    }
    if (step === 3) return formFields.length > 0
    if (step === 4) return selectedStyleIds.length === 2
    return false
  }

  const handleNext = async () => {
    setError('')
    if (step === 1) {
      // Fetch content ideas before advancing to step 2
      setLoading(true)
      try {
        const { data } = await landingPageService.getContentIdeas({
          title: inputData.title,
          input_text: inputData.input_text || undefined,
          input_url: inputData.input_url || undefined,
        })
        setContentIdeas(data)
        setStep(2)
      } catch {
        setError('שגיאה בטעינת רעיונות תוכן. נסה שוב.')
      } finally {
        setLoading(false)
      }
    } else if (step === 4) {
      await createAndGenerate()
    } else {
      setStep(step + 1)
    }
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

        {step === 1 && <Step1_ContentInput logo={logo} images={images} referenceImage={referenceImage} setLogo={setLogo} setImages={setImages} setReferenceImage={setReferenceImage} />}
        {step === 2 && <Step2_ContentPicker />}
        {step === 3 && <Step3_FormFields />}
        {step === 4 && <Step4_Colors />}
        {step === 5 && <Step5_PickVariant />}
      </div>

      {error && <p className="text-red-500 text-sm mb-4 text-center">{error}</p>}

      {step < 5 && (
        <div className="flex items-center gap-3">
          {step > 1 && (
            <Button variant="secondary" onClick={() => setStep(step - 1)} disabled={loading}>
              <ChevronRight className="w-4 h-4" />
              הקודם
            </Button>
          )}
          <Button onClick={handleNext} loading={loading} disabled={!canAdvance()} className="flex-1" size="lg">
            {step === 4 ? (
              <><Sparkles className="w-4 h-4" /> צור דפי נחיתה עם AI</>
            ) : step === 1 ? (
              <>המשך לבחירת תוכן <ChevronLeft className="w-4 h-4" /></>
            ) : (
              <>הבא <ChevronLeft className="w-4 h-4" /></>
            )}
          </Button>
        </div>
      )}
    </div>
  )
}
