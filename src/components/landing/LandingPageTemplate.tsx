import type { LandingPage } from '../../services/landingPageService'

interface Props {
  page: Pick<LandingPage, 'title' | 'input_text' | 'settings' | 'token' | 'form_fields'>
  heroImageUrl?: string | null
  logoUrl?: string | null
  previewMode?: boolean
}

const FIXED_FIELDS = ['name', 'phone', 'email', 'business_type', 'notes']
const FIELD_LABELS: Record<string, string> = {
  name: 'שם מלא',
  phone: 'טלפון',
  email: 'אימייל',
  business_type: 'תחום עיסוק',
  notes: 'פרטים נוספים',
}

interface ContactItem {
  key: string
  icon: (p: { size?: number }) => JSX.Element
  shortLabel: string
  value?: string
  href: (v: string) => string
  target: string
}

export function LandingPageTemplate({ page, heroImageUrl, logoUrl, previewMode = false }: Props) {
  const s = page.settings ?? {}
  const accent = s.accent_color ?? '#B8952A'
  const bg = s.bg_color ?? '#0d1117'

  const contacts: ContactItem[] = [
    { key: 'phone', icon: PhoneIcon, shortLabel: 'חייגו', value: s.phone, href: (v) => `tel:${v}`, target: '_self' },
    { key: 'whatsapp', icon: WhatsAppIcon, shortLabel: 'וואטסאפ', value: s.whatsapp, href: (v) => `https://wa.me/${v.replace(/\D/g, '')}`, target: '_blank' },
    { key: 'instagram', icon: InstagramIcon, shortLabel: 'אינסטגרם', value: s.instagram_url, href: (v) => v, target: '_blank' },
    { key: 'facebook', icon: FacebookIcon, shortLabel: 'פייסבוק', value: s.facebook_url, href: (v) => v, target: '_blank' },
    { key: 'email', icon: EmailIcon, shortLabel: 'אימייל', value: s.email_contact, href: (v) => `mailto:${v}`, target: '_self' },
  ]
  const activeContacts = contacts.filter((c) => c.value)

  const inputStyle: React.CSSProperties = {
    width: '100%',
    background: 'transparent',
    color: '#fff',
    fontSize: 14,
    fontFamily: "'Heebo', Arial, sans-serif",
    padding: '10px 16px',
    outline: 'none',
    border: '1px solid rgba(255,255,255,0.12)',
    borderBottom: `2px solid ${accent}4d`,
    borderRadius: 6,
  }

  return (
    <div
      dir="rtl"
      className="select-none"
      style={{
        fontFamily: "'Heebo', Arial, sans-serif",
        background: bg,
        display: 'flex',
        minHeight: 770,
      }}
    >
      {/* ── hero image (75%) ── */}
      <div style={{ flex: '0 0 75%', overflow: 'hidden', position: 'relative', minHeight: 0 }}>
        {heroImageUrl ? (
          <img
            src={heroImageUrl}
            alt="hero"
            style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'top center', display: 'block' }}
          />
        ) : (
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)' }} />
        )}
      </div>

      {/* ── form panel (25%) ── */}
      <div
        style={{
          flex: '0 0 25%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          padding: '32px 24px',
          background: '#111827',
          borderRight: `3px solid ${accent}`,
          overflowY: 'auto',
          minHeight: 0,
        }}
      >
        {/* Logo */}
        {logoUrl && (
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 20 }}>
            <img src={logoUrl} alt="logo" style={{ width: '100%', height: 64, objectFit: 'contain', display: 'block' }} />
          </div>
        )}

        {/* Header */}
        <div style={{ marginBottom: 24, textAlign: 'center' }}>
          <h2 style={{ fontSize: 18, fontWeight: 700, color: '#fff', marginBottom: 4 }}>לקבלת ייעוץ מקצועי</h2>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, margin: '8px 0' }}>
            <div style={{ height: 1, flex: 1, background: accent, opacity: 0.4 }} />
            <span style={{ color: accent, fontSize: 10 }}>◆</span>
          </div>
          <p style={{ fontSize: 13, color: '#9ca3af' }}>השאירו פרטים ונחזור אליכם</p>
        </div>

        {/* Form */}
        <form
          action={previewMode ? '#' : `/api/submit/${page.token}`}
          method="POST"
          onSubmit={previewMode ? (e) => e.preventDefault() : undefined}
          style={{ display: 'flex', flexDirection: 'column', gap: 10 }}
        >
          {FIXED_FIELDS.map((field) =>
            field === 'notes' ? (
              <textarea
                key={field}
                name={field}
                placeholder={FIELD_LABELS[field]}
                rows={3}
                style={{ ...inputStyle, resize: 'none', borderBottom: `2px solid ${accent}33` }}
              />
            ) : (
              <input
                key={field}
                type={field === 'email' ? 'email' : field === 'phone' ? 'tel' : 'text'}
                name={field}
                placeholder={FIELD_LABELS[field]}
                style={field === 'phone' ? { ...inputStyle, textAlign: 'right', direction: 'rtl' } : inputStyle}
              />
            )
          )}

          <button
            type="submit"
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
              padding: '11px',
              marginTop: 4,
              fontFamily: "'Heebo', Arial, sans-serif",
              fontWeight: 700,
              fontSize: 14,
              color: '#fff',
              background: accent,
              border: 'none',
              borderRadius: 6,
              cursor: 'pointer',
            }}
          >
            שלחו פרטים ‹
          </button>
        </form>

        {/* Privacy note */}
        <p style={{ fontSize: 11, color: '#6b7280', textAlign: 'center', marginTop: 10 }}>
          🔒 הפרטים שלכם בטוחים ומאובטחים
        </p>

        {/* ── Contact icons — always shown, dimmed if no value ── */}
        <div style={{ marginTop: 20, paddingTop: 18, borderTop: '1px solid rgba(255,255,255,0.08)' }}>
          <p style={{ fontSize: 11, color: '#4b5563', textAlign: 'center', letterSpacing: '0.07em', textTransform: 'uppercase', marginBottom: 14 }}>
            צור קשר
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: 14, flexWrap: 'wrap' }}>
            {contacts.map(({ key, icon: Icon, shortLabel, value, href, target }) => {
              const hasValue = Boolean(value)
              return (
                <a
                  key={key}
                  href={hasValue && !previewMode ? href(value!) : '#'}
                  target={hasValue && !previewMode ? target : undefined}
                  rel="noreferrer"
                  style={{
                    display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 5,
                    textDecoration: 'none', color: 'inherit',
                    cursor: hasValue ? 'pointer' : 'default',
                    opacity: hasValue ? 1 : 0.3,
                  }}
                  onClick={!hasValue || previewMode ? (e) => e.preventDefault() : undefined}
                >
                  <div
                    style={{
                      width: 40, height: 40, borderRadius: '50%',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      border: `1.5px solid ${accent}80`,
                      color: accent,
                      background: `${accent}15`,
                    }}
                  >
                    <Icon size={17} />
                  </div>
                  <span style={{ fontSize: 10, color: '#6b7280', whiteSpace: 'nowrap' }}>{shortLabel}</span>
                </a>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}

/* ── SVG Icons ── */

function PhoneIcon({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 13a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.61 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 9.91a16 16 0 0 0 6.09 6.09l.91-.91a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
    </svg>
  )
}

function WhatsAppIcon({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z" />
    </svg>
  )
}

function InstagramIcon({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
    </svg>
  )
}

function FacebookIcon({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
  )
}

function EmailIcon({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
      <polyline points="22,6 12,13 2,6" />
    </svg>
  )
}
