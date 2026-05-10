interface StatsCardsProps {
  selectedTiles: number[]
}

export function StatsCards({ selectedTiles }: StatsCardsProps) {
  return (
    <section className="deploy-stats" aria-label="Round stats">
      <article className="stat-card card-base motherlode-card">
        <p>Motherlode</p>
        <strong>1,291.8 ORE</strong>
      </article>
      <article className="stat-card card-base">
        <p>Time remaining</p>
        <strong>02:17</strong>
      </article>
      <article className="stat-card card-base">
        <p>Total deployed</p>
        <strong>12,834.2 SOL</strong>
      </article>
      <article className="stat-card card-base">
        <p>You deployed</p>
        <strong>{selectedTiles.length.toString().padStart(2, '0')} blocks</strong>
      </article>
    </section>
  )
}
