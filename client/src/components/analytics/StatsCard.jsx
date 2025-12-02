import './StatsCard.css';

const StatsCard = ({ icon, label, value, trend, className = '' }) => {
    return (
        <div className={`stats-card ${className}`}>
            <div className="stats-icon">{icon}</div>
            <div className="stats-content">
                <div className="stats-value">{value}</div>
                <div className="stats-label">{label}</div>
                {trend && (
                    <div className={`stats-trend ${trend > 0 ? 'positive' : 'negative'}`}>
                        {trend > 0 ? '↑' : '↓'} {Math.abs(trend)}%
                    </div>
                )}
            </div>
        </div>
    );
};

export default StatsCard;
