import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Globe, ArrowRight, Check } from 'lucide-react'
import { clsx } from 'clsx'
import { landingPageService, type LandingPageVariant } from '../../services/landingPageService'
import { useEditorStore } from '../../store/editorStore'
import { LandingPageTemplate } from '../../components/landing/LandingPageTemplate'
import { Button } from '../../components/ui/Button'

const COLOR_PRESETS = [
  { label: 'זהב & שחור',  bg_color: '#0d1117', text_color: '#ffffff', accent_color: '#B8952A', button_color: '#B8952A' },
  { label: 'כחול & שחור', bg_color: '#0a0f1e', text_color: '#ffffff', accent_color: '#2563EB', button_color: '#2563EB' },
  { label: 'ירוק & שחור', bg_color: '#071210', text_color: '#ffffff', accent_color: '#059669', button_color: '#059669' },
  { label: 'סגול & שחור', bg_color: '#0d0814', text_color: '#ffffff', accent_color: '#7C3AED', button_color: '#7C3AED' },
]

export default function EditorPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()

  const { page, heroImageUrl, logoUrl, variantId, setPage, setHeroImageUrl, setLogoUrl, setVariantId, reset } = useEditorStore()

  const [publishing, setPublishing]       = useState(false)
  const [publicUrl, setPublicUrl]         = useState('')
  const [loading, setLoading]             = useState(true)
  const [localSettings, setLocalSettings] = useState<Record<string, string>>({})
  const [savingSettings, setSavingSettings] = useState(false)
  const [switchingVariant, setSwitchingVariant] = useState(false)

  useEffect(() => {
    if (!id) return
    reset()
    landingPageService.get(Number(id)).then(({ data }) => {
      setPage(data)
      setLocalSettings(data.settings ?? {})

      if (data.selected_variant) {
        setVariantId(data.selected_variant.id)
        setHeroImageUrl(data.selected_variant.image_url ?? null)
      }

      const logoAsset = data.assets?.find((a) => a.type === 'logo')
      if (logoAsset) setLogoUrl(logoAsset.url ?? null)

      if (data.status === 'published') setPublicUrl(`/p/${data.token}`)
      setLoading(false)
    })
  }, [id])

  const mergedPage = page ? { ...page, settings: { ...page.settings, ...localSettings } } : null

  const handleSettingChange = (key: string, value: string) => {
    setLocalSettings((prev) => ({ ...prev, [key]: value }))
  }

  const handleSaveSettings = async () => {
    if (!id || !page) return
    setSavingSettings(true)
    try {
      const { data } = await landingPageService.update(Number(id), { settings: { ...page.settings, ...localSettings } })
      setPage(data)
    } finally {
      setSavingSettings(false)
    }
  }

  const handleSwitchVariant = async (variant: LandingPageVariant) => {
    if (switchingVariant || variant.id === variantId) return
    setSwitchingVariant(true)
    setVariantId(variant.id)
    setHeroImageUrl(variant.image_url ?? null)
    if (page) setPage({ ...page, selected_variant_id: variant.id })
    await landingPageService.selectVariant(Number(id!), variant.id)
    setSwitchingVariant(false)
  }

  const handlePublish = async () => {
    setPublishing(true)
    try {
      const { data } = await landingPageService.publish(Number(id!))
      setPublicUrl(data.public_url)
    } catch {}
    finally { setPublishing(false) }
  }

  if (loading) {
    return <div className="flex items-center justify-center h-64"><div className="w-8 h-8 border-2 border-amber-500 border-t-transparent rounded-full animate-spin" /></div>
  }

  if (!mergedPage) return null

  return (
    <div className="flex h-[calc(100vh-64px)]">

      {/* Settings panel — right side */}
      <div className="w-80 border-l border-slate-200 flex flex-col bg-white overflow-y-auto">
        <div className="px-4 py-3 border-b border-slate-200 bg-slate-50 sticky top-0 z-10">
          <h3 className="text-sm font-semibold text-slate-900">עריכת הדף</h3>
          <p className="text-xs text-slate-500 mt-0.5">שנה צבעים ופרטים</p>
        </div>

        <div className="flex-1 p-4 flex flex-col gap-5">

          {/* Variant switcher */}
          {page?.variants && page.variants.length > 1 && (
            <div>
              <p className="text-xs font-semibold text-slate-600 mb-2">וריאנטים — לחץ להחלפה</p>
              <div className="grid grid-cols-2 gap-2">
                {page.variants.map((v) => {
                  const isActive = variantId === v.id
                  return (
                    <button
                      key={v.id}
                      onClick={() => handleSwitchVariant(v)}
                      disabled={switchingVariant}
                      className={clsx(
                        'rounded-xl overflow-hidden border-2 transition-all text-left relative',
                        isActive
                          ? 'border-amber-500 shadow-md shadow-amber-100'
                          : 'border-slate-200 hover:border-amber-300 opacity-70 hover:opacity-100'
                      )}
                    >
                      {v.image_url ? (
                        <img src={v.image_url} alt={`וריאנט ${v.variant_index}`} className="w-full h-20 object-cover object-top" />
                      ) : (
                        <div className="w-full h-20 bg-slate-100 flex items-center justify-center text-slate-400 text-xs">
                          אין תמונה
                        </div>
                      )}
                      <div className="bg-white px-2 py-1 text-xs text-slate-500 flex items-center justify-between">
                        <span>וריאנט {v.variant_index}</span>
                        {isActive && <Check className="w-3 h-3 text-amber-500" />}
                      </div>
                    </button>
                  )
                })}
              </div>
            </div>
          )}

          {/* Color presets */}
          <div>
            <p className="text-xs font-semibold text-slate-600 mb-2">ערכת צבעים</p>
            <div className="grid grid-cols-2 gap-2">
              {COLOR_PRESETS.map((preset) => (
                <button
                  key={preset.label}
                  onClick={() => setLocalSettings((prev) => ({ ...prev, ...preset }))}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg border border-slate-200 hover:border-indigo-300 text-xs bg-white transition-all"
                >
                  <div className="flex gap-1">
                    <div className="w-4 h-4 rounded-full border border-slate-200" style={{ background: preset.bg_color }} />
                    <div className="w-4 h-4 rounded-full border border-slate-200" style={{ background: preset.accent_color }} />
                  </div>
                  {preset.label}
                </button>
              ))}
            </div>
          </div>

          {/* Accent color picker */}
          <div>
            <p className="text-xs font-semibold text-slate-600 mb-2">צבע Accent</p>
            <div className="flex items-center gap-3 bg-white border border-slate-200 rounded-xl px-3 py-2">
              <input
                type="color"
                value={localSettings.accent_color ?? '#B8952A'}
                onChange={(e) => handleSettingChange('accent_color', e.target.value)}
                className="w-8 h-8 rounded cursor-pointer border-0 bg-transparent"
              />
              <span className="text-xs text-slate-500 font-mono">{localSettings.accent_color}</span>
            </div>
          </div>

          {/* Contact info */}
          <div>
            <p className="text-xs font-semibold text-slate-600 mb-2">פרטי יצירת קשר</p>
            {[
              { key: 'phone',         label: 'טלפון' },
              { key: 'whatsapp',      label: 'WhatsApp' },
              { key: 'email_contact', label: 'אימייל' },
              { key: 'facebook_url',  label: 'Facebook URL' },
              { key: 'instagram_url', label: 'Instagram URL' },
            ].map(({ key, label }) => (
              <div key={key} className="mb-2">
                <label className="text-xs text-slate-400 block mb-1">{label}</label>
                <input
                  type="text"
                  value={(localSettings as any)[key] ?? ''}
                  onChange={(e) => handleSettingChange(key, e.target.value)}
                  className="w-full border border-slate-200 rounded-lg px-3 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-indigo-400"
                />
              </div>
            ))}
          </div>

          <Button onClick={handleSaveSettings} loading={savingSettings} size="sm" className="w-full">
            שמור שינויים
          </Button>
        </div>
      </div>

      {/* Preview — left side */}
      <div className="flex-1 bg-slate-100 flex flex-col min-w-0">
        <div className="flex items-center justify-between px-4 py-2 border-b border-slate-200 bg-white flex-shrink-0">
          <div className="flex items-center gap-2">
            <button onClick={() => navigate('/dashboard')} className="text-slate-400 hover:text-slate-700 transition-colors">
              <ArrowRight className="w-4 h-4" />
            </button>
            <span className="text-sm text-slate-500">תצוגה מקדימה</span>
          </div>
          <div className="flex items-center gap-2">
            {publicUrl && (
              <a href={publicUrl} target="_blank" rel="noreferrer"
                className="text-xs text-emerald-700 hover:text-emerald-800 flex items-center gap-1 px-3 py-1.5 bg-emerald-50 rounded-lg border border-emerald-200">
                <Globe className="w-3 h-3" /> צפה בדף הפעיל
              </a>
            )}
            <Button onClick={handlePublish} loading={publishing} size="sm">
              <Globe className="w-3 h-3" />
              {publicUrl ? 'פרסם מחדש' : 'פרסם'}
            </Button>
          </div>
        </div>

        <div className="flex-1 overflow-auto p-4">
          <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-slate-200">
            <LandingPageTemplate
              page={mergedPage}
              heroImageUrl={heroImageUrl}
              logoUrl={logoUrl}
              previewMode={true}
            />
          </div>
        </div>

        {publicUrl && (
          <div className="px-4 py-2 bg-emerald-50 border-t border-emerald-200 flex-shrink-0">
            <p className="text-xs text-emerald-700">
              קישור ציבורי:{' '}
              <a href={publicUrl} target="_blank" rel="noreferrer" className="underline font-mono">
                {window.location.origin}{publicUrl}
              </a>
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
