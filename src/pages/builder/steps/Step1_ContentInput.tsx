import { useRef } from 'react'
import { Upload, X, LayoutTemplate } from 'lucide-react'
import { useBuilderStore } from '../../../store/builderStore'
import { Input, Textarea } from '../../../components/ui/Input'

interface Props {
  logo: File | null
  images: File[]
  referenceImage: File | null
  setLogo: (f: File | null) => void
  setImages: (f: File[]) => void
  setReferenceImage: (f: File | null) => void
}

export function Step1_ContentInput({ logo, images, referenceImage, setLogo, setImages, setReferenceImage }: Props) {
  const { inputData, setInputData } = useBuilderStore()
  const logoRef   = useRef<HTMLInputElement>(null)
  const imgRef    = useRef<HTMLInputElement>(null)
  const refRef    = useRef<HTMLInputElement>(null)

  const addImages = (files: FileList | null) => {
    if (!files) return
    const arr = Array.from(files).slice(0, 5 - images.length)
    setImages([...images, ...arr])
  }

  return (
    <div className="flex flex-col gap-6">
      <Input
        label="שם / כותרת דף הנחיתה *"
        value={inputData.title}
        onChange={(e) => setInputData({ title: e.target.value })}
        placeholder="למשל: שיווק דיגיטלי לעסק שלך"
        required
      />
      <Textarea
        label="תיאור העסק / תוכן לדף"
        value={inputData.input_text}
        onChange={(e) => setInputData({ input_text: e.target.value })}
        placeholder="ספר על העסק שלך, שירותים, יתרונות... ה-AI ישתמש בזה לבנות את הדף"
        rows={4}
      />
      <Input
        label="כתובת אתר אינטרנט (אופציונלי)"
        type="url"
        value={inputData.input_url}
        onChange={(e) => setInputData({ input_url: e.target.value })}
        placeholder="https://www.your-site.com"
        dir="ltr"
      />

      <div className="grid grid-cols-2 gap-4">
        {/* Logo */}
        <div>
          <p className="text-sm text-slate-600 font-medium mb-2">לוגו</p>
          {logo ? (
            <div className="relative bg-slate-50 rounded-xl border border-slate-200 p-3 flex items-center gap-3">
              <img src={URL.createObjectURL(logo)} alt="logo" className="w-12 h-12 object-contain rounded" />
              <span className="text-xs text-slate-500 truncate flex-1">{logo.name}</span>
              <button onClick={() => setLogo(null)} className="text-slate-400 hover:text-red-500 transition-colors">
                <X className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <button
              onClick={() => logoRef.current?.click()}
              className="w-full border-2 border-dashed border-slate-200 hover:border-indigo-400 rounded-xl p-6 flex flex-col items-center gap-2 transition-colors text-slate-400 hover:text-indigo-600 bg-white"
            >
              <Upload className="w-6 h-6" />
              <span className="text-xs">העלה לוגו</span>
            </button>
          )}
          <input ref={logoRef} type="file" accept="image/*" className="hidden" onChange={(e) => setLogo(e.target.files?.[0] ?? null)} />
        </div>

        {/* Person images */}
        <div>
          <p className="text-sm text-slate-600 font-medium mb-2">תמונות ({images.length}/5)</p>
          <button
            onClick={() => imgRef.current?.click()}
            className="w-full border-2 border-dashed border-slate-200 hover:border-indigo-400 rounded-xl p-6 flex flex-col items-center gap-2 transition-colors text-slate-400 hover:text-indigo-600 bg-white"
            disabled={images.length >= 5}
          >
            <Upload className="w-6 h-6" />
            <span className="text-xs">הוסף תמונות</span>
          </button>
          <input ref={imgRef} type="file" accept="image/*" multiple className="hidden" onChange={(e) => addImages(e.target.files)} />
          {images.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-2">
              {images.map((img, i) => (
                <div key={i} className="relative">
                  <img src={URL.createObjectURL(img)} alt="" className="w-14 h-14 object-cover rounded-lg border border-slate-200" />
                  <button
                    onClick={() => setImages(images.filter((_, j) => j !== i))}
                    className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center shadow"
                  >
                    <X className="w-3 h-3 text-white" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Reference landing page */}
      <div>
        <p className="text-sm text-slate-600 font-medium mb-1">עמוד נחיתה לדוגמא (אופציונלי)</p>
        <p className="text-xs text-slate-400 mb-2">העלה צילום מסך של דף שאוהב — ה-AI ינסה ליצור עיצוב דומה בסגנון, צבעים ופונטים</p>

        {referenceImage ? (
          <div className="relative rounded-xl overflow-hidden border border-indigo-200 bg-indigo-50">
            <img
              src={URL.createObjectURL(referenceImage)}
              alt="reference"
              className="w-full h-40 object-cover object-top"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent flex items-end justify-between p-3">
              <div className="flex items-center gap-2">
                <LayoutTemplate className="w-4 h-4 text-white" />
                <span className="text-xs text-white font-medium truncate max-w-[200px]">{referenceImage.name}</span>
              </div>
              <button
                onClick={() => setReferenceImage(null)}
                className="w-7 h-7 bg-red-500 rounded-full flex items-center justify-center shadow"
              >
                <X className="w-4 h-4 text-white" />
              </button>
            </div>
          </div>
        ) : (
          <button
            onClick={() => refRef.current?.click()}
            className="w-full border-2 border-dashed border-slate-200 hover:border-indigo-400 rounded-xl p-6 flex flex-col items-center gap-2 transition-colors text-slate-400 hover:text-indigo-600 bg-white"
          >
            <LayoutTemplate className="w-6 h-6" />
            <span className="text-xs font-medium">העלה עמוד לדוגמא</span>
            <span className="text-xs">JPG, PNG, WebP</span>
          </button>
        )}
        <input ref={refRef} type="file" accept="image/*" className="hidden" onChange={(e) => setReferenceImage(e.target.files?.[0] ?? null)} />
      </div>
    </div>
  )
}
