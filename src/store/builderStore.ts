import { create } from 'zustand'
import type { LandingPageVariant, LandingPageSettings, ContentIdeas, VariantContent } from '../services/landingPageService'

interface BuilderInputData {
  title: string
  input_text: string
  input_url: string
}

const emptyVariantContent = (): VariantContent => ({
  headline_line1: '',
  headline_line2: '',
  headline_line3: '',
  trust_badge: '',
  subtext: '',
  cta: '',
  services: [],
})

interface BuilderState {
  step: number
  landingPageId: number | null
  inputData: BuilderInputData
  formFields: string[]
  settings: LandingPageSettings
  selectedStyleIds: number[]
  contentIdeas: ContentIdeas | null
  variantContents: [VariantContent, VariantContent]
  generatedVariants: LandingPageVariant[]
  selectedVariantId: number | null
  isGenerating: boolean

  setStep: (step: number) => void
  setLandingPageId: (id: number) => void
  setInputData: (data: Partial<BuilderInputData>) => void
  setFormFields: (fields: string[]) => void
  setSettings: (settings: Partial<LandingPageSettings>) => void
  toggleStyleId: (id: number) => void
  setContentIdeas: (ideas: ContentIdeas) => void
  setVariantField: (variantIdx: 0 | 1, field: keyof Omit<VariantContent, 'services'>, value: string) => void
  toggleVariantService: (variantIdx: 0 | 1, service: { icon: string; label: string }) => void
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
  contentIdeas: null,
  variantContents: [emptyVariantContent(), emptyVariantContent()],
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
    if (ids.length >= 2) return {}
    return { selectedStyleIds: [...ids, id] }
  }),
  setContentIdeas: (ideas) => set({ contentIdeas: ideas }),
  setVariantField: (variantIdx, field, value) => set((s) => {
    const contents: [VariantContent, VariantContent] = [{ ...s.variantContents[0] }, { ...s.variantContents[1] }]
    contents[variantIdx] = { ...contents[variantIdx], [field]: value }
    return { variantContents: contents }
  }),
  toggleVariantService: (variantIdx, service) => set((s) => {
    const contents: [VariantContent, VariantContent] = [{ ...s.variantContents[0] }, { ...s.variantContents[1] }]
    const current = contents[variantIdx].services
    const isSelected = current.some((sv) => sv.label === service.label)
    if (isSelected) {
      contents[variantIdx] = { ...contents[variantIdx], services: current.filter((sv) => sv.label !== service.label) }
    } else if (current.length < 4) {
      contents[variantIdx] = { ...contents[variantIdx], services: [...current, service] }
    }
    return { variantContents: contents }
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
    contentIdeas: null,
    variantContents: [emptyVariantContent(), emptyVariantContent()],
    generatedVariants: [], selectedVariantId: null, isGenerating: false,
  }),
}))
