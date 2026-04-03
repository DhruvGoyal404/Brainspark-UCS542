import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { Bell, User, Shield, Palette, Accessibility, CheckCircle } from 'lucide-react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import './SettingsPage.css';

const SettingsPage = () => {
    const { user } = useAuth();
    const { theme, toggleTheme, fontSize, setFontSize, soundEnabled, setSoundEnabled, reducedMotion, setReducedMotion } = useTheme();
    const [saved, setSaved] = useState(false);
    const [localNotifications, setLocalNotifications] = useState({ email: true, push: false });

    // Scroll to top on page load
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

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
                                <Button variant="outline" size="sm">Edit Profile</Button>
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
                                            onChange={() => setLocalNotifications(p => ({ ...p, email: !p.email }))}
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
                                            onChange={() => setLocalNotifications(p => ({ ...p, push: !p.push }))}
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
                                <Button variant="outline" fullWidth>Change Password</Button>
                                <Button variant="outline" fullWidth>Download My Data</Button>
                                <Button variant="danger" fullWidth>Delete Account</Button>
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
