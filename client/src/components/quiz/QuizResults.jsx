import { motion } from 'framer-motion';
import { Trophy, Target, TrendingUp } from 'lucide-react';
import Card from '../ui/Card';
import ScoreCelebration from '../gamification/ScoreCelebration';
import './QuizResults.css';

const QuizResults = ({
    score,
    correctAnswers,
    totalQuestions,
    xpEarned,
    onRetake,
    onReview,
    onDashboard,
    showCelebration = true
}) => {
    const percentage = Math.round(score);
    const isPerfect = percentage === 100;
    const isPass = percentage >= 70;

    const stats = [
        {
            icon: <Target size={24} />,
            label: 'Correct Answers',
            value: `${correctAnswers}/${totalQuestions}`,
            color: 'var(--success)'
        },
        {
            icon: <TrendingUp size={24} />,
            label: 'Accuracy',
            value: `${percentage}%`,
            color: 'var(--primary)'
        },
        {
            icon: <Trophy size={24} />,
            label: 'XP Earned',
            value: `+${xpEarned} XP`,
            color: 'var(--warning)'
        }
    ];

    return (
        <div className="quiz-results">
            {showCelebration && (
                <ScoreCelebration
                    score={percentage}
                    showConfetti={percentage >= 80}
                />
            )}

            <div className="results-stats">
                {stats.map((stat, index) => (
                    <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 + 0.3 }}
                    >
                        <Card className="stat-card" hoverable>
                            <div className="stat-icon" style={{ color: stat.color }}>
                                {stat.icon}
                            </div>
                            <div className="stat-details">
                                <div className="stat-value">{stat.value}</div>
                                <div className="stat-label">{stat.label}</div>
                            </div>
                        </Card>
                    </motion.div>
                ))}
            </div>

            {!isPerfect && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
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
    );
};

export default QuizResults;
