import { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Mail, Shield, Settings as SettingsIcon, Edit2, Camera, Calendar } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import './AdminProfilePage.css';

const AdminProfilePage = () => {
    const { user, updateUser } = useAuth();
    const { theme, fontSize, soundEnabled, reducedMotion, setFontSize, setSoundEnabled, setReducedMotion } = useTheme();
    const [isEditing, setIsEditing] = useState(false);

    const stats = [
        { label: 'Total Users', value: '1,234', icon: '👥' },
        { label: 'Active Quizzes', value: '89', icon: '📝' },
        { label: 'Total Questions', value: '2,456', icon: '❓' },
        { label: 'Admin Since', value: new Date(user?.createdAt || Date.now()).toLocaleDateString(), icon: '📅' }
    ];

    return (
        <div className="admin-profile-page">
            <div className="admin-profile-container container">
                {/* Profile Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <Card className="admin-profile-header-card">
                        <div className="admin-profile-header">
                            <div className="admin-profile-avatar-section">
                                <div className="admin-profile-avatar-wrapper">
                                    <div className="admin-profile-avatar">
                                        {user?.username?.charAt(0).toUpperCase() || 'A'}
                                    </div>
                                    <button className="admin-avatar-upload-button" aria-label="Change avatar">
                                        <Camera size={16} />
                                    </button>
                                </div>
                                <div className="admin-profile-info">
                                    <div className="admin-badge-large">
                                        <Shield size={20} />
                                        <span>Administrator</span>
                                    </div>
                                    <h1 className="admin-profile-username">{user?.username || 'Admin'}</h1>
                                    <p className="admin-profile-email">{user?.email || 'admin@example.com'}</p>
                                    <div className="admin-profile-meta">
                                        <span className="meta-item">
                                            <Calendar size={14} />
                                            Joined {new Date(user?.createdAt || Date.now()).toLocaleDateString()}
                                        </span>
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
                    className="admin-stats-section"
                >
                    <h2 className="section-title">Overview</h2>
                    <div className="admin-stats-grid">
                        {stats.map((stat, index) => (
                            <Card key={index} className="admin-stat-card" hoverable>
                                <div className="stat-icon">{stat.icon}</div>
                                <div className="stat-content">
                                    <div className="stat-value">{stat.value}</div>
                                    <div className="stat-label">{stat.label}</div>
                                </div>
                            </Card>
                        ))}
                    </div>
                </motion.div>

                {/* Admin Controls */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                >
                    <Card className="admin-controls-card">
                        <div className="admin-controls-header">
                            <Shield size={24} />
                            <h2 className="section-title">Admin Permissions</h2>
                        </div>

                        <div className="permissions-grid">
                            <div className="permission-item active">
                                <div className="permission-icon">✅</div>
                                <div className="permission-details">
                                    <h3>User Management</h3>
                                    <p>Full control over user accounts and permissions</p>
                                </div>
                            </div>
                            <div className="permission-item active">
                                <div className="permission-icon">✅</div>
                                <div className="permission-details">
                                    <h3>Quiz Creation</h3>
                                    <p>Create, edit, and manage quiz content</p>
                                </div>
                            </div>
                            <div className="permission-item active">
                                <div className="permission-icon">✅</div>
                                <div className="permission-details">
                                    <h3>Question Bank</h3>
                                    <p>Manage and organize question database</p>
                                </div>
                            </div>
                            <div className="permission-item active">
                                <div className="permission-icon">✅</div>
                                <div className="permission-details">
                                    <h3>Analytics Access</h3>
                                    <p>View comprehensive platform analytics</p>
                                </div>
                            </div>
                        </div>
                    </Card>
                </motion.div>

                {/* Settings */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                >
                    <Card className="admin-settings-card">
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

export default AdminProfilePage;
