import api from './api'

export interface ContentIdeas {
  headline_line1: string[]
  headline_line2: string[]
  headline_line3: string[]
  trust_badge: string[]
  subtext: string[]
  cta: string[]
  services: Array<{ icon: string; label: string }>
}

export interface VariantContent {
  headline_line1: string
  headline_line2: string
  headline_line3: string
  trust_badge: string
  subtext: string
  cta: string
  services: Array<{ icon: string; label: string }>
}

export interface LandingPageContent {
  headline_line1?: string
  headline_line2?: string
  headline_line3?: string
  trust_badge?: string
  cta?: string
  subtext?: string
  services?: Array<{ icon: string; label: string }>
}

export interface LandingPageSettings {
  bg_color?: string
  text_color?: string
  accent_color?: string
  button_color?: string
  phone?: string
  whatsapp?: string
  email_contact?: string
  facebook_url?: string
  instagram_url?: string
  content?: LandingPageContent
}

export interface LandingPageVariant {
  id: number
  landing_page_id: number
  variant_index: number
  html_content: string | null
  image_url: string | null
}

export interface LandingPageAsset {
  id: number
  type: 'logo' | 'image' | 'reference'
  path: string
  original_name: string
  url: string
}

export interface LandingPage {
  id: number
  title: string
  token: string
  status: 'draft' | 'published' | 'archived'
  form_fields: string[]
  settings: LandingPageSettings
  input_text: string | null
  input_url: string | null
  selected_variant_id: number | null
  selected_variant?: LandingPageVariant
  variants?: LandingPageVariant[]
  assets?: LandingPageAsset[]
  leads_count?: number
  created_at: string
}

export interface LandingPageStyle {
  id: number
  name_he: string
  name_en: string
  tags_he: string | null
  suitable_for_he: string | null
  sort_order: number
}

export const landingPageService = {
  getStyles: () => api.get<LandingPageStyle[]>('/styles'),

  list: () => api.get<LandingPage[]>('/landing-pages'),

  get: (id: number) => api.get<LandingPage>(`/landing-pages/${id}`),

  create: (data: FormData) =>
    api.post<LandingPage>('/landing-pages', data, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),

  update: (id: number, data: Partial<LandingPage>) =>
    api.put<LandingPage>(`/landing-pages/${id}`, data),

  delete: (id: number) => api.delete(`/landing-pages/${id}`),

  generateVariants: (id: number) =>
    api.post<{ variants: LandingPageVariant[] }>(`/landing-pages/${id}/generate-variants`),

  selectVariant: (id: number, variantId: number) =>
    api.post(`/landing-pages/${id}/select-variant`, { variant_id: variantId }),

  publish: (id: number) =>
    api.post<{ public_url: string; token: string }>(`/landing-pages/${id}/publish`),

  aiEdit: (id: number, instruction: string) =>
    api.post<{ html_content: string; variant_id: number }>(`/landing-pages/${id}/ai-edit`, { instruction }),

  getContentIdeas: (data: { title: string; input_text?: string; input_url?: string }) =>
    api.post<ContentIdeas>('/content-ideas', data),
}
