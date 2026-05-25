import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowRight, ChevronDown, MessageSquarePlus, Send } from 'lucide-react'
import { leadService, type Lead } from '../../services/leadService'
import { landingPageService, type LandingPage } from '../../services/landingPageService'
import { Badge } from '../../components/ui/Badge'
import { Button } from '../../components/ui/Button'

const STATUS_OPTIONS = [
  { value: 'new',         label: 'חדש' },
  { value: 'in_progress', label: 'בטיפול' },
  { value: 'handled',     label: 'טופל' },
  { value: 'rejected',    label: 'נדחה' },
] as const

export default function LeadsPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [page, setPage]     = useState<LandingPage | null>(null)
  const [leads, setLeads]   = useState<Lead[]>([])
  const [loading, setLoading] = useState(true)
  const [expandedId, setExpandedId] = useState<number | null>(null)
  const [noteText, setNoteText]     = useState('')
  const [addingNote, setAddingNote] = useState(false)
  const [filterStatus, setFilterStatus] = useState<string>('all')

  useEffect(() => {
    if (!id) return
    Promise.all([
      landingPageService.get(Number(id)),
      leadService.list(Number(id)),
    ]).then(([pageRes, leadsRes]) => {
      setPage(pageRes.data)
      setLeads(leadsRes.data.data)
      setLoading(false)
    })
  }, [id])

  const handleStatus = async (lead: Lead, status: Lead['status']) => {
    const updated = await leadService.updateStatus(lead.id, status)
    setLeads((prev) => prev.map((l) => l.id === lead.id ? { ...l, status: updated.data.status } : l))
  }

  const handleAddNote = async (leadId: number) => {
    if (!noteText.trim()) return
    setAddingNote(true)
    const { data } = await leadService.addNote(leadId, noteText)
    setLeads((prev) => prev.map((l) =>
      l.id === leadId ? { ...l, notes: [data, ...(l.notes ?? [])] } : l
    ))
    setNoteText('')
    setAddingNote(false)
  }

  const fetchLeadNotes = async (lead: Lead) => {
    if (expandedId === lead.id) { setExpandedId(null); return }
    if (!lead.notes) {
      const { data } = await leadService.get(lead.id)
      setLeads((prev) => prev.map((l) => l.id === lead.id ? { ...l, notes: data.notes } : l))
    }
    setExpandedId(lead.id)
  }

  const filtered = filterStatus === 'all' ? leads : leads.filter((l) => l.status === filterStatus)

  if (loading) return <div className="flex items-center justify-center h-64"><div className="w-8 h-8 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin" /></div>

  return (
    <div className="max-w-4xl mx-auto px-6 py-8">
      <div className="flex items-center gap-3 mb-6">
        <button onClick={() => navigate('/dashboard')} className="text-slate-400 hover:text-slate-700 transition-colors">
          <ArrowRight className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-xl font-bold text-slate-900">לידים — {page?.title}</h1>
          <p className="text-slate-500 text-sm">{leads.length} סה"כ</p>
        </div>
      </div>

      {/* Filter */}
      <div className="flex gap-2 mb-6">
        {[{ value: 'all', label: 'הכל' }, ...STATUS_OPTIONS].map((s) => (
          <button key={s.value} onClick={() => setFilterStatus(s.value)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors border ${
              filterStatus === s.value
                ? 'bg-indigo-600 text-white border-indigo-600'
                : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300 hover:bg-slate-50'
            }`}>
            {s.label}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <p className="text-center text-slate-400 py-16">אין לידים להצגה</p>
      ) : (
        <div className="flex flex-col gap-3">
          {filtered.map((lead) => (
            <div key={lead.id} className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
              <div className="p-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 grid grid-cols-2 gap-x-6 gap-y-1">
                    {Object.entries(lead.data).map(([k, v]) => (
                      <div key={k}>
                        <span className="text-xs text-slate-400 capitalize">{k}: </span>
                        <span className="text-sm text-slate-800">{v}</span>
                      </div>
                    ))}
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <select
                      value={lead.status}
                      onChange={(e) => handleStatus(lead, e.target.value as Lead['status'])}
                      className="text-xs bg-white border border-slate-200 rounded-lg px-2 py-1.5 text-slate-700 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    >
                      {STATUS_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
                    </select>
                    <Badge variant={lead.status} />
                  </div>
                </div>

                <div className="flex items-center justify-between mt-3 pt-3 border-t border-slate-100">
                  <span className="text-xs text-slate-400">{new Date(lead.created_at).toLocaleString('he-IL')}</span>
                  <button
                    onClick={() => fetchLeadNotes(lead)}
                    className="flex items-center gap-1 text-xs text-slate-500 hover:text-indigo-600 transition-colors"
                  >
                    <MessageSquarePlus className="w-3.5 h-3.5" />
                    {lead.notes?.length ?? 0} הערות
                    <ChevronDown className={`w-3 h-3 transition-transform ${expandedId === lead.id ? 'rotate-180' : ''}`} />
                  </button>
                </div>
              </div>

              {expandedId === lead.id && (
                <div className="border-t border-slate-100 bg-slate-50 p-4">
                  <div className="flex gap-2 mb-3">
                    <input
                      value={noteText}
                      onChange={(e) => setNoteText(e.target.value)}
                      placeholder="הוסף הערה..."
                      className="flex-1 bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    />
                    <Button size="sm" onClick={() => handleAddNote(lead.id)} loading={addingNote} disabled={!noteText.trim()}>
                      <Send className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                  {(lead.notes ?? []).length > 0 ? (
                    <div className="flex flex-col gap-2">
                      {(lead.notes ?? []).map((note) => (
                        <div key={note.id} className="bg-white rounded-xl px-3 py-2 border border-slate-100">
                          <p className="text-sm text-slate-700">{note.content}</p>
                          <p className="text-xs text-slate-400 mt-1">{note.user.name} · {new Date(note.created_at).toLocaleString('he-IL')}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-slate-400 text-center py-2">אין הערות עדיין</p>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
