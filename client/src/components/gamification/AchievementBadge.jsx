import './AchievementBadge.css';

const AchievementBadge = ({
    achievement,
    size = 'md', // sm, md, lg
    showDetails = true,
    className = ''
}) => {
    const { icon, name, description, unlocked = false } = achievement;

    return (
        <div className={`achievement-badge ${size} ${unlocked ? 'unlocked' : 'locked'} ${className}`}>
            <div className="badge-icon-wrapper">
                <span className="badge-icon">{icon}</span>
                {!unlocked && <div className="lock-overlay">🔒</div>}
            </div>

            {showDetails && (
                <div className="badge-details">
                    <h4 className="badge-name">{name}</h4>
                    <p className="badge-description">{description}</p>
                </div>
            )}

            {unlocked && <div className="badge-glow" />}
        </div>
    );
};

export default AchievementBadge;
