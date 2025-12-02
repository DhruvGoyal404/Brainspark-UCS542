import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Award } from 'lucide-react';
import Card from '../ui/Card';
import Avatar from '../ui/Avatar';
import './UserRankCard.css';

const UserRankCard = ({ user, rank, showTrend = true }) => {
    const getRankIcon = (rank) => {
        if (rank === 1) return '🥇';
        if (rank === 2) return '🥈';
        if (rank === 3) return '🥉';
        return null;
    };

    const rankIcon = getRankIcon(rank);
    const trend = user.rankChange || 0; // Positive = moved up, Negative = moved down

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.2 }}
            className="user-rank-card"
        >
            <Card className="rank-card" elevated>
                <div className="rank-indicator">
                    {rankIcon ? (
                        <span className="rank-medal">{rankIcon}</span>
                    ) : (
                        <div className="rank-number">#{rank}</div>
                    )}
                </div>

                <div className="user-info">
                    <Avatar
                        src={user.avatar}
                        fallback={user.username?.charAt(0).toUpperCase()}
                        size="lg"
                    />
                    <div className="user-details">
                        <h3 className="username">{user.username}</h3>
                        <div className="user-stats">
                            <span className="stat">
                                <Award size={14} />
                                {user.stats?.currentXP || 0} XP
                            </span>
                            <span className="stat">
                                Level {user.stats?.level || 1}
                            </span>
                        </div>
                    </div>
                </div>

                {showTrend && trend !== 0 && (
                    <div className={`rank-trend ${trend > 0 ? 'positive' : 'negative'}`}>
                        {trend > 0 ? (
                            <>
                                <TrendingUp size={16} />
                                <span>+{trend}</span>
                            </>
                        ) : (
                            <>
                                <TrendingDown size={16} />
                                <span>{trend}</span>
                            </>
                        )}
                    </div>
                )}

                <div className="performance">
                    <div className="performance-item">
                        <span className="perf-label">Quizzes</span>
                        <span className="perf-value">{user.stats?.totalQuizzes || 0}</span>
                    </div>
                    <div className="performance-item">
                        <span className="perf-label">Accuracy</span>
                        <span className="perf-value accuracy">
                            {Math.round((user.stats?.totalScore || 0) / Math.max(user.stats?.totalQuizzes || 1, 1))}%
                        </span>
                    </div>
                </div>
            </Card>
        </motion.div>
    );
};

export default UserRankCard;
