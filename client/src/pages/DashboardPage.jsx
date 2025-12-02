import { useState } from 'react'; // ADD THIS IF NOT THERE
import ConfirmationModal from '../components/ui/ConfirmationModal';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Brain, Code, Database, Server, Trophy, Flame, TrendingUp } from 'lucide-react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import './DashboardPage.css';

const DashboardPage = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [quizToStart, setQuizToStart] = useState(null);

    const handleQuizClick = (quizId, quizTitle) => {
        setQuizToStart({ id: quizId, title: quizTitle });
    };

    const confirmStartQuiz = () => {
        navigate(`/quiz/${quizToStart.id}`);
    };

    // Mock quiz data
    const quizzes = [
        {
            id: 'dsa-basics',
            title: 'DSA Basics',
            description: 'Master fundamental data structures and algorithms',
            category: 'Data Structures',
            difficulty: 'Easy',
            questionCount: 15,
            estimatedTime: 20,
            icon: <Brain size={32} />,
            color: 'hsl(243, 75%, 59%)'
        },
        {
            id: 'operating-systems',
            title: 'Operating Systems',
            description: 'Learn OS concepts, processes, and memory management',
            category: 'Operating Systems',
            difficulty: 'Medium',
            questionCount: 20,
            estimatedTime: 25,
            icon: <Server size={32} />,
            color: 'hsl(160, 84%, 39%)'
        },
        {
            id: 'dbms-fundamentals',
            title: 'DBMS Fundamentals',
            description: 'Database concepts, SQL, and normalization',
            category: 'Database',
            difficulty: 'Medium',
            questionCount: 18,
            estimatedTime: 22,
            icon: <Database size={32} />,
            color: 'hsl(31, 100%, 63%)'
        },
        {
            id: 'advanced-dsa',
            title: 'Advanced DSA',
            description: 'Complex algorithms, dynamic programming, and graphs',
            category: 'Data Structures',
            difficulty: 'Hard',
            questionCount: 25,
            estimatedTime: 35,
            icon: <Code size={32} />,
            color: 'hsl(0, 84%, 60%)'
        }
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
                duration: 0.4,
                ease: 'easeOut'
            }
        }
    };

    const getDifficultyColor = (difficulty) => {
        switch (difficulty.toLowerCase()) {
            case 'easy':
                return 'var(--success)';
            case 'medium':
                return 'var(--warning)';
            case 'hard':
                return 'var(--error)';
            default:
                return 'var(--text-secondary)';
        }
    };

    return (
        <main className="dashboard-page">
            <div className="dashboard-container container">
                {/* Welcome Section */}
                <motion.header
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="welcome-section"
                >
                    <div className="welcome-text">
                        <h1 className="welcome-title">
                            Welcome back, <span className="gradient-text">{user?.username || 'Learner'}</span>!
                        </h1>
                        <p className="welcome-subtitle">Ready to spark some knowledge today?</p>
                    </div>

                    <aside className="quick-stats" aria-label="User statistics summary">
                        <article className="quick-stat">
                            <div className="stat-icon" style={{ backgroundColor: 'var(--primary-alpha-20)', color: 'var(--primary)' }}>
                                <Flame size={24} />
                            </div>
                            <div className="stat-info">
                                <div className="stat-value">{user?.stats?.currentStreak || 0}</div>
                                <div className="stat-label">Day Streak</div>
                            </div>
                        </article>

                        <article className="quick-stat">
                            <div className="stat-icon" style={{ backgroundColor: 'var(--secondary)', color: 'white' }}>
                                <Trophy size={24} />
                            </div>
                            <div className="stat-info">
                                <div className="stat-value">Level {user?.stats?.level || 1}</div>
                                <div className="stat-label">{user?.stats?.currentXP || 0} XP</div>
                            </div>
                        </article>

                        <article className="quick-stat">
                            <div className="stat-icon" style={{ backgroundColor: 'var(--accent)', color: 'white' }}>
                                <TrendingUp size={24} />
                            </div>
                            <div className="stat-info">
                                <div className="stat-value">{user?.stats?.totalQuizzes || 0}</div>
                                <div className="stat-label">Quizzes Taken</div>
                            </div>
                        </article>
                    </aside>
                </motion.header>

                {/* Daily Goal Progress */}
                <motion.section
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                    aria-labelledby="daily-goal-title"
                >
                    <Card className="daily-goal-card">
                        <div className="daily-goal-header">
                            <h3 id="daily-goal-title" className="daily-goal-title">Daily Goal</h3>
                            <span className="daily-goal-progress-text">0 / 3 quizzes</span>
                        </div>
                        <div className="progress-bar">
                            <div className="progress-fill" style={{ width: '0%' }}></div>
                        </div>
                        <p className="daily-goal-message">Complete 3 quizzes today to maintain your streak!</p>
                    </Card>
                </motion.section>

                {/* Available Quizzes */}
                <section className="quizzes-section" aria-labelledby="quizzes-title">
                    <header className="section-header">
                        <h2 id="quizzes-title" className="section-title">Available Quizzes</h2>
                        <p className="section-subtitle">Choose a quiz to test your knowledge</p>
                    </header>

                    <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                        className="quizzes-grid"
                    >
                        {quizzes.map((quiz) => (
                            <motion.article key={quiz.id} variants={itemVariants}>
                                <Card className="quiz-card" hoverable>
                                    <div className="quiz-card-header">
                                        <figure className="quiz-icon" style={{ backgroundColor: quiz.color + '20', color: quiz.color }}>
                                            {quiz.icon}
                                        </figure>
                                        <span
                                            className="quiz-difficulty-badge"
                                            style={{
                                                backgroundColor: getDifficultyColor(quiz.difficulty) + '20',
                                                color: getDifficultyColor(quiz.difficulty)
                                            }}
                                        >
                                            {quiz.difficulty}
                                        </span>
                                    </div>

                                    <div className="quiz-card-body">
                                        <h3 className="quiz-title">{quiz.title}</h3>
                                        <p className="quiz-description">{quiz.description}</p>

                                        <dl className="quiz-meta">
                                            <div className="quiz-meta-item">
                                                <dt className="meta-label">Questions:</dt>
                                                <dd className="meta-value">{quiz.questionCount}</dd>
                                            </div>
                                            <div className="quiz-meta-item">
                                                <dt className="meta-label">Time:</dt>
                                                <dd className="meta-value">~{quiz.estimatedTime} min</dd>
                                            </div>
                                        </dl>
                                    </div>

                                    <div className="quiz-card-footer">
                                        <Button
                                            variant="primary"
                                            fullWidth
                                            onClick={() => handleQuizClick(quiz.id, quiz.title)}
                                        >
                                            Start Quiz
                                        </Button>
                                    </div>
                                </Card>
                            </motion.article>
                        ))}
                    </motion.div>
                </section>

                {/* Quick Links */}
                <motion.section
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                    className="quick-links-section"
                    aria-labelledby="quick-links-title"
                >
                    <h3 id="quick-links-title" className="section-title">Quick Links</h3>
                    <nav className="quick-links-grid" aria-label="Quick navigation links">
                        <Card className="quick-link-card" clickable onClick={() => navigate('/leaderboard')}>
                            <Trophy size={32} className="quick-link-icon" />
                            <div className="quick-link-text">
                                <h4 className="quick-link-title">Leaderboard</h4>
                                <p className="quick-link-desc">See how you rank</p>
                            </div>
                        </Card>

                        <Card className="quick-link-card" clickable onClick={() => navigate('/analytics')}>
                            <TrendingUp size={32} className="quick-link-icon" />
                            <div className="quick-link-text">
                                <h4 className="quick-link-title">Analytics</h4>
                                <p className="quick-link-desc">Track your progress</p>
                            </div>
                        </Card>

                        <Card className="quick-link-card" clickable onClick={() => navigate('/profile')}>
                            <Brain size={32} className="quick-link-icon" />
                            <div className="quick-link-text">
                                <h4 className="quick-link-title">Profile</h4>
                                <p className="quick-link-desc">View achievements</p>
                            </div>
                        </Card>
                    </nav>
                </motion.section>
            </div>

            {/* Quiz Start Confirmation */}
            <ConfirmationModal
                isOpen={!!quizToStart}
                onClose={() => setQuizToStart(null)}
                onConfirm={confirmStartQuiz}
                title="Ready to Start?"
                message={`You're about to begin "${quizToStart?.title}". Make sure you're ready!`}
                confirmText="Start Quiz"
                cancelText="Not Yet"
            />
        </main>
    );
};

export default DashboardPage;
