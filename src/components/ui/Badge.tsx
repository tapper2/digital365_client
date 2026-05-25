import { clsx } from 'clsx'

type BadgeVariant = 'new' | 'in_progress' | 'handled' | 'rejected' | 'draft' | 'published' | 'archived'

const variants: Record<BadgeVariant, string> = {
  new:         'bg-blue-50 text-blue-700 border-blue-200',
  in_progress: 'bg-amber-50 text-amber-700 border-amber-200',
  handled:     'bg-emerald-50 text-emerald-700 border-emerald-200',
  rejected:    'bg-red-50 text-red-700 border-red-200',
  draft:       'bg-slate-100 text-slate-600 border-slate-200',
  published:   'bg-emerald-50 text-emerald-700 border-emerald-200',
  archived:    'bg-orange-50 text-orange-700 border-orange-200',
}

const labels: Record<BadgeVariant, string> = {
  new: 'חדש', in_progress: 'בטיפול', handled: 'טופל',
  rejected: 'נדחה', draft: 'טיוטה', published: 'פורסם', archived: 'ארכיון',
}

export function Badge({ variant }: { variant: BadgeVariant }) {
  return (
    <span className={clsx('px-2.5 py-0.5 text-xs font-medium rounded-full border', variants[variant])}>
      {labels[variant]}
    </span>
  )
}
