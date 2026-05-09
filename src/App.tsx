import { useEffect, useMemo, useState } from 'react'
import './index.css'
import {
  ROUND_SECONDS,
  TILE_COUNT,
  chooseWinningTile,
  type RoundResult,
  type TileShape,
} from './protocol/mining'
import {
  defaultPersonalization,
  loadPersonalization,
  savePersonalization,
} from './lib/storage'

type Mode = 'play' | 'edit'

type ChatMessage = {
  id: string
  user: string
  message: string
  timestamp: string
}

type PhantomProvider = {
  isPhantom?: boolean
  connect: () => Promise<{ publicKey: { toString: () => string } }>
  signMessage: (message: Uint8Array, display: string) => Promise<{ signature: Uint8Array }>
}

const STICKER_OPTIONS = ['🌹', '💖', '⭐', '🔥', '✨', '🦋']

const toBase64 = (value: Uint8Array) => btoa(String.fromCharCode(...value))

function App() {
  const [mode, setMode] = useState<Mode>('play')
  const [personalization, setPersonalization] = useState(() => loadPersonalization())
  const [selectedTiles, setSelectedTiles] = useState<number[]>([])
  const [deployedTiles, setDeployedTiles] = useState<number[]>([])
  const [round, setRound] = useState(1)
  const [roundSecondsLeft, setRoundSecondsLeft] = useState(ROUND_SECONDS)
  const [winnerTile, setWinnerTile] = useState<number | null>(null)
  const [roundResults, setRoundResults] = useState<RoundResult[]>([])
  const [editingTileId, setEditingTileId] = useState(1)
  const [draggingTileId, setDraggingTileId] = useState<number | null>(null)
  const [draggingStickerId, setDraggingStickerId] = useState<string | null>(null)
  const [chatCollapsed, setChatCollapsed] = useState(false)
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([])
  const [chatInput, setChatInput] = useState('')
  const [walletAddress, setWalletAddress] = useState('')
  const [chatToken, setChatToken] = useState('')
  const [chatStatus, setChatStatus] = useState('Disconnected')

  const activeTileStyle = personalization.tiles[editingTileId]

  useEffect(() => {
    savePersonalization(personalization)
  }, [personalization])

  useEffect(() => {
    if (roundSecondsLeft <= 0 && winnerTile === null) {
      const settleTimer = window.setTimeout(() => {
        const winner = chooseWinningTile()
        const winnerCount = deployedTiles.includes(winner) ? 1 : 0
        const oreDistributed = winnerCount > 0 ? 10 : 0

        setWinnerTile(winner)
        setRoundResults((current) => [
          { round, winnerTile: winner, oreDistributed, winnerCount },
          ...current,
        ].slice(0, 8))
      }, 0)

      return () => window.clearTimeout(settleTimer)
    }

    if (roundSecondsLeft <= 0) {
      return
    }

    const timer = window.setTimeout(() => {
      setRoundSecondsLeft((seconds) => Math.max(seconds - 1, 0))
    }, 1000)

    return () => window.clearTimeout(timer)
  }, [deployedTiles, round, roundSecondsLeft, winnerTile])

  useEffect(() => {
    const loadHistory = async () => {
      try {
        const response = await fetch('https://api.ore.supply/chat/history')
        const payload = (await response.json()) as { messages?: ChatMessage[] }
        if (payload.messages) {
          setChatMessages(payload.messages.slice(-50))
        }
      } catch {
        setChatStatus('History unavailable')
      }
    }

    loadHistory()

    const events = new EventSource('https://api.ore.supply/connect')
    events.onopen = () => setChatStatus('Live connected')
    events.onerror = () => setChatStatus('Live updates unavailable')
    events.onmessage = (event) => {
      try {
        const incoming = JSON.parse(event.data) as ChatMessage
        if (!incoming.message) {
          return
        }

        setChatMessages((current) => [...current.slice(-49), incoming])
      } catch {
        // ignore malformed payloads
      }
    }

    return () => events.close()
  }, [])

  const roundEnded = roundSecondsLeft === 0

  const headerSummary = useMemo(() => {
    if (roundEnded && winnerTile) {
      return `Round ${round} complete. Winning tile: ${winnerTile}`
    }

    return `Round ${round} live · ${roundSecondsLeft}s remaining`
  }, [round, roundEnded, roundSecondsLeft, winnerTile])

  const updateTile = (tile: number, patch: Partial<(typeof personalization.tiles)[number]>) => {
    setPersonalization((current) => ({
      ...current,
      tiles: {
        ...current.tiles,
        [tile]: {
          ...current.tiles[tile],
          ...patch,
        },
      },
    }))
  }

  const handleTileClick = (tile: number) => {
    if (mode === 'edit') {
      setEditingTileId(tile)
      return
    }

    if (roundEnded) {
      return
    }

    setSelectedTiles((current) =>
      current.includes(tile)
        ? current.filter((value) => value !== tile)
        : [...current, tile].sort((a, b) => a - b),
    )
  }

  const handleDeploy = () => {
    if (roundEnded || selectedTiles.length === 0) {
      return
    }

    setDeployedTiles(selectedTiles)
  }

  const startNextRound = () => {
    setRound((current) => current + 1)
    setRoundSecondsLeft(ROUND_SECONDS)
    setWinnerTile(null)
    setSelectedTiles([])
    setDeployedTiles([])
  }

  const provider =
    typeof window !== 'undefined'
      ? ((window as Window & { solana?: PhantomProvider }).solana ?? null)
      : null

  const connectWallet = async () => {
    if (!provider) {
      setChatStatus('No wallet provider detected')
      return
    }

    try {
      const connection = await provider.connect()
      setWalletAddress(connection.publicKey.toString())
      setChatStatus('Wallet connected')
    } catch {
      setChatStatus('Wallet connection failed')
    }
  }

  const authenticateChat = async () => {
    if (!provider || !walletAddress) {
      setChatStatus('Connect wallet first')
      return
    }

    try {
      const nonce =
        typeof window !== 'undefined' && window.crypto?.randomUUID
          ? window.crypto.randomUUID()
          : `${Date.now()}-${Math.random()}`
      const message = `ore-chat-auth:${Date.now()}:${nonce}`
      const signed = await provider.signMessage(new TextEncoder().encode(message), 'utf8')
      const response = await fetch('https://api.ore.supply/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          wallet: walletAddress,
          message,
          signature: toBase64(signed.signature),
        }),
      })

      const payload = (await response.json()) as { token?: string }
      setChatToken(payload.token ?? '')
      setChatStatus(payload.token ? 'Chat authenticated' : 'Chat auth response received')
    } catch {
      setChatStatus('Chat auth failed')
    }
  }

  const sendMessage = async () => {
    if (!chatInput.trim()) {
      return
    }

    try {
      await fetch('https://api.ore.supply/chat/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(chatToken ? { Authorization: `Bearer ${chatToken}` } : {}),
        },
        body: JSON.stringify({
          wallet: walletAddress,
          message: chatInput.trim(),
        }),
      })

      setChatInput('')
      setChatStatus('Message sent')
    } catch {
      setChatStatus('Message send failed')
    }
  }

  const resetCustomization = () => {
    setPersonalization(defaultPersonalization())
    setEditingTileId(1)
  }

  const addSticker = (symbol: string) => {
    setPersonalization((current) => ({
      ...current,
      stickers: [
        ...current.stickers,
        {
          id: `${Date.now()}-${Math.random()}`,
          symbol,
          x: 460,
          y: 34,
          size: 40,
        },
      ],
    }))
  }

  const removeSticker = (id: string) => {
    setPersonalization((current) => ({
      ...current,
      stickers: current.stickers.filter((sticker) => sticker.id !== id),
    }))
  }

  const onCanvasMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    const canvasBounds = event.currentTarget.getBoundingClientRect()
    const x = Math.min(Math.max(event.clientX - canvasBounds.left - 30, 4), canvasBounds.width - 68)
    const y = Math.min(Math.max(event.clientY - canvasBounds.top - 30, 4), canvasBounds.height - 68)

    if (mode !== 'edit') {
      return
    }

    if (draggingTileId) {
      updateTile(draggingTileId, { x, y })
      return
    }

    if (draggingStickerId) {
      setPersonalization((current) => ({
        ...current,
        stickers: current.stickers.map((sticker) =>
          sticker.id === draggingStickerId ? { ...sticker, x, y } : sticker,
        ),
      }))
    }
  }

  const selectedCount = selectedTiles.length

  return (
    <div
      className="app-shell"
      style={{
        backgroundColor: personalization.backgroundColor,
        color: personalization.textColor,
      }}
    >
      <header className="top-bar">
        <div>
          <h1>myore</h1>
          <p className="subtitle">Unofficial, community-made ORE protocol client (open source).</p>
        </div>
        <div className="mode-switch">
          <button type="button" onClick={() => setMode('play')} className={mode === 'play' ? 'active' : ''}>
            Play mode
          </button>
          <button type="button" onClick={() => setMode('edit')} className={mode === 'edit' ? 'active' : ''}>
            Edit mode
          </button>
        </div>
      </header>

      <main className="layout">
        <section className="main-column">
          <div className="status-panel">
            <strong>{headerSummary}</strong>
            <div className="controls-row">
              <button type="button" onClick={handleDeploy} disabled={mode === 'edit' || roundEnded || selectedCount === 0}>
                Deploy to selected ({selectedCount})
              </button>
              <button type="button" onClick={startNextRound}>
                Start next round
              </button>
            </div>
            <p>
              In play mode, select numbered tiles and deploy. In edit mode, drag each tile and stickers without triggering mining actions.
            </p>
          </div>

          {mode === 'edit' && (
            <div className="edit-panel">
              <h2>Edit board appearance</h2>
              <label>
                Editing tile
                <select
                  value={editingTileId}
                  onChange={(event) => setEditingTileId(Number(event.target.value))}
                >
                  {Array.from({ length: TILE_COUNT }, (_, index) => index + 1).map((tile) => (
                    <option value={tile} key={tile}>
                      Tile {tile}
                    </option>
                  ))}
                </select>
              </label>
              <label>
                Tile shape
                <select
                  value={activeTileStyle.shape}
                  onChange={(event) => updateTile(editingTileId, { shape: event.target.value as TileShape })}
                >
                  <option value="square">Square</option>
                  <option value="rounded">Rounded square</option>
                  <option value="circle">Circle</option>
                </select>
              </label>
              <label>
                Tile color
                <input
                  type="color"
                  value={activeTileStyle.color}
                  onChange={(event) => updateTile(editingTileId, { color: event.target.value })}
                />
              </label>
              <label>
                Background color
                <input
                  type="color"
                  value={personalization.backgroundColor}
                  onChange={(event) =>
                    setPersonalization((current) => ({
                      ...current,
                      backgroundColor: event.target.value,
                    }))
                  }
                />
              </label>
              <label>
                Text color
                <input
                  type="color"
                  value={personalization.textColor}
                  onChange={(event) =>
                    setPersonalization((current) => ({
                      ...current,
                      textColor: event.target.value,
                    }))
                  }
                />
              </label>
              <div className="sticker-row">
                {STICKER_OPTIONS.map((symbol) => (
                  <button key={symbol} type="button" onClick={() => addSticker(symbol)}>
                    Add {symbol}
                  </button>
                ))}
              </div>
              <button type="button" onClick={resetCustomization}>
                Reset personalization
              </button>
            </div>
          )}

          <div
            className="board-canvas"
            onMouseMove={onCanvasMouseMove}
            onMouseUp={() => {
              setDraggingTileId(null)
              setDraggingStickerId(null)
            }}
            onMouseLeave={() => {
              setDraggingTileId(null)
              setDraggingStickerId(null)
            }}
          >
            {Array.from({ length: TILE_COUNT }, (_, index) => index + 1).map((tile) => {
              const tileStyle = personalization.tiles[tile]
              const selected = selectedTiles.includes(tile)
              const deployed = deployedTiles.includes(tile)
              const winner = winnerTile === tile
              const loser = roundEnded && !winner

              return (
                <button
                  key={tile}
                  type="button"
                  className={`board-tile shape-${tileStyle.shape} ${selected ? 'selected' : ''} ${deployed ? 'deployed' : ''} ${winner ? 'winner' : ''} ${loser ? 'loser' : ''}`}
                  onMouseDown={() => {
                    if (mode === 'edit') {
                      setDraggingTileId(tile)
                    }
                  }}
                  onClick={() => handleTileClick(tile)}
                  style={{
                    left: tileStyle.x,
                    top: tileStyle.y,
                    backgroundColor: tileStyle.color,
                  }}
                >
                  <span>{tile}</span>
                  {deployed && <small className="sol-marker">◎ SOL</small>}
                </button>
              )
            })}

            {personalization.stickers.map((sticker) => (
              <div
                key={sticker.id}
                role="button"
                tabIndex={0}
                className="sticker"
                onMouseDown={() => mode === 'edit' && setDraggingStickerId(sticker.id)}
                onDoubleClick={() => mode === 'edit' && removeSticker(sticker.id)}
                style={{ left: sticker.x, top: sticker.y, fontSize: sticker.size }}
              >
                {sticker.symbol}
              </div>
            ))}
          </div>
        </section>

        <aside className="side-column">
          <section className="panel">
            <h3>Round info</h3>
            <p>Selected: {selectedTiles.join(', ') || 'none'}</p>
            <p>Deployed: {deployedTiles.join(', ') || 'none'}</p>
            <p>Winner: {winnerTile ?? 'pending'}</p>
          </section>

          <section className="panel">
            <h3>Results & ORE distribution</h3>
            <ul>
              {roundResults.map((result) => (
                <li key={result.round}>
                  Round {result.round}: tile {result.winnerTile} · ORE {result.oreDistributed} · winners{' '}
                  {result.winnerCount}
                </li>
              ))}
              {roundResults.length === 0 && <li>No rounds settled yet.</li>}
            </ul>
          </section>

          <section className="panel donation">
            <h3>Support this community client</h3>
            <p>Donations are separate from mining/protocol actions.</p>
            <a href="https://github.com/sponsors/mrmshoosen-byte" target="_blank" rel="noreferrer">
              Donate to @mrmshoosen-byte
            </a>
          </section>
        </aside>

        <aside className={`chat-column ${chatCollapsed ? 'collapsed' : ''}`}>
          <div className="chat-head">
            <h3>Shared ORE Chat</h3>
            <button type="button" onClick={() => setChatCollapsed((value) => !value)}>
              {chatCollapsed ? 'Open chat' : 'Collapse'}
            </button>
          </div>

          {!chatCollapsed && (
            <>
              <p className="chat-status">{chatStatus}</p>
              <div className="chat-actions">
                <button type="button" onClick={connectWallet}>
                  Connect wallet
                </button>
                <button type="button" onClick={authenticateChat} disabled={!walletAddress}>
                  Sign chat auth
                </button>
              </div>
              <p className="wallet-display">{walletAddress || 'Wallet not connected'}</p>
              <div className="chat-log">
                {chatMessages.map((message) => (
                  <p key={message.id}>
                    <strong>{message.user || 'anon'}:</strong> {message.message}
                  </p>
                ))}
              </div>
              <div className="chat-send">
                <input
                  type="text"
                  value={chatInput}
                  onChange={(event) => setChatInput(event.target.value)}
                  placeholder="Send message"
                />
                <button type="button" onClick={sendMessage}>
                  Send
                </button>
              </div>
            </>
          )}
        </aside>
      </main>
    </div>
  )
}

export default App
