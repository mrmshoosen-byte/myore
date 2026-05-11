import { StatsCards } from './StatsCards'
import { DeployControls } from './DeployControls'

interface RightPanelProps {
  selectedTiles: number[]
  allTileIds: number[]
  allSelected: boolean
  setSelectedTiles: React.Dispatch<React.SetStateAction<number[]>>
  deployMode: 'manual' | 'auto'
  setDeployMode: React.Dispatch<React.SetStateAction<'manual' | 'auto'>>
  amount: string
  setAmount: React.Dispatch<React.SetStateAction<string>>
}

export function RightPanel({
  selectedTiles,
  allTileIds,
  allSelected,
  setSelectedTiles,
  deployMode,
  setDeployMode,
  amount,
  setAmount,
}: RightPanelProps) {
  return (
    <aside className="deploy-column" aria-label="Right panel">
      <StatsCards selectedTiles={selectedTiles} />
      <DeployControls
        selectedTiles={selectedTiles}
        allTileIds={allTileIds}
        allSelected={allSelected}
        setSelectedTiles={setSelectedTiles}
        deployMode={deployMode}
        setDeployMode={setDeployMode}
        amount={amount}
        setAmount={setAmount}
      />
    </aside>
  )
}
