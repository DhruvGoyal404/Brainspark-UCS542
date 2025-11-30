import { useState } from 'react';
import { motion } from 'framer-motion';
import { Trophy, Medal, Award, TrendingUp, Filter } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import './LeaderboardPage.css';

const LeaderboardPage = () => {
    const { user } = useAuth();
    const [timeFilter, setTimeFilter] = useState('all-time');
    const [categoryFilter, setCategoryFilter] = useState('all');

    // Mock leaderboard data
    const mockUsers = [
        { id: 1, rank: 1, username: 'CodeMaster', avatar: 'CM', totalScore: 9850, quizzesTaken: 47, accuracy: 95 },
        { id: 2, rank: 2, username: 'QuizWhiz', avatar: 'QW', totalScore: 9120, quizzesTaken: 52, accuracy: 88 },
        { id: 3, rank: 3, username: 'BrainSpark', avatar: 'BS', totalScore: 8765, quizzesTaken: 41, accuracy: 92 },
        { id: 4, rank: 4, username: 'DataNinja', avatar: 'DN', totalScore: 8234, quizzesTaken: 38, accuracy: 90 },
        { id: 5, rank: 5, username: 'AlgoExpert', avatar: 'AE', totalScore: 7890, quizzesTaken: 35, accuracy: 87 },
        { id: 6, rank: 6, username: 'DevPro', avatar: 'DP', totalScore: 7456, quizzesTaken: 33, accuracy: 85 },
        { id: 7, rank: 7, username: 'TechGuru', avatar: 'TG', totalScore: 7123, quizzesTaken: 31, accuracy: 84 },
        { id: 8, rank: 8, username: 'SmartCoder', avatar: 'SC', totalScore: 6890, quizzesTaken: 29, accuracy: 83 },
        { id: 9, rank: 9, username: 'LogicKing', avatar: 'LK', totalScore: 6567, quizzesTaken: 27, accuracy: 82 },
        { id: 10, rank: 10, username: 'ByteBoss', avatar: 'BB', totalScore: 6234, quizzesTaken: 25, accuracy: 81 }
    ];

    // Add current user if not in top 10
    const currentUserRank = 42;
    const currentUserData = {
        id: user?.id || 'current',
        rank: currentUserRank,
        username: user?.username || 'You',
        avatar: user?.username?.charAt(0).toUpperCase() || 'U',
        totalScore: user?.stats?.totalScore || 1250,
        quizzesTaken: user?.stats?.totalQuizzes || 8,
        accuracy: 78
    };

    const getRankIcon = (rank) => {
        switch (rank) {
            case 1:
                return <span className="rank-medal gold">🥇</span>;
            case 2:
                return <span className="rank-medal silver">🥈</span>;
            case 3:
                return <span className="rank-medal bronze">🥉</span>;
            default:
                return <span className="rank-number">#{rank}</span>;
        }
    };

    const getRankColor = (rank) => {
        if (rank === 1) return 'var(--warning)';
        if (rank === 2) return 'hsl(0, 0%, 75%)';
        if (rank === 3) return 'hsl(30, 100%, 50%)';
        return 'var(--text-secondary)';
    };

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.05
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, x: -20 },
        visible: {
            opacity: 1,
            x: 0,
            transition: {
                duration: 0.3,
                ease: 'easeOut'
            }
        }
    };

    return (
        <div className="leaderboard-page">
            <div className="leaderboard-container container">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="leaderboard-header"
                >
                    <div className="header-content">
                        <div className="header-icon">
                            <Trophy size={48} className="trophy-icon" />
                        </div>
                        <div className="header-text">
                            <h1 className="page-title">Leaderboard</h1>
                            <p className="page-subtitle">Compete with the best learners worldwide</p>
                        </div>
                    </div>
                </motion.div>

                {/* Filters */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                >
                    <Card className="filters-card">
                        <div className="filters-section">
                            <div className="filter-group">
                                <Filter size={20} />
                                <span className="filter-label">Time Period:</span>
                                <div className="filter-buttons">
                                    {['all-time', 'monthly', 'weekly'].map((filter) => (
                                        <Button
                                            key={filter}
                                            variant={timeFilter === filter ? 'primary' : 'ghost'}
                                            size="sm"
                                            onClick={() => setTimeFilter(filter)}
                                        >
                                            {filter === 'all-time' ? 'All Time' : filter.charAt(0).toUpperCase() + filter.slice(1)}
                                        </Button>
                                    ))}
                                </div>
                            </div>

                            <div className="filter-group">
                                <span className="filter-label">Category:</span>
                                <div className="filter-buttons">
                                    {['all', 'dsa', 'os', 'dbms'].map((filter) => (
                                        <Button
                                            key={filter}
                                            variant={categoryFilter === filter ? 'primary' : 'ghost'}
                                            size="sm"
                                            onClick={() => setCategoryFilter(filter)}
                                        >
                                            {filter === 'all' ? 'All' : filter.toUpperCase()}
                                        </Button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </Card>
                </motion.div>

                {/* Top 3 Podium */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="podium-section"
                >
                    <div className="podium">
                        {/* 2nd Place */}
                        <motion.div
                            initial={{ opacity: 0, y: 50 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.3 }}
                            className="podium-position second"
                        >
                            <Card className="podium-card">
                                <div className="podium-rank">🥈</div>
                                <div className="podium-avatar">{mockUsers[1].avatar}</div>
                                <div className="podium-username">{mockUsers[1].username}</div>
                                <div className="podium-score">{mockUsers[1].totalScore.toLocaleString()}</div>
                                <div className="podium-label">points</div>
                            </Card>
                        </motion.div>

                        {/* 1st Place */}
                        <motion.div
                            initial={{ opacity: 0, y: 50 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.4 }}
                            className="podium-position first"
                        >
                            <Card className="podium-card champion">
                                <div className="champion-crown">👑</div>
                                <div className="podium-rank">🥇</div>
                                <div className="podium-avatar champion-avatar">{mockUsers[0].avatar}</div>
                                <div className="podium-username">{mockUsers[0].username}</div>
                                <div className="podium-score">{mockUsers[0].totalScore.toLocaleString()}</div>
                                <div className="podium-label">points</div>
                            </Card>
                        </motion.div>

                        {/* 3rd Place */}
                        <motion.div
                            initial={{ opacity: 0, y: 50 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.5 }}
                            className="podium-position third"
                        >
                            <Card className="podium-card">
                                <div className="podium-rank">🥉</div>
                                <div className="podium-avatar">{mockUsers[2].avatar}</div>
                                <div className="podium-username">{mockUsers[2].username}</div>
                                <div className="podium-score">{mockUsers[2].totalScore.toLocaleString()}</div>
                                <div className="podium-label">points</div>
                            </Card>
                        </motion.div>
                    </div>
                </motion.div>

                {/* Rankings Table */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.6 }}
                >
                    <Card className="rankings-card">
                        <div className="rankings-header">
                            <h2 className="rankings-title">Top 10 Rankings</h2>
                        </div>

                        <motion.div
                            variants={containerVariants}
                            initial="hidden"
                            animate="visible"
                            className="rankings-list"
                        >
                            {mockUsers.map((userItem) => (
                                <motion.div
                                    key={userItem.id}
                                    variants={itemVariants}
                                    className="ranking-item"
                                >
                                    <div className="rank-section">
                                        {getRankIcon(userItem.rank)}
                                    </div>

                                    <div className="user-section">
                                        <div className="user-avatar" style={{
                                            background: `linear-gradient(135deg, var(--primary), var(--secondary))`
                                        }}>
                                            {userItem.avatar}
                                        </div>
                                        <div className="user-info">
                                            <div className="user-name">{userItem.username}</div>
                                            <div className="user-stats-mini">
                                                {userItem.quizzesTaken} quizzes • {userItem.accuracy}% accuracy
                                            </div>
                                        </div>
                                    </div>

                                    <div className="score-section">
                                        <div className="total-score">
                                            {userItem.totalScore.toLocaleString()}
                                            <span className="score-label">pts</span>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </motion.div>
                    </Card>
                </motion.div>

                {/* Current User Position */}
                {currentUserRank > 10 && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.8 }}
                    >
                        <Card className="current-user-card">
                            <div className="current-user-header">
                                <TrendingUp size={20} />
                                <span>Your Position</span>
                            </div>
                            <div className="ranking-item current">
                                <div className="rank-section">
                                    <span className="rank-number">#{currentUserData.rank}</span>
                                </div>

                                <div className="user-section">
                                    <div className="user-avatar current-avatar">
                                        {currentUserData.avatar}
                                    </div>
                                    <div className="user-info">
                                        <div className="user-name">{currentUserData.username} (You)</div>
                                        <div className="user-stats-mini">
                                            {currentUserData.quizzesTaken} quizzes • {currentUserData.accuracy}% accuracy
                                        </div>
                                    </div>
                                </div>

                                <div className="score-section">
                                    <div className="total-score">
                                        {currentUserData.totalScore.toLocaleString()}
                                        <span className="score-label">pts</span>
                                    </div>
                                </div>
                            </div>
                        </Card>
                    </motion.div>
                )}
            </div>
        </div>
    );
};

export default LeaderboardPage;
