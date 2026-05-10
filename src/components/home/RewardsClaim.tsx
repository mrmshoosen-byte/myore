export function RewardsClaim() {
  return (
    <section className="rewards-panel card-base" aria-label="Rewards">
      <p className="rewards-panel-title">Your rewards</p>
      <div className="rewards-row">
        <span className="rewards-label">Pending</span>
        <strong className="rewards-amount">0.000 ORE</strong>
      </div>
      <button type="button" className="claim-button" disabled>
        Claim
      </button>
    </section>
  )
}
