import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Clock, BookOpen, Zap, Coffee } from 'lucide-react';
import Button from '../ui/Button';
import Card from '../ui/Card';
import './QuizModeModal.css';

const QuizModeModal = ({
    isOpen,
    onClose,
    onSelectMode,
    quizTitle,
    questionCount,
    estimatedTime
}) => {
    // Prevent body scroll when modal is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => {
            document.body.style.overflow = '';
        };
    }, [isOpen]);

    if (!isOpen) return null;

    const handleSelectMode = (mode) => {
        onSelectMode(mode);
        onClose();
    };

    const modalContent = (
        <AnimatePresence>
            {isOpen && (
                <div className="quiz-mode-overlay">
                    {/* Backdrop */}
                    <motion.div
                        className="quiz-mode-backdrop"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        aria-hidden="true"
                    />

                    {/* Modal */}
                    <motion.div
                        className="quiz-mode-modal"
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="quiz-mode-title"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ duration: 0.2, ease: 'easeOut' }}
                    >
                        {/* Header */}
                        <div className="quiz-mode-header">
                            <div>
                                <h2 id="quiz-mode-title" className="quiz-mode-title">
                                    Choose Your Mode
                                </h2>
                                <p className="quiz-mode-subtitle">{quizTitle}</p>
                            </div>
                            <button
                                className="quiz-mode-close"
                                onClick={onClose}
                                aria-label="Close modal"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        {/* Quiz Info */}
                        <div className="quiz-mode-info">
                            <span className="info-item">
                                <BookOpen size={16} />
                                {questionCount} Questions
                            </span>
                            <span className="info-item">
                                <Clock size={16} />
                                ~{estimatedTime} min
                            </span>
                        </div>

                        {/* Mode Options */}
                        <div className="quiz-mode-options">
                            {/* Timed Mode */}
                            <motion.div
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                            >
                                <Card
                                    className="mode-card mode-timed"
                                    clickable
                                    onClick={() => handleSelectMode('timed')}
                                >
                                    <div className="mode-icon timed">
                                        <Zap size={32} />
                                    </div>
                                    <div className="mode-content">
                                        <h3 className="mode-name">Timed Mode</h3>
                                        <p className="mode-description">
                                            Challenge yourself! Each question has a time limit.
                                            Earn bonus XP for quick answers.
                                        </p>
                                        <ul className="mode-features">
                                            <li>⏱️ 30 seconds per question</li>
                                            <li>⚡ Bonus XP for speed</li>
                                            <li>🏆 Counts toward leaderboard</li>
                                        </ul>
                                    </div>
                                    <Button variant="primary" fullWidth>
                                        Start Timed Quiz
                                    </Button>
                                </Card>
                            </motion.div>

                            {/* Practice Mode */}
                            <motion.div
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                            >
                                <Card
                                    className="mode-card mode-practice"
                                    clickable
                                    onClick={() => handleSelectMode('practice')}
                                >
                                    <div className="mode-icon practice">
                                        <Coffee size={32} />
                                    </div>
                                    <div className="mode-content">
                                        <h3 className="mode-name">Practice Mode</h3>
                                        <p className="mode-description">
                                            Take your time to learn. No pressure, no time limits.
                                            Focus on understanding each concept.
                                        </p>
                                        <ul className="mode-features">
                                            <li>♾️ Unlimited time</li>
                                            <li>📚 Detailed explanations</li>
                                            <li>🔖 Bookmark questions for review</li>
                                        </ul>
                                    </div>
                                    <Button variant="outline" fullWidth>
                                        Start Practice
                                    </Button>
                                </Card>
                            </motion.div>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );

    // Render modal in a portal to document.body
    return createPortal(modalContent, document.body);
};

export default QuizModeModal;
