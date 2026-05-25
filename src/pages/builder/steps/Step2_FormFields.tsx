import { Check } from 'lucide-react'
import { useBuilderStore } from '../../../store/builderStore'
import { clsx } from 'clsx'

const ALL_FIELDS = [
  { id: 'name',    label: 'שם מלא' },
  { id: 'email',   label: 'אימייל' },
  { id: 'phone',   label: 'טלפון' },
  { id: 'message', label: 'הודעה' },
  { id: 'company', label: 'חברה' },
  { id: 'city',    label: 'עיר' },
  { id: 'address', label: 'כתובת' },
  { id: 'subject', label: 'נושא' },
]

export function Step2_FormFields() {
  const { formFields, setFormFields } = useBuilderStore()

  const toggle = (id: string) => {
    setFormFields(
      formFields.includes(id)
        ? formFields.filter((f) => f !== id)
        : [...formFields, id]
    )
  }

  return (
    <div>
      <p className="text-slate-500 text-sm mb-4">בחר אילו שדות יופיעו בטופס יצירת הקשר בדף הנחיתה</p>
      <div className="grid grid-cols-2 gap-3">
        {ALL_FIELDS.map((field) => {
          const selected = formFields.includes(field.id)
          return (
            <button
              key={field.id}
              onClick={() => toggle(field.id)}
              className={clsx(
                'flex items-center gap-3 px-4 py-3 rounded-xl border transition-all duration-150 text-sm font-medium',
                selected
                  ? 'bg-indigo-50 border-indigo-400 text-indigo-700'
                  : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-50'
              )}
            >
              <div className={clsx(
                'w-5 h-5 rounded-md border flex items-center justify-center flex-shrink-0',
                selected ? 'bg-indigo-600 border-indigo-600' : 'border-slate-300 bg-white'
              )}>
                {selected && <Check className="w-3 h-3 text-white" />}
              </div>
              {field.label}
            </button>
          )
        })}
      </div>
      <p className="text-xs text-slate-400 mt-4">נבחרו: {formFields.length} שדות</p>
    </div>
  )
}
