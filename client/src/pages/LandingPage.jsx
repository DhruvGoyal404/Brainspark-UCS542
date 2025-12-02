import { motion } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';
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
                staggerChildren: 0.15,
                delayChildren: 0.1
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 30 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.7,
                ease: [0.25, 0.46, 0.45, 0.94]
            }
        }
    };

    return (
        <main className="landing-page">
            {/* Hero Section */}
            <section className="hero" aria-labelledby="hero-title">
                <div className="hero-background"></div>
                <article className="hero-content container">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ 
                            duration: 1, 
                            ease: [0.25, 0.46, 0.45, 0.94]
                        }}
                        className="hero-text"
                    >
                        <h1 id="hero-title" className="hero-title">
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

                    <aside className="hero-visual" aria-label="Learning statistics preview">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.5 }}
                        >
                            <motion.figure 
                                className="floating-card card-1"
                                initial={{ opacity: 0, y: 20, scale: 0.9 }}
                                animate={{ 
                                    opacity: 1, 
                                    scale: 1,
                                    y: [0, -12, 0]
                                }}
                                transition={{ 
                                    opacity: { duration: 0.6, delay: 0.3 },
                                    scale: { duration: 0.6, delay: 0.3 },
                                    y: { 
                                        duration: 4, 
                                        repeat: Infinity, 
                                        ease: "easeInOut",
                                        delay: 0.9
                                    }
                                }}
                            >
                                <div className="card-content">
                                    <div className="card-icon">🎯</div>
                                    <figcaption className="card-text">
                                        <div className="card-label">Current Streak</div>
                                        <div className="card-value">7 Days 🔥</div>
                                    </figcaption>
                                </div>
                            </motion.figure>
                            <motion.figure 
                                className="floating-card card-2"
                                initial={{ opacity: 0, y: 20, scale: 0.9 }}
                                animate={{ 
                                    opacity: 1, 
                                    scale: 1,
                                    y: [0, -12, 0]
                                }}
                                transition={{ 
                                    opacity: { duration: 0.6, delay: 0.5 },
                                    scale: { duration: 0.6, delay: 0.5 },
                                    y: { 
                                        duration: 4.5, 
                                        repeat: Infinity, 
                                        ease: "easeInOut",
                                        delay: 1.1
                                    }
                                }}
                            >
                                <div className="card-content">
                                    <div className="card-icon">⭐</div>
                                    <figcaption className="card-text">
                                        <div className="card-label">Level</div>
                                        <div className="card-value">12</div>
                                    </figcaption>
                                </div>
                            </motion.figure>
                            <motion.figure 
                                className="floating-card card-3"
                                initial={{ opacity: 0, y: 20, scale: 0.9 }}
                                animate={{ 
                                    opacity: 1, 
                                    scale: 1,
                                    y: [0, -12, 0]
                                }}
                                transition={{ 
                                    opacity: { duration: 0.6, delay: 0.7 },
                                    scale: { duration: 0.6, delay: 0.7 },
                                    y: { 
                                        duration: 5, 
                                        repeat: Infinity, 
                                        ease: "easeInOut",
                                        delay: 1.3
                                    }
                                }}
                            >
                                <div className="card-content">
                                    <div className="card-icon">🏆</div>
                                    <figcaption className="card-text">
                                        <div className="card-label">Rank</div>
                                        <div className="card-value">#42</div>
                                    </figcaption>
                                </div>
                            </motion.figure>
                        </motion.div>
                    </aside>
                </article>
            </section>

            {/* Stats Section */}
            <section className="stats-section" aria-labelledby="stats-title">
                <div className="container">
                    <h2 id="stats-title" className="sr-only">Platform Statistics</h2>
                    <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: "-100px" }}
                        className="stats-grid"
                    >
                        {stats.map((stat, index) => (
                            <motion.article
                                key={index}
                                variants={itemVariants}
                                className="stat-card"
                            >
                                <div className="stat-value">{stat.value}</div>
                                <div className="stat-label">{stat.label}</div>
                            </motion.article>
                        ))}
                    </motion.div>
                </div>
            </section>

            {/* Features Section */}
            <section className="features-section" aria-labelledby="features-title">
                <div className="container">
                    <motion.header
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-50px" }}
                        transition={{ 
                            duration: 0.8,
                            ease: [0.25, 0.46, 0.45, 0.94]
                        }}
                        className="section-header"
                    >
                        <h2 id="features-title" className="section-title">Why Choose BrainSpark?</h2>
                        <p className="section-subtitle">
                            Everything you need to master any subject through interactive learning
                        </p>
                    </motion.header>

                    <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: "-100px" }}
                        className="features-grid"
                    >
                        {features.map((feature, index) => (
                            <motion.article
                                key={index}
                                variants={itemVariants}
                            >
                                <Card hoverable className="feature-card">
                                    <figure>
                                        <div className="feature-icon">{feature.icon}</div>
                                        <figcaption>
                                            <h3 className="feature-title">{feature.title}</h3>
                                            <p className="feature-description">{feature.description}</p>
                                        </figcaption>
                                    </figure>
                                </Card>
                            </motion.article>
                        ))}
                    </motion.div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="cta-section" aria-labelledby="cta-title">
                <div className="container">
                    <motion.article
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true, margin: "-50px" }}
                        transition={{ 
                            duration: 0.8,
                            ease: [0.25, 0.46, 0.45, 0.94]
                        }}
                        className="cta-card"
                    >
                        <h2 id="cta-title" className="cta-title">Ready to Start Your Learning Journey?</h2>
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
                    </motion.article>
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
                        <nav className="footer-links" aria-label="Footer navigation">
                            <a href="#features">Features</a>
                            <a href="#contact">Contact</a>
                            <a href="#privacy">Privacy</a>
                            <Link to="/about">About</Link>
                        </nav>
                    </div>
                    <div className="footer-bottom">
                        <p><small>&copy; 2025 BrainSpark. Crafted with passion for learners.</small></p>
                        <p><small>Made By: <a href="https://github.com/DhruvGoyal404" target="_blank" rel="noopener noreferrer" className="footer-credit-link">Dhruv Goyal</a></small></p>
                    </div>
                </div>
            </footer>
        </main>
    );
};

export default LandingPage;
