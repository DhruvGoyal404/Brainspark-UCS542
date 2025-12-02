import { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Trophy, Target, TrendingUp, RotateCcw, Home, Share2 } from 'lucide-react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { Share } from 'lucide-react';
import './ResultsPage.css';

const ResultsPage = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { id } = useParams();
    const [showConfetti, setShowConfetti] = useState(false);

    const { score = 0, answers = [], totalQuestions = 0, quizTitle = 'Quiz' } = location.state || {};

    const correctAnswers = answers.filter(a => a.isCorrect).length;
    const percentage = Math.round(score);
    const isPerfect = percentage === 100;
    const isPass = percentage >= 70;

    useEffect(() => {
        if (!location.state) {
            navigate('/dashboard');
            return;
        }

        // Show confetti for scores >= 80%
        if (percentage >= 80) {
            setShowConfetti(true);
            createConfetti();
        }
    }, [location.state, navigate, percentage]);

    const handleShare = async () => {
        const shareData = {
            title: 'BrainSpark Quiz Results',
            text: `I scored ${score}% on ${quizTitle}! 🎉`,
            url: window.location.href
        };

        try {
            if (navigator.share) {
                await navigator.share(shareData);
            } else {
                await navigator.clipboard.writeText(window.location.href);
                alert('Link copied to clipboard!');
            }
        } catch (error) {
            console.error('Error sharing:', error);
        }
    };

    const createConfetti = () => {
        const duration = 3000;
        const animationEnd = Date.now() + duration;
        const colors = ['#6366f1', '#10b981', '#f59e0b', '#ec4899'];

        const randomInRange = (min, max) => Math.random() * (max - min) + min;

        const confettiInterval = setInterval(() => {
            const timeLeft = animationEnd - Date.now();

            if (timeLeft <= 0) {
                clearInterval(confettiInterval);
                return;
            }

            const particleCount = 3;

            for (let i = 0; i < particleCount; i++) {
                const confetti = document.createElement('div');
                confetti.className = 'confetti-particle';
                confetti.style.left = randomInRange(0, 100) + '%';
                confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
                confetti.style.animationDuration = randomInRange(2, 4) + 's';
                confetti.style.opacity = randomInRange(0.5, 1);

                document.querySelector('.results-page').appendChild(confetti);

                setTimeout(() => confetti.remove(), 4000);
            }
        }, 100);
    };

    const getMessage = () => {
        if (isPerfect) return { title: '🎉 Perfect Score!', subtitle: 'Outstanding performance!' };
        if (percentage >= 90) return { title: '🌟 Excellent!', subtitle: 'You\'re crushing it!' };
        if (percentage >= 80) return { title: '🎯 Great Job!', subtitle: 'Keep up the good work!' };
        if (isPass) return { title: '✅ Good Work!', subtitle: 'You passed this quiz!' };
        return { title: '📚 Keep Learning!', subtitle: 'Practice makes perfect!' };
    };

    const message = getMessage();

    const getGrade = () => {
        if (percentage >= 90) return { grade: 'A+', color: 'var(--success)' };
        if (percentage >= 80) return { grade: 'A', color: 'var(--success)' };
        if (percentage >= 70) return { grade: 'B', color: 'var(--warning)' };
        if (percentage >= 60) return { grade: 'C', color: 'var(--warning)' };
        return { grade: 'D', color: 'var(--error)' };
    };

    const grade = getGrade();

    return (
        <div className="results-page">
            <div className="results-container container">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="results-header"
                >
                    <h1 className="results-quiz-title">{quizTitle}</h1>
                    <p className="results-subtitle">Quiz Completed!</p>
                </motion.div>

                {/* Main Score Card */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                >
                    <Card className="score-card">
                        <div className="score-content">
                            <div className="score-circle" style={{ '--progress': percentage }}>
                                <svg className="score-ring" width="200" height="200">
                                    <circle
                                        className="score-ring-bg"
                                        cx="100"
                                        cy="100"
                                        r="85"
                                    />
                                    <circle
                                        className="score-ring-progress"
                                        cx="100"
                                        cy="100"
                                        r="85"
                                        style={{
                                            strokeDasharray: `${2 * Math.PI * 85}`,
                                            strokeDashoffset: `${2 * Math.PI * 85 * (1 - percentage / 100)}`
                                        }}
                                    />
                                </svg>
                                <div className="score-percentage">
                                    <span className="score-value">{percentage}%</span>
                                    <span className="score-grade" style={{ color: grade.color }}>
                                        {grade.grade}
                                    </span>
                                </div>
                            </div>

                            <div className="score-message">
                                <h2 className="message-title">{message.title}</h2>
                                <p className="message-subtitle">{message.subtitle}</p>
                            </div>
                        </div>
                    </Card>
                </motion.div>

                {/* Stats Grid */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                    className="stats-grid"
                >
                    <Card className="stat-card">
                        <div className="stat-icon" style={{ backgroundColor: 'var(--success-bg)', color: 'var(--success)' }}>
                            <Target size={24} />
                        </div>
                        <div className="stat-details">
                            <div className="stat-value">{correctAnswers}/{totalQuestions}</div>
                            <div className="stat-label">Correct Answers</div>
                        </div>
                    </Card>

                    <Card className="stat-card">
                        <div className="stat-icon" style={{ backgroundColor: 'var(--primary-alpha-20)', color: 'var(--primary)' }}>
                            <TrendingUp size={24} />
                        </div>
                        <div className="stat-details">
                            <div className="stat-value">{percentage}%</div>
                            <div className="stat-label">Accuracy</div>
                        </div>
                    </Card>

                    <Card className="stat-card">
                        <div className="stat-icon" style={{ backgroundColor: 'var(--warning-bg)', color: 'var(--warning)' }}>
                            <Trophy size={24} />
                        </div>
                        <div className="stat-details">
                            <div className="stat-value">+{percentage * 2} XP</div>
                            <div className="stat-label">Points Earned</div>
                        </div>
                    </Card>
                </motion.div>

                {/* Action Buttons */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.6 }}
                    className="results-actions"
                >
                    <Button
                        variant="primary"
                        size="lg"
                        icon={<RotateCcw size={20} />}
                        onClick={() => navigate(`/quiz/${id}`)}
                    >
                        Retake Quiz
                    </Button>

                    <Button
                        variant="outline"
                        size="lg"
                        icon={<Home size={20} />}
                        onClick={() => navigate('/dashboard')}
                    >
                        Back to Dashboard
                    </Button>

                    <Button variant="outline" onClick={handleShare} icon={<Share size={20} />}>
                        Share Results
                    </Button>
                </motion.div>

                {/* Performance Tip */}
                {!isPerfect && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5, delay: 0.8 }}
                    >
                        <Card className="tip-card">
                            <h3 className="tip-title">💡 Pro Tip</h3>
                            <p className="tip-text">
                                {percentage >= 80
                                    ? "Keep this momentum going! Try harder quizzes to level up faster."
                                    : "Review the explanations for questions you missed. Understanding mistakes is key to improvement!"}
                            </p>
                        </Card>
                    </motion.div>
                )}
            </div>
        </div>
    );
};

export default ResultsPage;
