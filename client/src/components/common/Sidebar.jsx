import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { Home, BookOpen, Trophy, BarChart3, User, Settings, X, Menu } from 'lucide-react';
import './Sidebar.css';

const Sidebar = ({ isOpen = true, onToggle }) => {
    const [isMobileOpen, setIsMobileOpen] = useState(false);

    const navItems = [
        { to: '/dashboard', icon: Home, label: 'Dashboard' },
        { to: '/quiz', icon: BookOpen, label: 'Quizzes' },
        { to: '/leaderboard', icon: Trophy, label: 'Leaderboard' },
        { to: '/analytics', icon: BarChart3, label: 'Analytics' },
        { to: '/profile', icon: User, label: 'Profile' },
    ];

    const toggleMobile = () => setIsMobileOpen(!isMobileOpen);

    return (
        <>
            {/* Mobile Menu Button */}
            <button className="sidebar-mobile-toggle" onClick={toggleMobile} aria-label="Toggle menu">
                {isMobileOpen ? <X size={24} /> : <Menu size={24} />}
            </button>

            {/* Sidebar */}
            <aside className={`sidebar ${isOpen ? 'open' : 'closed'} ${isMobileOpen ? 'mobile-open' : ''}`}>
                <nav className="sidebar-nav" role="navigation">
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        return (
                            <NavLink
                                key={item.to}
                                to={item.to}
                                className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
                                onClick={() => setIsMobileOpen(false)}
                            >
                                <Icon size={20} className="nav-icon" />
                                <span className="nav-label">{item.label}</span>
                            </NavLink>
                        );
                    })}
                </nav>

                <div className="sidebar-footer">
                    <NavLink
                        to="/profile"
                        className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
                        onClick={() => setIsMobileOpen(false)}
                    >
                        <Settings size={20} className="nav-icon" />
                        <span className="nav-label">Settings</span>
                    </NavLink>
                </div>
            </aside>

            {/* Mobile Overlay */}
            {isMobileOpen && (
                <div className="sidebar-overlay" onClick={toggleMobile} />
            )}
        </>
    );
};

export default Sidebar;
