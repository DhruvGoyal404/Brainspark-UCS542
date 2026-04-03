import { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { User, Camera, Edit2, Settings as SettingsIcon, Lock } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import api from '../utils/api';
import './ProfilePage.css';

const ProfilePage = () => {
    const { user } = useAuth();
    const { fontSize, soundEnabled, reducedMotion, setFontSize, setSoundEnabled, setReducedMotion } = useTheme();
    const [isEditing, setIsEditing] = useState(false);
    const [statsData, setStatsData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => { window.scrollTo(0, 0); }, []);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await api.get('/user/stats');
                setStatsData(res.data.data);
            } catch (err) {
                console.warn('Could not load profile stats:', err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    // ── Activity calendar: build from real quiz history ──
    const activityData = useMemo(() => {
        const data = [];
        const today = new Date();
        const dateMap = {};

        if (statsData?.recentResults) {
            statsData.recentResults.forEach(r => {
                const d = new Date(r.createdAt).toISOString().split('T')[0];
                dateMap[d] = (dateMap[d] || 0) + 1;
            });
        }

        for (let i = 90; i >= 0; i--) {
            const d = new Date(today);
            d.setDate(d.getDate() - i);
            const dateStr = d.toISOString().split('T')[0];
            data.push({ date: dateStr, count: dateMap[dateStr] || 0 });
        }
        return data;
    }, [statsData]);

    const getActivityLevel = (count) => {
        if (count === 0) return 'activity-none';
        if (count <= 1) return 'activity-low';
        if (count <= 2) return 'activity-medium';
        if (count <= 3) return 'activity-high';
        return 'activity-very-high';
    };

    // ── Achievements from stats ──
    const achievements = statsData?.achievements || [
        { id: 'first_quiz', title: 'First Steps', description: 'Complete your first quiz', icon: '🎯', unlocked: false },
        { id: 'five_quizzes', title: 'Eager Learner', description: 'Complete 5 quizzes', icon: '📚', unlocked: false },
        { id: 'quiz_master', title: 'Quiz Master', description: 'Complete 50 quizzes', icon: '🏆', unlocked: false },
        { id: 'week_warrior', title: 'Week Warrior', description: '7-day streak', icon: '🔥', unlocked: false },
        { id: 'perfectionist', title: 'Perfectionist', description: 'Score 100%', icon: '⭐', unlocked: false },
        { id: 'xp_1k', title: 'First Thousand', description: 'Earn 1,000 XP', icon: '🥉', unlocked: false }
    ];

    const unlockedCount = achievements.filter(a => a.unlocked).length;

    const stats = [
        { label: 'Total XP', value: user?.stats?.currentXP || 0, icon: '⭐' },
        { label: 'Level', value: user?.stats?.level || 1, icon: '🎖️' },
        { label: 'Quizzes Taken', value: user?.stats?.totalQuizzes || 0, icon: '📝' },
        { label: 'Current Streak', value: `${user?.stats?.currentStreak || 0}d`, icon: '🔥' },
        { label: 'Longest Streak', value: `${user?.stats?.longestStreak || 0}d`, icon: '🏅' },
        { label: 'Achievements', value: `${unlockedCount}/${achievements.length}`, icon: '🏆' }
    ];

    return (
        <div className="profile-page">
            <div className="profile-container container">
                {/* Profile Header */}
                <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
                    <Card className="profile-header-card">
                        <div className="profile-header">
                            <div className="profile-avatar-section">
                                <div className="profile-avatar-wrapper">
                                    <div className="profile-avatar">
                                        {user?.username?.charAt(0).toUpperCase() || 'U'}
                                    </div>
                                    <button className="avatar-upload-button" aria-label="Change avatar">
                                        <Camera size={16} />
                                    </button>
                                </div>
                                <div className="profile-info">
                                    <h1 className="profile-username">{user?.username || 'User'}</h1>
                                    <p className="profile-email">{user?.email || 'user@example.com'}</p>
                                    <div className="profile-level">
                                        <span className="level-badge">Level {user?.stats?.level || 1}</span>
                                        <span className="xp-text">{user?.stats?.currentXP || 0} XP</span>
                                        {statsData?.averageScore > 0 && (
                                            <span className="xp-text" style={{ marginLeft: '8px', color: 'var(--success)' }}>
                                                {statsData.averageScore}% avg
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>
                            <Button variant="outline" icon={<Edit2 size={18} />} onClick={() => setIsEditing(!isEditing)}>
                                Edit Profile
                            </Button>
                        </div>
                    </Card>
                </motion.div>

                {/* Stats Grid */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }} className="stats-section">
                    <h2 className="section-title">Statistics</h2>
                    {loading ? (
                        <div style={{ display: 'flex', gap: '16px' }}>
                            {[...Array(6)].map((_, i) => (
                                <div key={i} style={{ flex: 1, height: '80px', background: 'var(--bg-secondary)', borderRadius: '12px', animation: 'pulse 1.5s infinite' }}></div>
                            ))}
                        </div>
                    ) : (
                        <div className="stats-grid">
                            {stats.map((stat, index) => (
                                <Card key={index} className="stat-card" hoverable>
                                    <div className="stat-icon">{stat.icon}</div>
                                    <div className="stat-content">
                                        <div className="stat-value">{stat.value}</div>
                                        <div className="stat-label">{stat.label}</div>
                                    </div>
                                </Card>
                            ))}
                        </div>
                    )}
                </motion.div>

                {/* Activity Calendar — from real history */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }}>
                    <Card className="activity-card">
                        <div className="activity-header">
                            <h2 className="section-title">Activity (Last 90 Days)</h2>
                            <div className="activity-legend">
                                <span>Less</span>
                                <div className="legend-squares">
                                    {['activity-none', 'activity-low', 'activity-medium', 'activity-high', 'activity-very-high'].map(cls => (
                                        <div key={cls} className={`legend-square ${cls}`}></div>
                                    ))}
                                </div>
                                <span>More</span>
                            </div>
                        </div>
                        <div className="activity-calendar">
                            {activityData.map((day, index) => (
                                <div
                                    key={index}
                                    className={`activity-day ${getActivityLevel(day.count)}`}
                                    title={`${day.date}: ${day.count} ${day.count === 1 ? 'quiz' : 'quizzes'}`}
                                ></div>
                            ))}
                        </div>
                    </Card>
                </motion.div>

                {/* Achievements — from API */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.3 }}>
                    <h2 className="section-title">Achievements ({unlockedCount}/{achievements.length} Unlocked)</h2>
                    <div className="achievements-grid">
                        {achievements.map((achievement) => (
                            <Card
                                key={achievement.id || achievement.achievementId}
                                className={`achievement-card ${!achievement.unlocked ? 'locked' : ''}`}
                                hoverable={achievement.unlocked}
                            >
                                <div className="achievement-icon">{achievement.icon}</div>
                                <div className="achievement-info">
                                    <h3 className="achievement-name">{achievement.title || achievement.achievementId}</h3>
                                    <p className="achievement-description">{achievement.description}</p>
                                    {achievement.unlocked && achievement.unlockedAt && (
                                        <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                                            ✓ {new Date(achievement.unlockedAt).toLocaleDateString()}
                                        </p>
                                    )}
                                </div>
                                {!achievement.unlocked && <div className="lock-overlay"><Lock size={20} /></div>}
                            </Card>
                        ))}
                    </div>
                </motion.div>

                {/* Recent Quiz History */}
                {statsData?.recentResults?.length > 0 && (
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.35 }}>
                        <Card className="settings-card">
                            <h2 className="section-title">Recent Activity</h2>
                            <div style={{ overflowX: 'auto' }}>
                                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
                                    <thead>
                                        <tr style={{ borderBottom: '1px solid var(--border)' }}>
                                            {['Quiz', 'Category', 'Score', 'XP Earned', 'Date'].map(h => (
                                                <th key={h} style={{ textAlign: 'left', padding: '10px 12px', color: 'var(--text-secondary)', fontWeight: 500 }}>{h}</th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {statsData.recentResults.slice(0, 10).map((r, i) => (
                                            <tr key={i} style={{ borderBottom: '1px solid var(--border-light)' }}>
                                                <td style={{ padding: '10px 12px', fontWeight: 500 }}>{r.quizTitle || r.quizId}</td>
                                                <td style={{ padding: '10px 12px', textTransform: 'capitalize' }}>{r.category?.replace(/-/g, ' ')}</td>
                                                <td style={{ padding: '10px 12px', fontWeight: 600, color: r.percentage >= 70 ? 'var(--success)' : 'var(--error)' }}>
                                                    {r.percentage}%
                                                </td>
                                                <td style={{ padding: '10px 12px', color: 'var(--primary)' }}>+{r.xpEarned} XP</td>
                                                <td style={{ padding: '10px 12px', color: 'var(--text-secondary)' }}>
                                                    {new Date(r.createdAt).toLocaleDateString()}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </Card>
                    </motion.div>
                )}

                {/* Preferences */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.4 }}>
                    <Card className="settings-card">
                        <div className="settings-header">
                            <SettingsIcon size={24} />
                            <h2 className="section-title">Preferences</h2>
                        </div>
                        <div className="settings-grid">
                            <div className="setting-item">
                                <div className="setting-info">
                                    <label htmlFor="font-size" className="setting-label">Font Size</label>
                                    <p className="setting-description">Adjust text size for better readability</p>
                                </div>
                                <select id="font-size" className="setting-select" value={fontSize} onChange={(e) => setFontSize(e.target.value)}>
                                    <option value="small">Small</option>
                                    <option value="medium">Medium</option>
                                    <option value="large">Large</option>
                                </select>
                            </div>

                            <div className="setting-item">
                                <div className="setting-info">
                                    <label htmlFor="sound" className="setting-label">Sound Effects</label>
                                    <p className="setting-description">Play sounds for quiz feedback</p>
                                </div>
                                <label className="toggle-switch">
                                    <input id="sound" type="checkbox" checked={soundEnabled} onChange={(e) => setSoundEnabled(e.target.checked)} />
                                    <span className="toggle-slider"></span>
                                </label>
                            </div>

                            <div className="setting-item">
                                <div className="setting-info">
                                    <label htmlFor="reduced-motion" className="setting-label">Reduced Motion</label>
                                    <p className="setting-description">Minimize animations for accessibility</p>
                                </div>
                                <label className="toggle-switch">
                                    <input id="reduced-motion" type="checkbox" checked={reducedMotion} onChange={(e) => setReducedMotion(e.target.checked)} />
                                    <span className="toggle-slider"></span>
                                </label>
                            </div>
                        </div>
                    </Card>
                </motion.div>
            </div>
        </div>
    );
};

export default ProfilePage;
