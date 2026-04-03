import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Trophy, TrendingUp, Filter, RefreshCw } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import api from '../utils/api';
import './LeaderboardPage.css';

const LeaderboardPage = () => {
    const { user } = useAuth();
    const [timeFilter, setTimeFilter] = useState('all');
    const [categoryFilter, setCategoryFilter] = useState('all');

    const [leaderboard, setLeaderboard] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentUserRank, setCurrentUserRank] = useState(null);

    useEffect(() => { window.scrollTo(0, 0); }, []);

    const fetchLeaderboard = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const res = await api.get('/user/leaderboard', {
                params: { timeRange: timeFilter, category: categoryFilter }
            });
            setLeaderboard(res.data.data || []);

            // Find current user's rank
            const myEntry = (res.data.data || []).find(e => e.username === user?.username);
            setCurrentUserRank(myEntry ? myEntry.rank : res.data.currentUserRank);
        } catch (err) {
            setError('Failed to load leaderboard.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, [timeFilter, categoryFilter, user?.username]);

    useEffect(() => {
        fetchLeaderboard();
    }, [fetchLeaderboard]);

    const getRankIcon = (rank) => {
        if (rank === 1) return <span className="rank-medal gold">🥇</span>;
        if (rank === 2) return <span className="rank-medal silver">🥈</span>;
        if (rank === 3) return <span className="rank-medal bronze">🥉</span>;
        return <span className="rank-number">#{rank}</span>;
    };

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: 0.05 } }
    };

    const itemVariants = {
        hidden: { opacity: 0, x: -20 },
        visible: { opacity: 1, x: 0, transition: { duration: 0.3, ease: 'easeOut' } }
    };

    const top3 = leaderboard.slice(0, 3);
    const rest = leaderboard.slice(3);
    const isCurrentUser = (entry) => entry.username === user?.username;

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
                        <div className="header-icon"><Trophy size={48} className="trophy-icon" /></div>
                        <div className="header-text">
                            <h1 className="page-title">Leaderboard</h1>
                            <p className="page-subtitle">Compete with the best learners</p>
                        </div>
                    </div>
                    <button
                        onClick={fetchLeaderboard}
                        style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)' }}
                        title="Refresh"
                    >
                        <RefreshCw size={20} />
                    </button>
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
                                    {[['all', 'All Time'], ['weekly', 'Weekly'], ['monthly', 'Monthly']].map(([val, label]) => (
                                        <Button
                                            key={val}
                                            variant={timeFilter === val ? 'primary' : 'ghost'}
                                            size="sm"
                                            onClick={() => setTimeFilter(val)}
                                        >
                                            {label}
                                        </Button>
                                    ))}
                                </div>
                            </div>

                            <div className="filter-group">
                                <span className="filter-label">Category:</span>
                                <div className="filter-buttons">
                                    {[['all', 'All'], ['dsa', 'DSA'], ['operating-systems', 'OS'], ['dbms', 'DBMS'], ['networks', 'Networks']].map(([val, label]) => (
                                        <Button
                                            key={val}
                                            variant={categoryFilter === val ? 'primary' : 'ghost'}
                                            size="sm"
                                            onClick={() => setCategoryFilter(val)}
                                        >
                                            {label}
                                        </Button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </Card>
                </motion.div>

                {/* Loading / Error */}
                {loading ? (
                    <div style={{ display: 'flex', justifyContent: 'center', padding: '60px 0' }}>
                        <div className="spinner spinner-lg"></div>
                    </div>
                ) : error ? (
                    <Card style={{ textAlign: 'center', padding: '40px' }}>
                        <p style={{ color: 'var(--error)', marginBottom: '16px' }}>{error}</p>
                        <Button variant="primary" onClick={fetchLeaderboard}>Retry</Button>
                    </Card>
                ) : (
                    <>
                        {/* Top 3 Podium */}
                        {top3.length >= 3 && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.5, delay: 0.2 }}
                                className="podium-section"
                            >
                                <div className="podium">
                                    {/* 2nd Place */}
                                    <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="podium-position second">
                                        <Card className={`podium-card ${isCurrentUser(top3[1]) ? 'champion' : ''}`}>
                                            <div className="podium-rank">🥈</div>
                                            <div className="podium-avatar">{top3[1]?.username?.charAt(0).toUpperCase()}</div>
                                            <div className="podium-username">{top3[1]?.username}{isCurrentUser(top3[1]) && ' (You)'}</div>
                                            <div className="podium-score">{(top3[1]?.totalScore || 0).toLocaleString()}</div>
                                            <div className="podium-label">XP</div>
                                        </Card>
                                    </motion.div>

                                    {/* 1st Place */}
                                    <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="podium-position first">
                                        <Card className={`podium-card champion`}>
                                            <div className="champion-crown">👑</div>
                                            <div className="podium-rank">🥇</div>
                                            <div className="podium-avatar champion-avatar">{top3[0]?.username?.charAt(0).toUpperCase()}</div>
                                            <div className="podium-username">{top3[0]?.username}{isCurrentUser(top3[0]) && ' (You)'}</div>
                                            <div className="podium-score">{(top3[0]?.totalScore || 0).toLocaleString()}</div>
                                            <div className="podium-label">XP</div>
                                        </Card>
                                    </motion.div>

                                    {/* 3rd Place */}
                                    <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="podium-position third">
                                        <Card className={`podium-card ${isCurrentUser(top3[2]) ? 'champion' : ''}`}>
                                            <div className="podium-rank">🥉</div>
                                            <div className="podium-avatar">{top3[2]?.username?.charAt(0).toUpperCase()}</div>
                                            <div className="podium-username">{top3[2]?.username}{isCurrentUser(top3[2]) && ' (You)'}</div>
                                            <div className="podium-score">{(top3[2]?.totalScore || 0).toLocaleString()}</div>
                                            <div className="podium-label">XP</div>
                                        </Card>
                                    </motion.div>
                                </div>
                            </motion.div>
                        )}

                        {/* Rankings Table */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.6 }}
                        >
                            <Card className="rankings-card">
                                <div className="rankings-header">
                                    <h2 className="rankings-title">
                                        {leaderboard.length > 0 ? `Top ${Math.min(leaderboard.length, 100)} Rankings` : 'Rankings'}
                                    </h2>
                                </div>

                                {leaderboard.length === 0 ? (
                                    <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-secondary)' }}>
                                        <p>No results yet for this filter. Start taking quizzes! 🚀</p>
                                    </div>
                                ) : (
                                    <motion.div
                                        variants={containerVariants}
                                        initial="hidden"
                                        animate="visible"
                                        className="rankings-list"
                                    >
                                        {leaderboard.map((entry) => (
                                            <motion.div
                                                key={entry.username}
                                                variants={itemVariants}
                                                className={`ranking-item ${isCurrentUser(entry) ? 'current' : ''}`}
                                            >
                                                <div className="rank-section">{getRankIcon(entry.rank)}</div>

                                                <div className="user-section">
                                                    <div className="user-avatar" style={{ background: isCurrentUser(entry) ? 'linear-gradient(135deg, var(--warning), var(--secondary))' : 'linear-gradient(135deg, var(--primary), var(--secondary))' }}>
                                                        {entry.username?.charAt(0).toUpperCase()}
                                                    </div>
                                                    <div className="user-info">
                                                        <div className="user-name">
                                                            {entry.username}
                                                            {isCurrentUser(entry) && <span style={{ fontSize: '0.75rem', color: 'var(--primary)', marginLeft: '6px' }}>(You)</span>}
                                                        </div>
                                                        <div className="user-stats-mini">
                                                            Lv.{entry.level || 1} • {entry.quizzesTaken} quizzes • {entry.currentStreak || 0}🔥
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="score-section">
                                                    <div className="total-score">
                                                        {(entry.totalScore || 0).toLocaleString()}
                                                        <span className="score-label">XP</span>
                                                    </div>
                                                </div>
                                            </motion.div>
                                        ))}
                                    </motion.div>
                                )}
                            </Card>
                        </motion.div>

                        {/* Current User Card (if not in top results) */}
                        {currentUserRank && currentUserRank > leaderboard.length && (
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
                                        <div className="rank-section"><span className="rank-number">#{currentUserRank}</span></div>
                                        <div className="user-section">
                                            <div className="user-avatar current-avatar">{user?.username?.charAt(0).toUpperCase()}</div>
                                            <div className="user-info">
                                                <div className="user-name">{user?.username} (You)</div>
                                                <div className="user-stats-mini">{user?.stats?.totalQuizzes || 0} quizzes • Lv.{user?.stats?.level || 1}</div>
                                            </div>
                                        </div>
                                        <div className="score-section">
                                            <div className="total-score">{(user?.stats?.currentXP || 0).toLocaleString()}<span className="score-label">XP</span></div>
                                        </div>
                                    </div>
                                </Card>
                            </motion.div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default LeaderboardPage;
