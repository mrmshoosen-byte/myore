import { useMemo, useState } from 'react'
import './index.css'

type ChatMessage = {
  id: number
  user: string
  timestamp: string
  message: string
}

const NAV_LINKS = ['About', 'Explore', 'Stake', 'Shield']

const CHAT_MESSAGES: ChatMessage[] = [
  { id: 1, user: 'orebot', timestamp: '22:03', message: 'Round 4982 has begun. Deploys open.' },
  { id: 2, user: 'satoshi', timestamp: '22:03', message: 'Motherlode is looking spicy today.' },
  { id: 3, user: 'minted', timestamp: '22:04', message: 'Anyone seeing more activity on tiles 7 and 13?' },
  { id: 4, user: 'bitsmith', timestamp: '22:04', message: 'Auto mode is farming steady on my side.' },
  { id: 5, user: 'nora', timestamp: '22:05', message: 'Deploying small clips every block to average in.' },
  { id: 6, user: 'orebot', timestamp: '22:05', message: 'Current block window: 57 remaining.' },
  { id: 7, user: 'atlas', timestamp: '22:06', message: 'Tile 3 bounced hard last round.' },
  { id: 8, user: 'hex', timestamp: '22:06', message: 'Watching odds and waiting for a late push.' },
  { id: 9, user: 'orebot', timestamp: '22:07', message: 'Total deployed crossed 12.8K SOL equivalent.' },
  { id: 10, user: 'nova', timestamp: '22:07', message: 'gg to everyone still grinding nightly rounds.' },
]

const TILE_COUNT = 25

function App() {
  const [deployMode, setDeployMode] = useState<'manual' | 'auto'>('manual')
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

  const numericAmount = Number(amount) || 0
  const totalAmount = (selectedTiles.length * numericAmount).toFixed(2)
  const allTileIds = tileData.map((item) => item.tile)
  const allSelected = selectedTiles.length === allTileIds.length

  return (
    <div className="ore-page">
      <header className="ore-header">
        <div className="header-left">
          <a href="#" className="brand-mark" onClick={(event) => event.preventDefault()}>
            <span className="brand-dot">◎</span>
            <span className="brand-text">ORE</span>
          </a>
          <nav className="desktop-nav" aria-label="Main navigation">
            {NAV_LINKS.map((item) => (
              <a key={item} href="#" onClick={(event) => event.preventDefault()}>
                {item}
              </a>
            ))}
          </nav>
        </div>

        <div className="header-actions">
          <span className="price-pill">ORE $104.28</span>
          <span className="price-pill">SOL $188.43</span>
          <button type="button" className="social-pill" aria-label="Discord">
            D
          </button>
          <button type="button" className="social-pill" aria-label="GitHub">
            G
          </button>
          <button type="button" className="social-pill" aria-label="X">
            X
          </button>
          <button type="button" className="connect-button">
            Connect
          </button>
        </div>
      </header>

      <div className="ore-content">
        <aside className="chat-rail" aria-label="Shared chat">
          <div className="chat-rail-header">
            <h2>Shared chat</h2>
            <span className="chat-live">Live</span>
          </div>

          <div className="chat-messages">
            {CHAT_MESSAGES.map((message) => (
              <article key={message.id} className="chat-row">
                <div className="chat-avatar">{message.user.slice(0, 1).toUpperCase()}</div>
                <div className="chat-copy">
                  <div className="chat-meta">
                    <strong>{message.user}</strong>
                    <span>{message.timestamp}</span>
                  </div>
                  <p>{message.message}</p>
                </div>
              </article>
            ))}
          </div>

          <div className="chat-composer">
            <input type="text" placeholder="Message" aria-label="Message" />
            <button type="button">Send</button>
          </div>
        </aside>

        <main className="board-column">
          <section className="board-panel" aria-label="Deployment board">
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

        <aside className="deploy-column" aria-label="Deploy controls">
          <section className="deploy-stats" aria-label="Round stats">
            <article className="stat-card motherlode-card">
              <p>Motherlode</p>
              <strong>1,291.8 ORE</strong>
            </article>
            <article className="stat-card">
              <p>Time remaining</p>
              <strong>02:17</strong>
            </article>
            <article className="stat-card">
              <p>Total deployed</p>
              <strong>12,834.2 SOL</strong>
            </article>
            <article className="stat-card">
              <p>You deployed</p>
              <strong>{selectedTiles.length.toString().padStart(2, '0')} blocks</strong>
            </article>
          </section>

          <section className="deploy-panel">
            <div className="segmented-toggle" role="tablist" aria-label="Deploy mode">
              <button
                type="button"
                role="tab"
                aria-selected={deployMode === 'manual'}
                className={deployMode === 'manual' ? 'active' : ''}
                onClick={() => setDeployMode('manual')}
              >
                Manual
              </button>
              <button
                type="button"
                role="tab"
                aria-selected={deployMode === 'auto'}
                className={deployMode === 'auto' ? 'active' : ''}
                onClick={() => setDeployMode('auto')}
              >
                Auto
              </button>
            </div>

            <div className="balance-row">
              <span>SOL balance</span>
              <strong>3.8471</strong>
            </div>

            <div className="quick-buttons">
              <button type="button" onClick={() => setAmount('1')}>+1</button>
              <button type="button" onClick={() => setAmount('0.1')}>+0.1</button>
              <button type="button" onClick={() => setAmount('0.01')}>+0.01</button>
            </div>

            <label className="amount-input" htmlFor="sol-amount">
              <span>Amount</span>
              <input
                id="sol-amount"
                type="number"
                min="0"
                step="0.01"
                value={amount}
                onChange={(event) => setAmount(event.target.value)}
              />
            </label>

            <div className="summary-row blocks-row">
              <span>Blocks</span>
              <button
                type="button"
                className="all-button"
                onClick={() => setSelectedTiles(allSelected ? [] : allTileIds)}
              >
                All
              </button>
              <strong>{selectedTiles.length}</strong>
            </div>
            <div className="summary-row">
              <span>Total</span>
              <strong>{totalAmount} SOL</strong>
            </div>

            <button type="button" className="deploy-button">
              Deploy
            </button>
          </section>
        </aside>
      </div>

      <footer className="ore-footer">
        <a href="#" onClick={(event) => event.preventDefault()}>
          About
        </a>
        <a href="#" onClick={(event) => event.preventDefault()}>
          Privacy
        </a>
        <a href="#" onClick={(event) => event.preventDefault()}>
          Terms
        </a>
      </footer>
    </div>
  )
}

export default App
