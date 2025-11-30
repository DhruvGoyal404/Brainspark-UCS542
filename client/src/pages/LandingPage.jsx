import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Sparkles, Trophy, Target, Zap, Users, Brain } from 'lucide-react';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import './LandingPage.css';

const LandingPage = () => {
    const navigate = useNavigate();

    const features = [
        {
            icon: <Brain size={32} />,
            title: 'Smart Learning',
            description: 'Adaptive difficulty that grows with your knowledge'
        },
        {
            icon: <Zap size={32} />,
            title: 'Instant Feedback',
            description: 'Get immediate explanations for every answer'
        },
        {
            icon: <Trophy size={32} />,
            title: 'Achievements',
            description: 'Unlock badges and track your progress'
        },
        {
            icon: <Target size={32} />,
            title: 'Daily Streaks',
            description: 'Build consistent learning habits'
        },
        {
            icon: <Users size={32} />,
            title: 'Leaderboards',
            description: 'Compete with learners worldwide'
        },
        {
            icon: <Sparkles size={32} />,
            title: 'Gamification',
            description: 'Earn XP, level up, and celebrate wins'
        }
    ];

    const stats = [
        { value: '10,000+', label: 'Active Learners' },
        { value: '50+', label: 'Quiz Categories' },
        { value: '500+', label: 'Questions' },
        { value: '95%', label: 'Success Rate' }
    ];

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.5,
                ease: 'easeOut'
            }
        }
    };

    return (
        <div className="landing-page">
            {/* Hero Section */}
            <section className="hero">
                <div className="hero-background"></div>
                <div className="hero-content container">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, ease: 'easeOut' }}
                        className="hero-text"
                    >
                        <h1 className="hero-title">
                            Ignite Your Learning with
                            <span className="gradient-text"> BrainSpark</span>
                        </h1>
                        <p className="hero-subtitle">
                            Transform your knowledge into expertise through engaging quizzes,
                            real-time feedback, and gamified learning experiences.
                        </p>
                        <div className="hero-buttons">
                            <Button
                                variant="primary"
                                size="lg"
                                onClick={() => navigate('/register')}
                            >
                                Get Started Free
                            </Button>
                            <Button
                                variant="outline"
                                size="lg"
                                onClick={() => navigate('/login')}
                            >
                                Sign In
                            </Button>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="hero-visual"
                    >
                        <div className="floating-card card-1">
                            <div className="card-content">
                                <div className="card-icon">🎯</div>
                                <div className="card-text">
                                    <div className="card-label">Current Streak</div>
                                    <div className="card-value">7 Days 🔥</div>
                                </div>
                            </div>
                        </div>
                        <div className="floating-card card-2">
                            <div className="card-content">
                                <div className="card-icon">⭐</div>
                                <div className="card-text">
                                    <div className="card-label">Level</div>
                                    <div className="card-value">12</div>
                                </div>
                            </div>
                        </div>
                        <div className="floating-card card-3">
                            <div className="card-content">
                                <div className="card-icon">🏆</div>
                                <div className="card-text">
                                    <div className="card-label">Rank</div>
                                    <div className="card-value">#42</div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Stats Section */}
            <section className="stats-section">
                <div className="container">
                    <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        className="stats-grid"
                    >
                        {stats.map((stat, index) => (
                            <motion.div
                                key={index}
                                variants={itemVariants}
                                className="stat-card"
                            >
                                <div className="stat-value">{stat.value}</div>
                                <div className="stat-label">{stat.label}</div>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </section>

            {/* Features Section */}
            <section className="features-section">
                <div className="container">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="section-header"
                    >
                        <h2 className="section-title">Why Choose BrainSpark?</h2>
                        <p className="section-subtitle">
                            Everything you need to master any subject through interactive learning
                        </p>
                    </motion.div>

                    <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        className="features-grid"
                    >
                        {features.map((feature, index) => (
                            <motion.div
                                key={index}
                                variants={itemVariants}
                            >
                                <Card hoverable className="feature-card">
                                    <div className="feature-icon">{feature.icon}</div>
                                    <h3 className="feature-title">{feature.title}</h3>
                                    <p className="feature-description">{feature.description}</p>
                                </Card>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="cta-section">
                <div className="container">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="cta-card"
                    >
                        <h2 className="cta-title">Ready to Start Your Learning Journey?</h2>
                        <p className="cta-subtitle">
                            Join thousands of learners who are already sparking their potential
                        </p>
                        <Button
                            variant="primary"
                            size="lg"
                            onClick={() => navigate('/register')}
                        >
                            Create Free Account
                        </Button>
                    </motion.div>
                </div>
            </section>

            {/* Footer */}
            <footer className="footer">
                <div className="container">
                    <div className="footer-content">
                        <div className="footer-brand">
                            <h3 className="brand-name">BrainSpark</h3>
                            <p className="brand-tagline">Ignite Your Learning</p>
                        </div>
                        <div className="footer-links">
                            <a href="#features">Features</a>
                            <a href="#about">About</a>
                            <a href="#contact">Contact</a>
                            <a href="#privacy">Privacy</a>
                        </div>
                    </div>
                    <div className="footer-bottom">
                        <p>&copy; 2024 BrainSpark. Crafted with passion for learners.</p>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default LandingPage;
