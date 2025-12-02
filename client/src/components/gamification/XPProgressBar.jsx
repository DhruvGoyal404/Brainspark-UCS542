import './XPProgressBar.css';

const XPProgressBar = ({
    currentXP,
    requiredXP,
    level,
    showLabel = true,
    size = 'md', // sm, md, lg
    className = ''
}) => {
    const percentage = Math.min((currentXP / requiredXP) * 100, 100);

    return (
        <div className={`xp-progress-bar ${size} ${className}`}>
            {showLabel && (
                <div className="xp-header">
                    <span className="xp-label">
                        Level {level}
                    </span>
                    <span className="xp-value">
                        {currentXP} / {requiredXP} XP
                    </span>
                </div>
            )}

            <div className="xp-track">
                <div
                    className="xp-fill"
                    style={{ width: `${percentage}%` }}
                >
                    <div className="xp-shine" />
                </div>
            </div>

            {showLabel && percentage === 100 && (
                <div className="level-up-message">
                    🎉 Ready to level up!
                </div>
            )}
        </div>
    );
};

export default XPProgressBar;
