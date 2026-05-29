import { useState } from 'react'
import { Check } from 'lucide-react'
import { clsx } from 'clsx'
import { useBuilderStore } from '../../../store/builderStore'
import type { VariantContent } from '../../../services/landingPageService'

const FIELDS: Array<{
  key: keyof Omit<VariantContent, 'services'>
  label: string
  hint: string
  ideasKey: 'headline_line1' | 'headline_line2' | 'headline_line3' | 'trust_badge' | 'subtext' | 'cta'
}> = [
  { key: 'headline_line1', label: 'כותרת 1 — שם/תחום',       hint: '2–4 מילים',    ideasKey: 'headline_line1' },
  { key: 'headline_line2', label: 'כותרת 2 — Hook רגשי',     hint: '3–5 מילים',    ideasKey: 'headline_line2' },
  { key: 'headline_line3', label: 'כותרת 3 — משפט המרה',     hint: '3–6 מילים',    ideasKey: 'headline_line3' },
  { key: 'trust_badge',    label: 'Trust Badge — אמינות',    hint: '4–8 מילים',    ideasKey: 'trust_badge'    },
  { key: 'subtext',        label: 'טקסט משנה',                hint: 'משפט אחד',     ideasKey: 'subtext'        },
  { key: 'cta',            label: 'כפתור קריאה לפעולה',      hint: '2–3 מילים',    ideasKey: 'cta'            },
]

export function Step2_ContentPicker() {
  const {
    contentIdeas,
    variantContents,
    setVariantField,
    toggleVariantService,
  } = useBuilderStore()

  const [activeVariant, setActiveVariant] = useState<0 | 1>(0)

  if (!contentIdeas) {
    return (
      <div className="flex items-center justify-center py-12 text-slate-400 text-sm">
        טוען רעיונות...
      </div>
    )
  }

  const vc = variantContents[activeVariant]
  const selectedServices = vc.services

  const isVariantReady = (idx: 0 | 1) =>
    variantContents[idx].headline_line1.trim().length > 0 &&
    variantContents[idx].services.length === 4

  return (
    <div dir="rtl">
      {/* Variant tabs */}
      <div className="flex gap-2 mb-6">
        {([0, 1] as const).map((i) => (
          <button
            key={i}
            onClick={() => setActiveVariant(i)}
            className={clsx(
              'flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all',
              activeVariant === i
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            )}
          >
            וריאנט {i + 1}
            {isVariantReady(i) && (
              <span className="w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
                <Check className="w-2.5 h-2.5 text-white" />
              </span>
            )}
          </button>
        ))}
        <p className="mr-auto text-xs text-slate-400 self-center">
          כל וריאנט יקבל עיצוב ותמונה שונה
        </p>
      </div>

      {/* Text fields */}
      <div className="space-y-5">
        {FIELDS.map(({ key, label, hint, ideasKey }) => {
          const ideas = contentIdeas[ideasKey] as string[]
          return (
            <div key={key}>
              <div className="flex items-baseline gap-2 mb-1.5">
                <label className="text-sm font-medium text-slate-700">{label}</label>
                <span className="text-xs text-slate-400">({hint})</span>
              </div>
              <input
                type="text"
                value={vc[key] as string}
                onChange={(e) => setVariantField(activeVariant, key, e.target.value)}
                placeholder="לחץ על אחת מהאפשרויות למטה, או הקלד ידנית"
                className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm text-right mb-2 focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-indigo-400"
              />
              <div className="flex flex-wrap gap-1.5">
                {ideas.map((idea, i) => (
                  <button
                    key={i}
                    onClick={() => setVariantField(activeVariant, key, idea)}
                    className={clsx(
                      'px-3 py-1 text-xs rounded-full border transition-colors text-right',
                      vc[key] === idea
                        ? 'bg-indigo-50 border-indigo-400 text-indigo-700 font-medium'
                        : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-indigo-50 hover:border-indigo-300 hover:text-indigo-700'
                    )}
                  >
                    {idea}
                  </button>
                ))}
              </div>
            </div>
          )
        })}
      </div>

      {/* Services section */}
      <div className="mt-6">
        <div className="flex items-baseline gap-2 mb-1.5">
          <label className="text-sm font-medium text-slate-700">שירותים</label>
          <span className="text-xs text-slate-400">(בחר בדיוק 4)</span>
          <span className={clsx(
            'text-xs font-bold',
            selectedServices.length === 4 ? 'text-green-600' : 'text-orange-500'
          )}>
            {selectedServices.length}/4
          </span>
        </div>
        <div className="grid grid-cols-2 gap-2">
          {contentIdeas.services.map((service, i) => {
            const selected = selectedServices.some((s) => s.label === service.label)
            const disabled = !selected && selectedServices.length >= 4
            return (
              <button
                key={i}
                onClick={() => toggleVariantService(activeVariant, service)}
                disabled={disabled}
                className={clsx(
                  'flex items-center gap-2.5 px-3 py-2.5 rounded-xl border text-sm transition-all text-right',
                  selected
                    ? 'bg-indigo-50 border-indigo-400 text-indigo-700 font-medium'
                    : disabled
                      ? 'bg-white border-slate-100 text-slate-300 cursor-not-allowed'
                      : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-50'
                )}
              >
                <div className={clsx(
                  'w-5 h-5 rounded-md border flex items-center justify-center flex-shrink-0',
                  selected ? 'bg-indigo-600 border-indigo-600' : 'border-slate-300 bg-white'
                )}>
                  {selected && <Check className="w-3 h-3 text-white" />}
                </div>
                <span className="text-base leading-none">{service.icon}</span>
                <span className="flex-1">{service.label}</span>
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
