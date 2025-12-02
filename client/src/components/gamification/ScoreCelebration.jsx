import { motion, AnimatePresence } from 'framer-motion';
import Confetti from './Confetti';
import './ScoreCelebration.css';

const ScoreCelebration = ({
    score,
    showConfetti = false,
    message = 'Congratulations!',
    subtitle,
    children
}) => {
    const getMessage = (score) => {
        if (score === 100) return { title: '🎉 Perfect Score!', sub: 'Absolutely Outstanding!' };
        if (score >= 90) return { title: '🌟 Excellent!', sub: 'You\'re crushing it!' };
        if (score >= 80) return { title: '🎯 Great Job!', sub: 'Keep up the good work!' };
        if (score >= 70) return { title: '✅ Good Work!', sub: 'You passed!' };
        return { title: '📚 Keep Learning!', sub: 'Practice makes perfect!' };
    };

    const defaultMessage = getMessage(score);
    const displayTitle = message || defaultMessage.title;
    const displaySubtitle = subtitle || defaultMessage.sub;

    return (
        <div className="score-celebration">
            <AnimatePresence>
                {showConfetti && (
                    <Confetti active={true} duration={3000} particleCount={120} />
                )}
            </AnimatePresence>

            <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{
                    type: "spring",
                    stiffness: 300,
                    damping: 20,
                    delay: 0.1
                }}
                className="celebration-content"
            >
                <motion.div
                    initial={{ y: -20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="celebration-message"
                >
                    <h2 className="celebration-title">{displayTitle}</h2>
                    <p className="celebration-subtitle">{displaySubtitle}</p>
                </motion.div>

                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{
                        type: "spring",
                        stiffness: 400,
                        damping: 15,
                        delay: 0.3
                    }}
                    className="celebration-score"
                >
                    <div className="score-circle">
                        <motion.div
                            initial={{ rotate: -180, opacity: 0 }}
                            animate={{ rotate: 0, opacity: 1 }}
                            transition={{ duration: 0.6, delay: 0.4 }}
                            className="score-value"
                        >
                            {score}%
                        </motion.div>
                    </div>
                </motion.div>

                {children && (
                    <motion.div
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.5 }}
                        className="celebration-actions"
                    >
                        {children}
                    </motion.div>
                )}
            </motion.div>
        </div>
    );
};

export default ScoreCelebration;
