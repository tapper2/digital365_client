import { useEffect, useState } from 'react'
import { Check } from 'lucide-react'
import { useBuilderStore } from '../../../store/builderStore'
import { landingPageService, type LandingPageStyle } from '../../../services/landingPageService'

const COLOR_PRESETS = [
  { label: 'זהב & שחור',   bg_color: '#0d1117', text_color: '#ffffff', accent_color: '#B8952A', button_color: '#B8952A' },
  { label: 'כחול & שחור',  bg_color: '#0a0f1e', text_color: '#ffffff', accent_color: '#2563EB', button_color: '#2563EB' },
  { label: 'ירוק & שחור',  bg_color: '#071210', text_color: '#ffffff', accent_color: '#059669', button_color: '#059669' },
  { label: 'סגול & שחור',  bg_color: '#0d0814', text_color: '#ffffff', accent_color: '#7C3AED', button_color: '#7C3AED' },
]

const CONTACT_FIELDS = [
  { key: 'phone',         label: 'טלפון', placeholder: '054-1234567' },
  { key: 'whatsapp',      label: 'WhatsApp', placeholder: '054-1234567' },
  { key: 'email_contact', label: 'כתובת מייל', placeholder: 'info@mybusiness.co.il' },
  { key: 'facebook_url',  label: 'Facebook URL', placeholder: 'https://facebook.com/mybusiness' },
  { key: 'instagram_url', label: 'Instagram URL', placeholder: 'https://instagram.com/mybusiness' },
] as const

export function Step3_Colors() {
  const { settings, setSettings, selectedStyleIds, toggleStyleId } = useBuilderStore()
  const [styles, setStyles]   = useState<LandingPageStyle[]>([])
  const [loadingStyles, setLoadingStyles] = useState(true)

  useEffect(() => {
    landingPageService.getStyles()
      .then(({ data }) => setStyles(data))
      .finally(() => setLoadingStyles(false))
  }, [])

  return (
    <div className="flex flex-col gap-6">

      {/* ── Style picker ─────────────────────────────────── */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <p className="text-sm text-slate-600 font-medium">בחר 2 סגנונות לדף שלך</p>
          <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
            selectedStyleIds.length === 2
              ? 'bg-green-100 text-green-700'
              : 'bg-amber-50 text-amber-600'
          }`}>
            {selectedStyleIds.length}/2 נבחרו
          </span>
        </div>

        {loadingStyles ? (
          <div className="flex justify-center py-6">
            <div className="w-6 h-6 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-2">
            {styles.map((style) => {
              const isSelected = selectedStyleIds.includes(style.id)
              const isDisabled = !isSelected && selectedStyleIds.length >= 2
              return (
                <button
                  key={style.id}
                  onClick={() => toggleStyleId(style.id)}
                  disabled={isDisabled}
                  className={`relative text-right rounded-xl border-2 p-2.5 transition-all ${
                    isSelected
                      ? 'border-indigo-500 bg-indigo-50 shadow-sm'
                      : isDisabled
                        ? 'border-slate-100 bg-slate-50 opacity-40 cursor-not-allowed'
                        : 'border-slate-200 bg-white hover:border-indigo-300 hover:bg-indigo-50/40'
                  }`}
                >
                  {isSelected && (
                    <span className="absolute top-1.5 left-1.5 w-4 h-4 bg-indigo-500 rounded-full flex items-center justify-center">
                      <Check className="w-2.5 h-2.5 text-white" />
                    </span>
                  )}
                  <p className="text-xs font-bold text-slate-800 leading-tight">{style.name_he}</p>
                  <p className="text-[10px] text-slate-400 mt-0.5 leading-tight">{style.name_en}</p>
                  {style.tags_he && (
                    <p className="text-[9px] text-slate-400 mt-1 leading-tight line-clamp-2">{style.tags_he}</p>
                  )}
                  {style.suitable_for_he && (
                    <p className="text-[9px] text-indigo-500 mt-1 leading-tight line-clamp-1">{style.suitable_for_he}</p>
                  )}
                </button>
              )
            })}
          </div>
        )}

        {selectedStyleIds.length === 2 && (
          <p className="text-xs text-slate-400 mt-2 text-center">
            כדי לבחור סגנון אחר — בטל את הבחירה של אחד מהנבחרים
          </p>
        )}
      </div>

      {/* ── Color presets ─────────────────────────────────── */}
      <div>
        <p className="text-sm text-slate-600 font-medium mb-3">ערכת צבעים</p>
        <div className="grid grid-cols-2 gap-3">
          {COLOR_PRESETS.map((preset) => (
            <button
              key={preset.label}
              onClick={() => setSettings(preset)}
              className="flex items-center gap-3 px-4 py-3 rounded-xl border border-slate-200 hover:border-indigo-400 hover:bg-indigo-50 transition-all bg-white"
            >
              <div className="flex gap-1.5">
                <div className="w-5 h-5 rounded-full border border-slate-300" style={{ background: preset.bg_color }} />
                <div className="w-5 h-5 rounded-full border border-slate-300" style={{ background: preset.accent_color }} />
              </div>
              <span className="text-sm text-slate-700">{preset.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* ── Custom accent ─────────────────────────────────── */}
      <div>
        <label className="text-sm text-slate-600 font-medium block mb-2">צבע Accent מותאם אישית</label>
        <div className="flex items-center gap-3 bg-white border border-slate-200 rounded-xl px-3 py-2 w-fit">
          <input
            type="color"
            value={settings.accent_color ?? '#B8952A'}
            onChange={(e) => setSettings({ accent_color: e.target.value, button_color: e.target.value })}
            className="w-8 h-8 rounded cursor-pointer border-0 bg-transparent"
          />
          <span className="text-sm text-slate-500 font-mono">{settings.accent_color}</span>
        </div>
      </div>

      {/* ── Contact / social ──────────────────────────────── */}
      <div>
        <p className="text-sm text-slate-600 font-medium mb-3">פרטי יצירת קשר (לפס האייקונים)</p>
        <div className="flex flex-col gap-3">
          {CONTACT_FIELDS.map(({ key, label, placeholder }) => (
            <div key={key}>
              <label className="text-xs text-slate-500 block mb-1">{label}</label>
              <input
                type="text"
                value={(settings as any)[key] ?? ''}
                onChange={(e) => setSettings({ [key]: e.target.value })}
                placeholder={placeholder}
                className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
