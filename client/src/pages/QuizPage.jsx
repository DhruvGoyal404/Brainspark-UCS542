import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, CheckCircle, XCircle, ArrowRight, Coffee, Zap, AlertTriangle, Bookmark, AlertCircle } from 'lucide-react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import ReportQuestionModal from '../components/quiz/ReportQuestionModal';
import useBookmarks from '../hooks/useBookmarks';
import { useToast } from '../components/ui/Toast';
import api from '../utils/api';
import './QuizPage.css';

const QUESTION_TIME_LIMIT = 30;

const QuizPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const location = useLocation();

    const quizMode = location.state?.mode || 'timed';

    const [quiz, setQuiz] = useState(null);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState(null);

    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [selectedAnswer, setSelectedAnswer] = useState(null);
    const [showFeedback, setShowFeedback] = useState(false);
    const [answers, setAnswers] = useState([]);
    const [direction, setDirection] = useState(1);
    const [timeLeft, setTimeLeft] = useState(QUESTION_TIME_LIMIT);
    const [timedOut, setTimedOut] = useState(false);
    const [quizStartTime] = useState(Date.now());

    const { isBookmarked, toggleBookmark } = useBookmarks();
    const toast = useToast();
    const [showReportModal, setShowReportModal] = useState(false);

    // ── Fetch quiz from API ──
    useEffect(() => {
        const fetchQuiz = async () => {
            try {
                const res = await api.get(`/quiz/${id}`);
                setQuiz(res.data.data);
            } catch (err) {
                console.error('Failed to load quiz:', err);
                if (err.response?.status === 404) {
                    setError('Quiz not found.');
                } else {
                    setError('Failed to load quiz. Please try again.');
                }
            } finally {
                setLoading(false);
            }
        };
        fetchQuiz();
    }, [id]);

    // ── Timer for timed mode ──
    useEffect(() => {
        if (quizMode !== 'timed' || showFeedback || !quiz) return;

        const timer = setInterval(() => {
            setTimeLeft(prev => {
                if (prev <= 1) {
                    clearInterval(timer);
                    handleTimeOut();
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [quizMode, showFeedback, currentQuestionIndex, quiz]);

    const handleTimeOut = useCallback(() => {
        if (showFeedback) return;
        setTimedOut(true);
        setAnswers(prev => [...prev, {
            questionId: currentQuestionIndex,
            selectedOption: null,
            isCorrect: false,
            timedOut: true
        }]);
        setShowFeedback(true);
    }, [showFeedback, currentQuestionIndex]);

    useEffect(() => {
        setTimeLeft(QUESTION_TIME_LIMIT);
        setTimedOut(false);
    }, [currentQuestionIndex]);

    if (loading) {
        return (
            <div className="quiz-loading">
                <div className="spinner spinner-lg"></div>
                <p style={{ marginTop: '16px', color: 'var(--text-secondary)' }}>Loading quiz...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="quiz-loading">
                <p style={{ color: 'var(--error)', marginBottom: '16px' }}>{error}</p>
                <Button variant="primary" onClick={() => navigate('/dashboard')}>Back to Dashboard</Button>
            </div>
        );
    }

    if (!quiz) return null;

    const currentQuestion = quiz.questions[currentQuestionIndex];
    const isLastQuestion = currentQuestionIndex === quiz.questions.length - 1;
    const progress = ((currentQuestionIndex + 1) / quiz.questions.length) * 100;

    const handleAnswerSelect = (optionId) => {
        if (showFeedback) return;
        setSelectedAnswer(optionId);
    };

    const handleSubmitAnswer = () => {
        if (!selectedAnswer) return;

        const correctOption = currentQuestion.options.find(opt => opt.isCorrect);
        const isCorrect = selectedAnswer === correctOption?.id;

        setAnswers(prev => [...prev, {
            questionId: currentQuestionIndex,
            selectedOption: selectedAnswer,
            isCorrect
        }]);

        setShowFeedback(true);
    };

    const handleNextQuestion = async () => {
        if (isLastQuestion) {
            // Submit to API
            const finalAnswers = showFeedback && !answers.find(a => a.questionId === currentQuestionIndex)
                ? [...answers, { questionId: currentQuestionIndex, selectedOption: selectedAnswer, isCorrect: selectedAnswer === currentQuestion.options.find(o => o.isCorrect)?.id }]
                : answers;

            const correctCount = finalAnswers.filter(a => a.isCorrect).length;
            const timeSpent = Math.floor((Date.now() - quizStartTime) / 1000);

            setSubmitting(true);
            try {
                const res = await api.post(`/quiz/${id}/submit`, {
                    answers: finalAnswers,
                    timeSpent,
                    quizMode
                });

                const resultData = res.data.data;
                navigate(`/quiz/${id}/results`, {
                    state: {
                        score: resultData.score,
                        answers: resultData.answers,
                        totalQuestions: resultData.totalQuestions,
                        quizTitle: quiz.title,
                        quizMode,
                        xpEarned: resultData.xpEarned,
                        xpBreakdown: resultData.xpBreakdown,
                        newLevel: resultData.newLevel,
                        newXP: resultData.newXP,
                        currentStreak: resultData.currentStreak,
                        newAchievements: resultData.newAchievements || [],
                        dailyGoal: resultData.dailyGoal,
                        timedOutCount: finalAnswers.filter(a => a.timedOut).length
                    }
                });
            } catch (err) {
                toast.error('Could not save results — showing offline score');
                // Fallback to offline results
                const score = Math.round((correctCount / quiz.questions.length) * 100);
                navigate(`/quiz/${id}/results`, {
                    state: {
                        score,
                        answers: finalAnswers,
                        totalQuestions: quiz.questions.length,
                        quizTitle: quiz.title,
                        quizMode,
                        xpEarned: score * 2,
                        timedOutCount: finalAnswers.filter(a => a.timedOut).length
                    }
                });
            } finally {
                setSubmitting(false);
            }
        } else {
            setDirection(1);
            setCurrentQuestionIndex(prev => prev + 1);
            setSelectedAnswer(null);
            setShowFeedback(false);
        }
    };

    const cardVariants = {
        enter: (d) => ({ x: d > 0 ? 300 : -300, opacity: 0 }),
        center: { x: 0, opacity: 1 },
        exit: (d) => ({ x: d < 0 ? 300 : -300, opacity: 0 })
    };

    const getAnswerClassName = (option) => {
        const base = 'answer-option';
        if (!showFeedback) return `${base} ${selectedAnswer === option.id ? 'selected' : ''}`;
        if (option.isCorrect) return `${base} correct`;
        if (selectedAnswer === option.id && !option.isCorrect) return `${base} incorrect`;
        return `${base} disabled`;
    };

    const currentlyBookmarked = isBookmarked(id, currentQuestionIndex);

    return (
        <div className="quiz-page">
            <div className="quiz-container container">
                {/* Progress Bar */}
                <div className="quiz-header">
                    <div className="quiz-progress-section">
                        <div className="quiz-progress-info">
                            <div className="quiz-title-section">
                                <h2 className="quiz-title">{quiz.title}</h2>
                                <span className={`quiz-mode-badge ${quizMode}`}>
                                    {quizMode === 'timed' ? <><Zap size={14} /> Timed Mode</> : <><Coffee size={14} /> Practice Mode</>}
                                </span>
                            </div>
                            <div className="quiz-stats">
                                <span className="question-counter">
                                    Question {currentQuestionIndex + 1} of {quiz.questions.length}
                                </span>
                                {quizMode === 'timed' && (
                                    <div className={`timer-display ${timeLeft <= 10 ? 'warning' : ''} ${timeLeft <= 5 ? 'critical' : ''}`}>
                                        <Clock size={18} />
                                        <span>{timeLeft}s</span>
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className="progress-bar-container">
                            <div className="progress-bar-fill" style={{ width: `${progress}%` }}></div>
                        </div>
                    </div>
                </div>

                {/* Question Card */}
                <AnimatePresence mode="wait" custom={direction}>
                    <motion.div
                        key={currentQuestionIndex}
                        custom={direction}
                        variants={cardVariants}
                        initial="enter"
                        animate="center"
                        exit="exit"
                        transition={{ x: { type: 'spring', stiffness: 300, damping: 30 }, opacity: { duration: 0.2 } }}
                    >
                        <Card className="question-card">
                            <div className="question-header">
                                <h3 className="question-text">{currentQuestion.questionText}</h3>
                                <div style={{ display: 'flex', gap: '8px' }}>
                                    {/* Report button */}
                                    <button
                                        className="report-btn"
                                        onClick={() => setShowReportModal(true)}
                                        title="Report this question"
                                        style={{
                                            background: 'none',
                                            border: 'none',
                                            cursor: 'pointer',
                                            color: 'var(--text-muted)',
                                            padding: '4px',
                                            borderRadius: '4px',
                                            flexShrink: 0,
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center'
                                        }}
                                    >
                                        <AlertCircle size={20} />
                                    </button>
                                    {/* Bookmark button */}
                                    <button
                                        className={`bookmark-btn ${currentlyBookmarked ? 'bookmarked' : ''}`}
                                        onClick={() => toggleBookmark(id, quiz.title, currentQuestion, currentQuestionIndex)}
                                        title={currentlyBookmarked ? 'Remove bookmark' : 'Bookmark this question'}
                                        style={{
                                            background: 'none',
                                            border: 'none',
                                            cursor: 'pointer',
                                            color: currentlyBookmarked ? 'var(--warning)' : 'var(--text-muted)',
                                            padding: '4px',
                                            borderRadius: '4px',
                                            flexShrink: 0
                                        }}
                                    >
                                        <Bookmark size={20} fill={currentlyBookmarked ? 'currentColor' : 'none'} />
                                    </button>
                                </div>
                            </div>

                            <div className="answers-grid">
                                {currentQuestion.options.map((option) => (
                                    <motion.button
                                        key={option.id}
                                        className={getAnswerClassName(option)}
                                        onClick={() => handleAnswerSelect(option.id)}
                                        whileHover={!showFeedback ? { scale: 1.02 } : {}}
                                        whileTap={!showFeedback ? { scale: 0.98 } : {}}
                                    >
                                        <span className="option-id">{option.id}</span>
                                        <span className="option-text">{option.text}</span>
                                        {showFeedback && option.isCorrect && <CheckCircle className="option-icon" size={24} />}
                                        {showFeedback && selectedAnswer === option.id && !option.isCorrect && <XCircle className="option-icon" size={24} />}
                                    </motion.button>
                                ))}
                            </div>

                            {showFeedback && (
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className={`feedback-container ${
                                        timedOut ? 'timed-out'
                                        : selectedAnswer === currentQuestion.options.find(o => o.isCorrect)?.id ? 'correct' : 'incorrect'
                                    }`}
                                >
                                    <div className="feedback-header">
                                        {timedOut ? (
                                            <><AlertTriangle size={24} /><span>Time's Up!</span></>
                                        ) : selectedAnswer === currentQuestion.options.find(o => o.isCorrect)?.id ? (
                                            <><CheckCircle size={24} /><span>Correct!</span></>
                                        ) : (
                                            <><XCircle size={24} /><span>Incorrect</span></>
                                        )}
                                    </div>
                                    {currentQuestion.explanation && (
                                        <p className="feedback-explanation">{currentQuestion.explanation}</p>
                                    )}
                                </motion.div>
                            )}

                            <div className="question-actions">
                                {!showFeedback ? (
                                    <Button
                                        variant="primary"
                                        size="lg"
                                        onClick={handleSubmitAnswer}
                                        disabled={!selectedAnswer}
                                        fullWidth
                                    >
                                        Submit Answer
                                    </Button>
                                ) : (
                                    <Button
                                        variant="primary"
                                        size="lg"
                                        onClick={handleNextQuestion}
                                        icon={!isLastQuestion && <ArrowRight size={20} />}
                                        disabled={submitting}
                                        fullWidth
                                    >
                                        {submitting ? 'Saving...' : isLastQuestion ? 'View Results' : 'Next Question'}
                                    </Button>
                                )}
                            </div>
                        </Card>
                    </motion.div>
                </AnimatePresence>
            </div>

            {/* Report Question Modal */}
            {showReportModal && (
                <ReportQuestionModal
                    quiz={quiz}
                    questionIndex={currentQuestionIndex}
                    questionText={currentQuestion.questionText}
                    onClose={() => setShowReportModal(false)}
                    onSuccess={() => toast.success('Thank you for reporting this question!')}
                />
            )}
        </div>
    );
};

export default QuizPage;
