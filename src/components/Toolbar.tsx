function Toolbar() {
  return (
    <section className="toolbar" aria-label="Toolbar">
      <button className="app-button" type="button" disabled>
        <span className="button-label">Practice</span>
        <span className="button-status">Disabled</span>
      </button>

      <button className="app-button" type="button" disabled>
        <span className="button-label">Metronome</span>
        <span className="button-status">Disabled</span>
      </button>
    </section>
  )
}

export default Toolbar
