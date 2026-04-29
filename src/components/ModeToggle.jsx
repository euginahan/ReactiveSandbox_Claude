// ModeToggle — switches between Meal Builder and Week Plan views
// Reads: currentMode
// Writes: onModeChange

function ModeToggle({ currentMode, onModeChange }) {
  return (
    <div className="mode-toggle-bar">
      <div className="mode-toggle">
        <button
          className={`mode-btn ${currentMode === 'mealBuilder' ? 'active' : ''}`}
          onClick={() => onModeChange('mealBuilder')}
        >
          <span className="mode-btn-icon">🍱</span>
          Meal Builder
        </button>
        <button
          className={`mode-btn ${currentMode === 'weekPlan' ? 'active' : ''}`}
          onClick={() => onModeChange('weekPlan')}
        >
          <span className="mode-btn-icon">📅</span>
          Week Plan
        </button>
      </div>
    </div>
  )
}

export default ModeToggle
