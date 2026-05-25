import { create } from 'zustand'
import type { LandingPageVariant, LandingPageSettings } from '../services/landingPageService'

interface BuilderInputData {
  title: string
  input_text: string
  input_url: string
}

interface BuilderState {
  step: number
  landingPageId: number | null
  inputData: BuilderInputData
  formFields: string[]
  settings: LandingPageSettings
  selectedStyleIds: number[]
  generatedVariants: LandingPageVariant[]
  selectedVariantId: number | null
  isGenerating: boolean

  setStep: (step: number) => void
  setLandingPageId: (id: number) => void
  setInputData: (data: Partial<BuilderInputData>) => void
  setFormFields: (fields: string[]) => void
  setSettings: (settings: Partial<LandingPageSettings>) => void
  toggleStyleId: (id: number) => void
  setGeneratedVariants: (variants: LandingPageVariant[]) => void
  setSelectedVariantId: (id: number) => void
  setIsGenerating: (val: boolean) => void
  reset: () => void
}

const defaultSettings: LandingPageSettings = {
  bg_color: '#0d1117',
  text_color: '#ffffff',
  accent_color: '#B8952A',
  button_color: '#B8952A',
}

export const useBuilderStore = create<BuilderState>((set) => ({
  step: 1,
  landingPageId: null,
  inputData: { title: '', input_text: '', input_url: '' },
  formFields: ['name', 'email', 'phone'],
  settings: defaultSettings,
  selectedStyleIds: [],
  generatedVariants: [],
  selectedVariantId: null,
  isGenerating: false,

  setStep: (step) => set({ step }),
  setLandingPageId: (id) => set({ landingPageId: id }),
  setInputData: (data) => set((s) => ({ inputData: { ...s.inputData, ...data } })),
  setFormFields: (formFields) => set({ formFields }),
  setSettings: (s) => set((prev) => ({ settings: { ...prev.settings, ...s } })),
  toggleStyleId: (id) => set((s) => {
    const ids = s.selectedStyleIds
    if (ids.includes(id)) return { selectedStyleIds: ids.filter((x) => x !== id) }
    if (ids.length >= 2) return {} // already have 2 — must deselect first
    return { selectedStyleIds: [...ids, id] }
  }),
  setGeneratedVariants: (variants) => set({ generatedVariants: variants }),
  setSelectedVariantId: (id) => set({ selectedVariantId: id }),
  setIsGenerating: (val) => set({ isGenerating: val }),
  reset: () => set({
    step: 1, landingPageId: null,
    inputData: { title: '', input_text: '', input_url: '' },
    formFields: ['name', 'email', 'phone'],
    settings: defaultSettings,
    selectedStyleIds: [],
    generatedVariants: [], selectedVariantId: null, isGenerating: false,
  }),
}))
