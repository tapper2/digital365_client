import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Plus, FileText, Users, Globe, Trash2, Edit } from 'lucide-react'
import { motion } from 'framer-motion'
import { landingPageService, type LandingPage } from '../../services/landingPageService'
import { Button } from '../../components/ui/Button'
import { Card } from '../../components/ui/Card'
import { Badge } from '../../components/ui/Badge'

export default function DashboardPage() {
  const [pages, setPages] = useState<LandingPage[]>([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  const fetchPages = async () => {
    try {
      const { data } = await landingPageService.list()
      setPages(data)
    } catch {}
    finally { setLoading(false) }
  }

  useEffect(() => { fetchPages() }, [])

  const handleDelete = async (id: number, e: React.MouseEvent) => {
    e.stopPropagation()
    if (!confirm('האם למחוק את דף הנחיתה?')) return
    await landingPageService.delete(id)
    setPages((p) => p.filter((x) => x.id !== id))
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto px-6 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">דפי הנחיתה שלי</h1>
          <p className="text-slate-500 mt-1 text-sm">{pages.length} דפים</p>
        </div>
        <Button onClick={() => navigate('/builder')} size="lg">
          <Plus className="w-4 h-4" />
          הוסף חדש
        </Button>
      </div>

      {pages.length === 0 ? (
        <div className="text-center py-20">
          <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <FileText className="w-8 h-8 text-slate-400" />
          </div>
          <h3 className="text-lg font-medium text-slate-600 mb-2">אין עדיין דפי נחיתה</h3>
          <p className="text-slate-400 text-sm mb-6">לחץ על "הוסף חדש" כדי ליצור את הדף הראשון שלך עם AI</p>
          <Button onClick={() => navigate('/builder')}>
            <Plus className="w-4 h-4" />
            צור דף ראשון
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {pages.map((page, i) => (
            <motion.div
              key={page.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <Card hover onClick={() => navigate(`/editor/${page.id}`)}>
                {page.selected_variant?.image_url && (
                  <div className="w-full rounded-lg overflow-hidden mb-3 bg-slate-100" style={{ aspectRatio: '3/2' }}>
                    <img
                      src={page.selected_variant.image_url}
                      alt={page.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <div className="flex items-start justify-between mb-3">
                  <h3 className="font-semibold text-slate-900 text-base leading-tight">{page.title}</h3>
                  <Badge variant={page.status} />
                </div>

                <div className="flex items-center gap-4 text-xs text-slate-500 mb-4">
                  <span className="flex items-center gap-1">
                    <Users className="w-3 h-3" />
                    {page.leads_count ?? 0} לידים
                  </span>
                  {page.status === 'published' && (
                    <span className="flex items-center gap-1 text-emerald-600">
                      <Globe className="w-3 h-3" />
                      פעיל
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2 pt-3 border-t border-slate-100">
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={(e) => { e.stopPropagation(); navigate(`/editor/${page.id}`) }}
                    className="flex-1"
                  >
                    <Edit className="w-3 h-3" />
                    עריכה
                  </Button>
                  {(page.leads_count ?? 0) > 0 && (
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={(e) => { e.stopPropagation(); navigate(`/leads/${page.id}`) }}
                      className="flex-1"
                    >
                      <Users className="w-3 h-3" />
                      לידים
                    </Button>
                  )}
                  <button
                    onClick={(e) => handleDelete(page.id, e)}
                    className="p-1.5 rounded-lg hover:bg-red-50 text-slate-400 hover:text-red-500 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  )
}
