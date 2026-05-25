import api from './api'

export interface LeadNote {
  id: number
  content: string
  user: { id: number; name: string }
  created_at: string
}

export interface Lead {
  id: number
  landing_page_id: number
  data: Record<string, string>
  status: 'new' | 'in_progress' | 'handled' | 'rejected'
  ip_address: string | null
  notes?: LeadNote[]
  created_at: string
  updated_at: string
}

export interface PaginatedLeads {
  data: Lead[]
  current_page: number
  last_page: number
  total: number
}

export const leadService = {
  list: (landingPageId: number, page = 1) =>
    api.get<PaginatedLeads>(`/landing-pages/${landingPageId}/leads?page=${page}`),

  get: (id: number) => api.get<Lead>(`/leads/${id}`),

  updateStatus: (id: number, status: Lead['status']) =>
    api.patch<Lead>(`/leads/${id}/status`, { status }),

  addNote: (id: number, content: string) =>
    api.post<LeadNote>(`/leads/${id}/notes`, { content }),
}
