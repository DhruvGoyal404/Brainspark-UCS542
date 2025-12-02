import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { User, Mail, Calendar, Trophy, Award, Settings as SettingsIcon, Edit2, Camera } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import './ProfilePage.css';

const ProfilePage = () => {
    const { user, updateUser } = useAuth();
    const { theme, fontSize, soundEnabled, reducedMotion, setFontSize, setSoundEnabled, setReducedMotion } = useTheme();
    const [isEditing, setIsEditing] = useState(false);

    // Scroll to top on page load
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    // Mock achievements
    const achievements = [
        { id: 1, name: 'First Quiz', description: 'Complete your first quiz', icon: '🎯', unlocked: true },
        { id: 2, name: 'Week Warrior', description: '7-day streak', icon: '🔥', unlocked: true },
        { id: 3, name: 'Perfect Score', description: 'Score 100% on a quiz', icon: '⭐', unlocked: false },
        { id: 4, name: 'Quiz Master', description: 'Complete 50 quizzes', icon: '🏆', unlocked: false },
        { id: 5, name: 'Eager Learner', description: 'Complete 10 quizzes', icon: '📚', unlocked: true },
        { id: 6, name: 'Perfectionist', description: 'Score 100% five times', icon: '💯', unlocked: false }
    ];

    // Mock activity data for calendar (GitHub-style)
    const generateActivityData = () => {
        const data = [];
        const today = new Date();

        for (let i = 364; i >= 0; i--) {
            const date = new Date(today);
            date.setDate(date.getDate() - i);
            const dateStr = date.toISOString().split('T')[0];
            const count = Math.random() > 0.6 ? Math.floor(Math.random() * 5) : 0;
            data.push({ date: dateStr, count });
        }

        return data;
    };

    const activityData = generateActivityData();

    const getActivityLevel = (count) => {
        if (count === 0) return 'activity-none';
        if (count <= 1) return 'activity-low';
        if (count <= 2) return 'activity-medium';
        if (count <= 3) return 'activity-high';
        return 'activity-very-high';
    };

    const stats = [
        { label: 'Total XP', value: user?.stats?.currentXP || 0, icon: '⭐' },
        { label: 'Level', value: user?.stats?.level || 1, icon: '🎖️' },
        { label: 'Quizzes Taken', value: user?.stats?.totalQuizzes || 0, icon: '📝' },
        { label: 'Current Streak', value: user?.stats?.currentStreak || 0, icon: '🔥' },
        { label: 'Longest Streak', value: user?.stats?.longestStreak || 0, icon: '🏅' },
        { label: 'Achievements', value: achievements.filter(a => a.unlocked).length, icon: '🏆' }
    ];

    return (
        <div className="profile-page">
            <div className="profile-container container">
                {/* Profile Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
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
                                    </div>
                                </div>
                            </div>
                            <Button
                                variant="outline"
                                icon={<Edit2 size={18} />}
                                onClick={() => setIsEditing(!isEditing)}
                            >
                                Edit Profile
                            </Button>
                        </div>
                    </Card>
                </motion.div>

                {/* Stats Grid */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                    className="stats-section"
                >
                    <h2 className="section-title">Statistics</h2>
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
                </motion.div>

                {/* Activity Calendar */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                >
                    <Card className="activity-card">
                        <div className="activity-header">
                            <h2 className="section-title">Activity Streak</h2>
                            <div className="activity-legend">
                                <span>Less</span>
                                <div className="legend-squares">
                                    <div className="legend-square activity-none"></div>
                                    <div className="legend-square activity-low"></div>
                                    <div className="legend-square activity-medium"></div>
                                    <div className="legend-square activity-high"></div>
                                    <div className="legend-square activity-very-high"></div>
                                </div>
                                <span>More</span>
                            </div>
                        </div>
                        <div className="activity-calendar">
                            {activityData.slice(-91).map((day, index) => (
                                <div
                                    key={index}
                                    className={`activity-day ${getActivityLevel(day.count)}`}
                                    title={`${day.date}: ${day.count} ${day.count === 1 ? 'quiz' : 'quizzes'}`}
                                ></div>
                            ))}
                        </div>
                    </Card>
                </motion.div>

                {/* Achievements */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                >
                    <h2 className="section-title">Achievements</h2>
                    <div className="achievements-grid">
                        {achievements.map((achievement) => (
                            <Card
                                key={achievement.id}
                                className={`achievement-card ${!achievement.unlocked ? 'locked' : ''}`}
                                hoverable={achievement.unlocked}
                            >
                                <div className="achievement-icon">{achievement.icon}</div>
                                <div className="achievement-info">
                                    <h3 className="achievement-name">{achievement.name}</h3>
                                    <p className="achievement-description">{achievement.description}</p>
                                </div>
                                {!achievement.unlocked && <div className="lock-overlay">🔒</div>}
                            </Card>
                        ))}
                    </div>
                </motion.div>

                {/* Settings */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                >
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
                                <select
                                    id="font-size"
                                    className="setting-select"
                                    value={fontSize}
                                    onChange={(e) => setFontSize(e.target.value)}
                                >
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
                                    <input
                                        id="sound"
                                        type="checkbox"
                                        checked={soundEnabled}
                                        onChange={(e) => setSoundEnabled(e.target.checked)}
                                    />
                                    <span className="toggle-slider"></span>
                                </label>
                            </div>

                            <div className="setting-item">
                                <div className="setting-info">
                                    <label htmlFor="reduced-motion" className="setting-label">Reduced Motion</label>
                                    <p className="setting-description">Minimize animations for accessibility</p>
                                </div>
                                <label className="toggle-switch">
                                    <input
                                        id="reduced-motion"
                                        type="checkbox"
                                        checked={reducedMotion}
                                        onChange={(e) => setReducedMotion(e.target.checked)}
                                    />
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
