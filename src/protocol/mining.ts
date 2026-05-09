export const TILE_COUNT = 25
export const ROUND_SECONDS = 30

export type TileShape = 'square' | 'rounded' | 'circle'

export type TileStyle = {
  x: number
  y: number
  color: string
  shape: TileShape
}

export type RoundResult = {
  round: number
  winnerTile: number
  oreDistributed: number
  winnerCount: number
}

const GRID_COLUMNS = 5
const TILE_GAP = 72
const START_OFFSET = 24

export const defaultTileStyles = (): Record<number, TileStyle> => {
  const styles: Record<number, TileStyle> = {}

  for (let tile = 1; tile <= TILE_COUNT; tile += 1) {
    const index = tile - 1
    styles[tile] = {
      x: START_OFFSET + (index % GRID_COLUMNS) * TILE_GAP,
      y: START_OFFSET + Math.floor(index / GRID_COLUMNS) * TILE_GAP,
      color: '#6e7cff',
      shape: 'square',
    }
  }

  return styles
}

export const chooseWinningTile = () => Math.floor(Math.random() * TILE_COUNT) + 1
