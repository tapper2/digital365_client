import { create } from 'zustand'
import type { LandingPage } from '../services/landingPageService'

interface ChatMessage {
  role: 'user' | 'assistant'
  content: string
}

interface EditorState {
  page: LandingPage | null
  heroImageUrl: string | null
  logoUrl: string | null
  variantId: number | null
  chatHistory: ChatMessage[]
  isGenerating: boolean

  setPage: (page: LandingPage) => void
  setHeroImageUrl: (url: string | null) => void
  setLogoUrl: (url: string | null) => void
  setVariantId: (id: number) => void
  addMessage: (msg: ChatMessage) => void
  setIsGenerating: (val: boolean) => void
  reset: () => void
}

export const useEditorStore = create<EditorState>((set) => ({
  page: null,
  heroImageUrl: null,
  logoUrl: null,
  variantId: null,
  chatHistory: [],
  isGenerating: false,

  setPage: (page) => set({ page }),
  setHeroImageUrl: (url) => set({ heroImageUrl: url }),
  setLogoUrl: (url) => set({ logoUrl: url }),
  setVariantId: (id) => set({ variantId: id }),
  addMessage: (msg) => set((s) => ({ chatHistory: [...s.chatHistory, msg] })),
  setIsGenerating: (val) => set({ isGenerating: val }),
  reset: () => set({ page: null, heroImageUrl: null, logoUrl: null, variantId: null, chatHistory: [], isGenerating: false }),
}))
