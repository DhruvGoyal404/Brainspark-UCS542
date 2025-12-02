import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { Menu, X, Sun, Moon, LogOut, User, Settings } from 'lucide-react';
import Button from '../ui/Button';
import ConfirmationModal from '../ui/ConfirmationModal';
import './Header.css';

const Header = () => {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [userMenuOpen, setUserMenuOpen] = useState(false);
    const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
    const { user, logout, isAuthenticated } = useAuth();
    const { theme, toggleTheme } = useTheme();
    const navigate = useNavigate();

    const handleLogoutClick = () => {
        setShowLogoutConfirm(true);
        setUserMenuOpen(false);
        setMobileMenuOpen(false);
    };

    const confirmLogout = () => {
        logout();
        navigate('/');
    };

    const navLinks = user?.role === 'admin'
        ? [{ to: '/admin', label: 'Admin Panel' }]
        : [
            { to: '/dashboard', label: 'Dashboard', authRequired: true },
            { to: '/bookmarks', label: 'Bookmarks', authRequired: true },
            { to: '/leaderboard', label: 'Leaderboard', authRequired: true },
            { to: '/analytics', label: 'Analytics', authRequired: true }
        ];

    const closeMobileMenu = () => {
        setMobileMenuOpen(false);
    };

    return (
        <header className="header">
            <nav className="nav container">
                {/* Logo */}
                <Link to={isAuthenticated ? (user?.role === 'admin' ? '/admin' : '/dashboard') : '/'} className="logo">
                    <span className="logo-text">BrainSpark</span>
                </Link>

                {/* Desktop Navigation */}
                {isAuthenticated && (
                    <div className="nav-links desktop-only">
                        {navLinks.filter(link => !link.authRequired || isAuthenticated).map((link) => (
                            <Link
                                key={link.to}
                                to={link.to}
                                className="nav-link"
                                onClick={() => setUserMenuOpen(false)}
                            >
                                {link.label}
                            </Link>
                        ))}
                    </div>
                )}

                {/* Right Section */}
                <div className="nav-right">
                    {/* Theme Toggle */}
                    <button
                        className="icon-button"
                        onClick={toggleTheme}
                        aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
                    >
                        {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
                    </button>

                    {/* User Menu or Auth Buttons */}
                    {isAuthenticated ? (
                        <div className="user-menu-container">
                            <button
                                className="user-menu-button"
                                onClick={() => setUserMenuOpen(!userMenuOpen)}
                                aria-expanded={userMenuOpen}
                                aria-haspopup="true"
                            >
                                <div className="user-avatar">
                                    {user?.username?.charAt(0).toUpperCase() || 'U'}
                                </div>
                                <span className="user-name desktop-only">{user?.username}</span>
                            </button>

                            {userMenuOpen && (
                                <>
                                    <div
                                        className="dropdown-backdrop"
                                        onClick={() => setUserMenuOpen(false)}
                                    ></div>
                                    <div className="dropdown-menu">
                                        <div className="dropdown-header">
                                            <div className="dropdown-user-info">
                                                <div className="dropdown-username">{user?.username}</div>
                                                <div className="dropdown-email">{user?.email}</div>
                                            </div>
                                        </div>
                                        <div className="dropdown-divider"></div>
                                        <Link
                                            to="/profile"
                                            className="dropdown-item"
                                            onClick={() => setUserMenuOpen(false)}
                                        >
                                            <User size={18} />
                                            <span>Profile</span>
                                        </Link>
                                        <Link
                                            to="/settings"
                                            className="dropdown-item"
                                            onClick={() => setUserMenuOpen(false)}
                                        >
                                            <Settings size={18} />
                                            <span>Settings</span>
                                        </Link>
                                        <div className="dropdown-divider"></div>
                                        <button className="dropdown-item" onClick={handleLogoutClick}>
                                            <LogOut size={18} />
                                            <span>Logout</span>
                                        </button>
                                    </div>
                                </>
                            )}
                        </div>
                    ) : (
                        <div className="auth-buttons desktop-only">
                            <Button variant="ghost" onClick={() => navigate('/login')}>
                                Sign In
                            </Button>
                            <Button variant="primary" onClick={() => navigate('/register')}>
                                Get Started
                            </Button>
                        </div>
                    )}

                    {/* Mobile Menu Toggle */}
                    <button
                        className="mobile-menu-toggle mobile-only"
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        aria-label="Toggle menu"
                        aria-expanded={mobileMenuOpen}
                    >
                        {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>
            </nav>

            {/* Mobile Menu */}
            {mobileMenuOpen && (
                <>
                    <div
                        className="mobile-menu-backdrop"
                        onClick={closeMobileMenu}
                    ></div>
                    <div className="mobile-menu">
                        {isAuthenticated ? (
                            <>
                                {navLinks.map((link) => (
                                    <Link
                                        key={link.to}
                                        to={link.to}
                                        className="mobile-menu-link"
                                        onClick={closeMobileMenu}
                                    >
                                        {link.label}
                                    </Link>
                                ))}
                                <div className="mobile-menu-divider"></div>
                                <Link
                                    to="/profile"
                                    className="mobile-menu-link"
                                    onClick={closeMobileMenu}
                                >
                                    Profile
                                </Link>
                                <Link
                                    to="/settings"
                                    className="mobile-menu-link"
                                    onClick={closeMobileMenu}
                                >
                                    Settings
                                </Link>
                                <button className="mobile-menu-link" onClick={handleLogoutClick}>
                                    Logout
                                </button>
                            </>
                        ) : (
                            <>
                                <Button
                                    variant="ghost"
                                    fullWidth
                                    onClick={() => {
                                        navigate('/login');
                                        closeMobileMenu();
                                    }}
                                >
                                    Sign In
                                </Button>
                                <Button
                                    variant="primary"
                                    fullWidth
                                    onClick={() => {
                                        navigate('/register');
                                        closeMobileMenu();
                                    }}
                                >
                                    Get Started
                                </Button>
                            </>
                        )}
                    </div>
                </>
            )}

            {/* Logout Confirmation Modal */}
            <ConfirmationModal
                isOpen={showLogoutConfirm}
                onClose={() => setShowLogoutConfirm(false)}
                onConfirm={confirmLogout}
                title="Confirm Logout"
                message="Are you sure you want to log out? Your progress is saved."
                confirmText="Log Out"
                cancelText="Stay"
                variant="warning"
            />
        </header>
    );
};

export default Header;
