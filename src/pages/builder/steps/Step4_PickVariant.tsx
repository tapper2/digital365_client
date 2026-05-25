import { useBuilderStore } from '../../../store/builderStore'

export function Step4_PickVariant() {
  const { isGenerating } = useBuilderStore()

  if (isGenerating) {
    return (
      <div className="flex flex-col items-center justify-center py-16 gap-4">
        <div className="w-12 h-12 border-2 border-amber-500 border-t-transparent rounded-full animate-spin" />
        <p className="text-slate-700 text-sm font-medium">ה-AI מייצר את הדפים השיווקיים...</p>
        <p className="text-slate-400 text-xs">כ-60–90 שניות — אנא אל תסגור את הדף</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center justify-center py-12 gap-3">
      <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center text-2xl">✓</div>
      <p className="text-slate-600 text-sm">הדפים נוצרו! מעביר לעורך...</p>
    </div>
  )
}
