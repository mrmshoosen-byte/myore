export type TileData = {
  tile: number
  participants: number
  state: string
  value: string
}

interface BoardPanelProps {
  tileData: TileData[]
  selectedTiles: number[]
  toggleTile: (tile: number) => void
}

export function BoardPanel({ tileData, selectedTiles, toggleTile }: BoardPanelProps) {
  return (
    <main className="board-column">
      <section className="board-panel card-base" aria-label="Deployment board">
        <div className="tile-grid">
          {tileData.map((item) => {
            const selected = selectedTiles.includes(item.tile)
            return (
              <button
                key={item.tile}
                type="button"
                className={`tile ${selected ? 'selected' : ''}`}
                onClick={() => toggleTile(item.tile)}
              >
                <span className="tile-id">{item.tile}</span>
                <span className="tile-top-right">
                  <span aria-hidden="true">◎</span>
                  {item.participants}
                </span>
                <span className="tile-footer">{selected ? 'Selected' : `${item.value} ORE`}</span>
              </button>
            )
          })}
        </div>
      </section>
    </main>
  )
}
