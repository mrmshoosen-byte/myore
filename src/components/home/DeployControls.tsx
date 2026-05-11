interface DeployControlsProps {
  selectedTiles: number[]
  allTileIds: number[]
  allSelected: boolean
  setSelectedTiles: React.Dispatch<React.SetStateAction<number[]>>
  amount: string
  setAmount: React.Dispatch<React.SetStateAction<string>>
}

export function DeployControls({
  selectedTiles,
  allTileIds,
  allSelected,
  setSelectedTiles,
  amount,
  setAmount,
}: DeployControlsProps) {
  const numericAmount = Number(amount) || 0
  const totalAmount = (selectedTiles.length * numericAmount).toFixed(2)

  return (
    <section className="deploy-panel" aria-label="Deploy controls">
      <div className="mode-row">
        <span>Auto</span>
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
  )
}
