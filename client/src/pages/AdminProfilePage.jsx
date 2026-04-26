import { useState, useEffect, useRef } from 'react';
import api from '../utils/api';
import { motion } from 'framer-motion';
import { Shield, Settings as SettingsIcon, Edit2, Camera, Calendar, Check, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useToast } from '../components/ui/Toast';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import './AdminProfilePage.css';

const AdminProfilePage = () => {
    const { user, updateUser, refreshUser } = useAuth();
    const { fontSize, soundEnabled, reducedMotion, setFontSize, setSoundEnabled, setReducedMotion } = useTheme();
    const toast = useToast();
    const fileInputRef = useRef(null);

    const [isEditing, setIsEditing] = useState(false);
    const [editForm, setEditForm] = useState({ username: '', email: '' });
    const [saving, setSaving] = useState(false);
    const [avatarUploading, setAvatarUploading] = useState(false);
    const [analyticsData, setAnalyticsData] = useState(null);

    useEffect(() => {
        api.get('/admin/analytics')
            .then(res => setAnalyticsData(res.data.data))
            .catch(() => {});
    }, []);

    const handleEditOpen = () => {
        setEditForm({ username: user?.username || '', email: user?.email || '' });
        setIsEditing(true);
    };

    const handleEditSave = async () => {
        setSaving(true);
        const result = await updateUser(editForm);
        setSaving(false);
        if (result.success) {
            toast.success('Profile updated');
            setIsEditing(false);
        } else {
            toast.error(result.error || 'Failed to update profile');
        }
    };

    const handleAvatarClick = () => fileInputRef.current?.click();

    const handleAvatarChange = async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;
        if (file.size > 5 * 1024 * 1024) {
            toast.error('Image must be under 5MB');
            return;
        }
        const formData = new FormData();
        formData.append('avatar', file);
        setAvatarUploading(true);
        try {
            await api.post('/user/avatar', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
            await refreshUser();
            toast.success('Avatar updated');
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to upload avatar');
        } finally {
            setAvatarUploading(false);
            e.target.value = '';
        }
    };

    const stats = [
        { label: 'Total Users',    value: analyticsData ? analyticsData.totalUsers.toLocaleString()   : '—', icon: '👥' },
        { label: 'Active Quizzes', value: analyticsData ? analyticsData.totalQuizzes.toLocaleString() : '—', icon: '📝' },
        { label: 'Total Results',  value: analyticsData ? analyticsData.totalResults.toLocaleString() : '—', icon: '❓' },
        { label: 'Admin Since',    value: new Date(user?.createdAt || Date.now()).toLocaleDateString(), icon: '📅' }
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
                                    <div className="admin-profile-avatar" style={{ overflow: 'hidden' }}>
                                        {user?.avatar
                                            ? <img src={user.avatar} alt="avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                            : (user?.username?.charAt(0).toUpperCase() || 'A')
                                        }
                                    </div>
                                    <button
                                        className="admin-avatar-upload-button"
                                        aria-label="Change avatar"
                                        onClick={handleAvatarClick}
                                        disabled={avatarUploading}
                                    >
                                        <Camera size={16} />
                                    </button>
                                    <input
                                        ref={fileInputRef}
                                        type="file"
                                        accept="image/*"
                                        style={{ display: 'none' }}
                                        onChange={handleAvatarChange}
                                    />
                                </div>
                                <div className="admin-profile-info">
                                    <div className="admin-badge-large">
                                        <Shield size={20} />
                                        <span>Administrator</span>
                                    </div>
                                    {isEditing ? (
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '8px' }}>
                                            <input
                                                value={editForm.username}
                                                onChange={e => setEditForm(f => ({ ...f, username: e.target.value }))}
                                                placeholder="Username"
                                                style={{ padding: '8px 12px', borderRadius: '8px', border: '1px solid var(--border)', background: 'var(--bg-secondary)', color: 'var(--text-primary)', fontSize: '14px' }}
                                            />
                                            <input
                                                value={editForm.email}
                                                onChange={e => setEditForm(f => ({ ...f, email: e.target.value }))}
                                                placeholder="Email"
                                                type="email"
                                                style={{ padding: '8px 12px', borderRadius: '8px', border: '1px solid var(--border)', background: 'var(--bg-secondary)', color: 'var(--text-primary)', fontSize: '14px' }}
                                            />
                                            <div style={{ display: 'flex', gap: '8px' }}>
                                                <Button variant="primary" size="sm" onClick={handleEditSave} loading={saving} icon={<Check size={14} />}>Save</Button>
                                                <Button variant="ghost" size="sm" onClick={() => setIsEditing(false)} icon={<X size={14} />}>Cancel</Button>
                                            </div>
                                        </div>
                                    ) : (
                                        <>
                                            <h1 className="admin-profile-username">{user?.username || 'Admin'}</h1>
                                            <p className="admin-profile-email">{user?.email || 'admin@example.com'}</p>
                                            <div className="admin-profile-meta">
                                                <span className="meta-item">
                                                    <Calendar size={14} />
                                                    Joined {new Date(user?.createdAt || Date.now()).toLocaleDateString()}
                                                </span>
                                            </div>
                                        </>
                                    )}
                                </div>
                            </div>
                            {!isEditing && (
                                <Button
                                    variant="outline"
                                    icon={<Edit2 size={18} />}
                                    onClick={handleEditOpen}
                                >
                                    Edit Profile
                                </Button>
                            )}
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
