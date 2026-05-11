const NAV_LINKS = ['About', 'Explore', 'Stake', 'Shield']

export function Header() {
  return (
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
          Connect Wallet
        </button>
      </div>
    </header>
  )
}
