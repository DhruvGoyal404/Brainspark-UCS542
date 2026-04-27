import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useToast } from '../components/ui/Toast';
import { Bell, User, Shield, Palette, Accessibility, CheckCircle, Eye, EyeOff } from 'lucide-react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import api from '../utils/api';
import './SettingsPage.css';

const SettingsPage = () => {
    const { user, changePassword } = useAuth();
    const navigate = useNavigate();
    const toast = useToast();
    const { theme, toggleTheme, fontSize, setFontSize, soundEnabled, setSoundEnabled, reducedMotion, setReducedMotion } = useTheme();
    const [saved, setSaved] = useState(false);
    const [localNotifications, setLocalNotifications] = useState({
        email: user?.preferences?.emailNotifications ?? true,
        push:  user?.preferences?.pushNotifications  ?? false
    });
    const [showPwForm, setShowPwForm] = useState(false);
    const [pwForm, setPwForm] = useState({ current: '', next: '', confirm: '' });
    const [pwLoading, setPwLoading] = useState(false);
    const [showPw, setShowPw] = useState(false);

    useEffect(() => { window.scrollTo(0, 0); }, []);

    const handleNotificationToggle = async (key, value) => {
        setLocalNotifications(p => ({ ...p, [key]: value }));
        try {
            await api.put('/user/preferences', {
                emailNotifications: key === 'email' ? value : localNotifications.email,
                pushNotifications:  key === 'push'  ? value : localNotifications.push
            });
        } catch {
            toast.error('Failed to save notification preference');
            setLocalNotifications(p => ({ ...p, [key]: !value }));
        }
    };

    const handleChangePassword = async (e) => {
        e.preventDefault();
        if (pwForm.next !== pwForm.confirm) {
            toast.error('New passwords do not match');
            return;
        }
        if (pwForm.next.length < 6) {
            toast.error('New password must be at least 6 characters');
            return;
        }
        setPwLoading(true);
        const result = await changePassword(pwForm.current, pwForm.next);
        setPwLoading(false);
        if (result.success) {
            toast.success('Password changed — you have been logged out');
        } else {
            toast.error(result.message || 'Failed to change password');
        }
    };

    return (
        <main className="settings-page">
            <div className="settings-container container">
                <motion.header
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="settings-header"
                >
                    <h1 className="settings-title">Settings</h1>
                    <p className="settings-subtitle">Manage your account preferences and settings</p>
                </motion.header>

                <div className="settings-grid">
                    {/* Account Settings */}
                    <motion.section
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                    >
                        <Card>
                            <div className="setting-section">
                                <div className="setting-section-header">
                                    <User size={24} />
                                    <h2>Account</h2>
                                </div>
                                <div className="setting-item">
                                    <div className="setting-info">
                                        <h3>Username</h3>
                                        <p>{user?.username || 'Not set'}</p>
                                    </div>
                                </div>
                                <div className="setting-item">
                                    <div className="setting-info">
                                        <h3>Email</h3>
                                        <p>{user?.email || 'Not set'}</p>
                                    </div>
                                </div>
                                <Button variant="outline" size="sm" onClick={() => navigate('/profile')}>Edit Profile</Button>
                            </div>
                        </Card>
                    </motion.section>

                    {/* Appearance Settings */}
                    <motion.section
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                    >
                        <Card>
                            <div className="setting-section">
                                <div className="setting-section-header">
                                    <Palette size={24} />
                                    <h2>Appearance</h2>
                                </div>
                                <div className="setting-item">
                                    <div className="setting-info">
                                        <h3>Theme</h3>
                                        <p>Choose your preferred color scheme</p>
                                    </div>
                                    <button
                                        className="toggle-button"
                                        onClick={toggleTheme}
                                        aria-label="Toggle theme"
                                    >
                                        {theme === 'dark' ? '🌙 Dark' : '☀️ Light'}
                                    </button>
                                </div>
                                <div className="setting-item">
                                    <div className="setting-info">
                                        <h3>Font Size</h3>
                                        <p>Adjust text size for readability</p>
                                    </div>
                                    <select
                                        value={fontSize}
                                        onChange={(e) => setFontSize(e.target.value)}
                                        className="setting-select"
                                    >
                                        <option value="small">Small</option>
                                        <option value="medium">Medium</option>
                                        <option value="large">Large</option>
                                    </select>
                                </div>
                            </div>
                        </Card>
                    </motion.section>

                    {/* Notifications */}
                    <motion.section
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.3 }}
                    >
                        <Card>
                            <div className="setting-section">
                                <div className="setting-section-header">
                                    <Bell size={24} />
                                    <h2>Notifications</h2>
                                </div>
                                <div className="setting-item">
                                    <div className="setting-info">
                                        <h3>Email Notifications</h3>
                                        <p>Receive updates via email</p>
                                    </div>
                                    <label className="toggle-switch">
                                        <input
                                            type="checkbox"
                                            checked={localNotifications.email}
                                            onChange={e => handleNotificationToggle('email', e.target.checked)}
                                        />
                                        <span className="toggle-slider"></span>
                                    </label>
                                </div>
                                <div className="setting-item">
                                    <div className="setting-info">
                                        <h3>Push Notifications</h3>
                                        <p>Get notified about new features</p>
                                    </div>
                                    <label className="toggle-switch">
                                        <input
                                            type="checkbox"
                                            checked={localNotifications.push}
                                            onChange={e => handleNotificationToggle('push', e.target.checked)}
                                        />
                                        <span className="toggle-slider"></span>
                                    </label>
                                </div>
                            </div>
                        </Card>
                    </motion.section>

                    {/* Accessibility */}
                    <motion.section
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.4 }}
                    >
                        <Card>
                            <div className="setting-section">
                                <div className="setting-section-header">
                                    <Accessibility size={24} />
                                    <h2>Accessibility</h2>
                                </div>
                                <div className="setting-item">
                                    <div className="setting-info">
                                        <h3>Sound Effects</h3>
                                        <p>Play sounds for actions</p>
                                    </div>
                                    <label className="toggle-switch">
                                        <input
                                            type="checkbox"
                                            checked={soundEnabled}
                                            onChange={(e) => setSoundEnabled(e.target.checked)}
                                        />
                                        <span className="toggle-slider"></span>
                                    </label>
                                </div>
                                <div className="setting-item">
                                    <div className="setting-info">
                                        <h3>Reduced Motion</h3>
                                        <p>Minimize animations</p>
                                    </div>
                                    <label className="toggle-switch">
                                        <input
                                            type="checkbox"
                                            checked={reducedMotion}
                                            onChange={(e) => setReducedMotion(e.target.checked)}
                                        />
                                        <span className="toggle-slider"></span>
                                    </label>
                                </div>
                            </div>
                        </Card>
                    </motion.section>

                    {/* Privacy & Security */}
                    <motion.section
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.5 }}
                    >
                        <Card>
                            <div className="setting-section">
                                <div className="setting-section-header">
                                    <Shield size={24} />
                                    <h2>Privacy & Security</h2>
                                </div>
                                <Button variant="outline" fullWidth onClick={() => setShowPwForm(p => !p)}>
                                    {showPwForm ? 'Cancel' : 'Change Password'}
                                </Button>
                                {showPwForm && (
                                    <form onSubmit={handleChangePassword} style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '8px' }}>
                                        <div style={{ position: 'relative' }}>
                                            <input
                                                type={showPw ? 'text' : 'password'}
                                                placeholder="Current password"
                                                value={pwForm.current}
                                                onChange={e => setPwForm(f => ({ ...f, current: e.target.value }))}
                                                style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid var(--border)', background: 'var(--bg-secondary)', color: 'var(--text-primary)', fontSize: '14px', boxSizing: 'border-box' }}
                                            />
                                        </div>
                                        <input
                                            type={showPw ? 'text' : 'password'}
                                            placeholder="New password"
                                            value={pwForm.next}
                                            onChange={e => setPwForm(f => ({ ...f, next: e.target.value }))}
                                            style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid var(--border)', background: 'var(--bg-secondary)', color: 'var(--text-primary)', fontSize: '14px', boxSizing: 'border-box' }}
                                        />
                                        <input
                                            type={showPw ? 'text' : 'password'}
                                            placeholder="Confirm new password"
                                            value={pwForm.confirm}
                                            onChange={e => setPwForm(f => ({ ...f, confirm: e.target.value }))}
                                            style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid var(--border)', background: 'var(--bg-secondary)', color: 'var(--text-primary)', fontSize: '14px', boxSizing: 'border-box' }}
                                        />
                                        <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', cursor: 'pointer' }}>
                                            <input type="checkbox" checked={showPw} onChange={e => setShowPw(e.target.checked)} />
                                            Show passwords
                                        </label>
                                        <Button type="submit" variant="primary" fullWidth loading={pwLoading}>Update Password</Button>
                                    </form>
                                )}
                            </div>
                        </Card>
                    </motion.section>
                </div>

                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.6 }}
                    className="settings-footer"
                >
                    {saved && (
                        <span style={{ color: 'var(--success)', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.875rem' }}>
                            <CheckCircle size={16} /> Preferences saved automatically
                        </span>
                    )}
                    <Button variant="primary" onClick={() => { setFontSize(fontSize); setSaved(true); setTimeout(() => setSaved(false), 2000); }}>Save Changes</Button>
                    <Button variant="ghost" onClick={() => { setFontSize('medium'); setSoundEnabled(true); setReducedMotion(false); }}>Reset to Defaults</Button>
                </motion.div>
            </div>
        </main>
    );
};

export default SettingsPage;
