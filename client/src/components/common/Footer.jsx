import { Link } from 'react-router-dom';
import { Github, Twitter, Linkedin, Mail, Heart } from 'lucide-react';
import './Footer.css';

const Footer = () => {
    const currentYear = new Date().getFullYear();

    const footerLinks = {
        product: [
            { label: 'Features', to: '/#features' },
            { label: 'Quizzes', to: '/dashboard' },
            { label: 'Leaderboard', to: '/leaderboard' },
            { label: 'Analytics', to: '/analytics' },
        ],
        company: [
            { label: 'About', to: '/about' },
            { label: 'Blog', to: '/blog' },
            { label: 'Careers', to: '/careers' },
            { label: 'Contact', to: '/contact' },
        ],
        legal: [
            { label: 'Privacy Policy', to: '/privacy' },
            { label: 'Terms of Service', to: '/terms' },
            { label: 'Cookie Policy', to: '/cookies' },
        ],
    };

    const socialLinks = [
        { icon: Github, href: 'https://github.com', label: 'GitHub' },
        { icon: Twitter, href: 'https://twitter.com', label: 'Twitter' },
        { icon: Linkedin, href: 'https://linkedin.com', label: 'LinkedIn' },
        { icon: Mail, href: 'mailto:contact@brainspark.com', label: 'Email' },
    ];

    return (
        <footer className="footer">
            <div className="footer-container container">
                {/* Brand Section */}
                <div className="footer-brand">
                    <Link to="/" className="footer-logo">
                        <span className="logo-icon">🧠</span>
                        <span className="logo-text">BrainSpark</span>
                    </Link>
                    <p className="footer-tagline">
                        Ignite your learning journey with interactive quizzes and gamified education.
                    </p>
                    <div className="footer-social">
                        {socialLinks.map((social) => {
                            const Icon = social.icon;
                            return (
                                <a
                                    key={social.label}
                                    href={social.href}
                                    className="social-link"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    aria-label={social.label}
                                >
                                    <Icon size={20} />
                                </a>
                            );
                        })}
                    </div>
                </div>

                {/* Links Sections */}
                <div className="footer-links">
                    <div className="footer-column">
                        <h3 className="column-title">Product</h3>
                        <ul className="link-list">
                            {footerLinks.product.map((link) => (
                                <li key={link.label}>
                                    <Link to={link.to} className="footer-link">
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="footer-column">
                        <h3 className="column-title">Company</h3>
                        <ul className="link-list">
                            {footerLinks.company.map((link) => (
                                <li key={link.label}>
                                    <Link to={link.to} className="footer-link">
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="footer-column">
                        <h3 className="column-title">Legal</h3>
                        <ul className="link-list">
                            {footerLinks.legal.map((link) => (
                                <li key={link.label}>
                                    <Link to={link.to} className="footer-link">
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>

            {/* Bottom Bar */}
            <div className="footer-bottom">
                <div className="footer-container container">
                    <p className="copyright">
                        © {currentYear} BrainSpark. All rights reserved.
                    </p>
                    <p className="built-with">
                        Built with <Heart size={16} className="heart-icon" /> for learning
                    </p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
