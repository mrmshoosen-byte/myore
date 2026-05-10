type ChatMessage = {
  id: number
  user: string
  timestamp: string
  message: string
}

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

export function ChatRail() {
  return (
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
  )
}
