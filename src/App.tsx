import { useMemo, useState } from 'react'
import './index.css'
import { Header, ChatRail, BoardPanel, RightPanel, Footer } from './components/home'

const TILE_COUNT = 25

function App() {
  const [amount, setAmount] = useState('0.10')
  const [selectedTiles, setSelectedTiles] = useState<number[]>([])

  const tileData = useMemo(
    () =>
      Array.from({ length: TILE_COUNT }, (_, index) => {
        const tile = index + 1
        return {
          tile,
          participants: 16 + ((tile * 7) % 28),
          state: tile % 3 === 0 ? 'LIVE' : tile % 2 === 0 ? 'WAIT' : 'OPEN',
          value: (0.2 + ((tile * 17) % 60) / 100).toFixed(2),
        }
      }),
    [],
  )

  const toggleTile = (tile: number) => {
    setSelectedTiles((current) =>
      current.includes(tile) ? current.filter((entry) => entry !== tile) : [...current, tile],
    )
  }

  const allTileIds = tileData.map((item) => item.tile)
  const allSelected = selectedTiles.length === allTileIds.length

  return (
    <div className="ore-page">
      <Header />

      <div className="ore-content">
        <ChatRail />
        <BoardPanel tileData={tileData} selectedTiles={selectedTiles} toggleTile={toggleTile} />
        <RightPanel
          selectedTiles={selectedTiles}
          allTileIds={allTileIds}
          allSelected={allSelected}
          setSelectedTiles={setSelectedTiles}
          amount={amount}
          setAmount={setAmount}
        />
      </div>

      <Footer />
    </div>
  )
}

export default App
