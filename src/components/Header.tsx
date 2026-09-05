interface HeaderProps {
  workspace: 'trainer' | 'score'
  disabled: boolean
  onWorkspaceChange: (workspace: 'trainer' | 'score') => void
}

function Header({ workspace, disabled, onWorkspaceChange }: HeaderProps) {
  return (
    <header className="app-header">
      <h1>{workspace === 'trainer' ? 'Piano Trainer' : 'Piano Editor'}</h1>
      <div className="workspace-tabs" role="tablist" aria-label="Workspace">
        {(['trainer', 'score'] as const).map(tab => (
          <button
            key={tab}
            id={`${tab}-tab`}
            type="button"
            role="tab"
            aria-selected={workspace === tab}
            aria-controls={`${tab}-panel`}
            disabled={disabled}
            title={disabled ? 'Please release the piano keys before switching workspace' : undefined}
            onClick={() => onWorkspaceChange(tab)}
          >
            {tab === 'trainer' ? 'Trainer' : 'Editor'}
          </button>
        ))}
      </div>
    </header>
  )
}

export default Header
