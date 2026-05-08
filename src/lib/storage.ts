import { defaultTileStyles, type TileStyle } from '../protocol/mining'

export type StickerItem = {
  id: string
  symbol: string
  x: number
  y: number
  size: number
}

export type Personalization = {
  backgroundColor: string
  textColor: string
  tiles: Record<number, TileStyle>
  stickers: StickerItem[]
}

const STORAGE_KEY = 'myore-personalization-v1'

export const defaultPersonalization = (): Personalization => ({
  backgroundColor: '#090b14',
  textColor: '#f7f7ff',
  tiles: defaultTileStyles(),
  stickers: [],
})

export const loadPersonalization = (): Personalization => {
  const fallback = defaultPersonalization()

  if (typeof window === 'undefined') {
    return fallback
  }

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) {
      return fallback
    }

    const parsed = JSON.parse(raw) as Partial<Personalization>
    return {
      backgroundColor: parsed.backgroundColor ?? fallback.backgroundColor,
      textColor: parsed.textColor ?? fallback.textColor,
      tiles: parsed.tiles ?? fallback.tiles,
      stickers: parsed.stickers ?? fallback.stickers,
    }
  } catch {
    return fallback
  }
}

export const savePersonalization = (personalization: Personalization) => {
  if (typeof window === 'undefined') {
    return
  }

  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(personalization))
}
