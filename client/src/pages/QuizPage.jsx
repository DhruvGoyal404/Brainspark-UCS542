import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, CheckCircle, XCircle, ArrowRight } from 'lucide-react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import './QuizPage.css';

// Mock quiz data
const mockQuizzes = {
    'dsa-basics': {
        id: 'dsa-basics',
        title: 'DSA Basics',
        questions: [
            {
                id: 1,
                questionText: 'What is the time complexity of accessing an element in an array by index?',
                options: [
                    { id: 'A', text: 'O(1)', isCorrect: true },
                    { id: 'B', text: 'O(n)', isCorrect: false },
                    { id: 'C', text: 'O(log n)', isCorrect: false },
                    { id: 'D', text: 'O(n²)', isCorrect: false }
                ],
                explanation: 'Array access by index is O(1) because arrays store elements in contiguous memory locations.'
            },
            {
                id: 2,
                questionText: 'Which data structure uses LIFO (Last In First Out) principle?',
                options: [
                    { id: 'A', text: 'Queue', isCorrect: false },
                    { id: 'B', text: 'Stack', isCorrect: true },
                    { id: 'C', text: 'Tree', isCorrect: false },
                    { id: 'D', text: 'Graph', isCorrect: false }
                ],
                explanation: 'Stack follows LIFO principle - the last element added is the first one to be removed.'
            },
            {
                id: 3,
                questionText: 'What is the primary advantage of a linked list over an array?',
                options: [
                    { id: 'A', text: 'Faster access time', isCorrect: false },
                    { id: 'B', text: 'Dynamic size', isCorrect: true },
                    { id: 'C', text: 'Less memory usage', isCorrect: false },
                    { id: 'D', text: 'Better cache performance', isCorrect: false }
                ],
                explanation: 'Linked lists can grow or shrink dynamically, while arrays have fixed sizes.'
            }
        ]
    },
    'operating-systems': {
        id: 'operating-systems',
        title: 'Operating Systems',
        questions: [
            {
                id: 1,
                questionText: 'What is a process in an operating system?',
                options: [
                    { id: 'A', text: 'A program in execution', isCorrect: true },
                    { id: 'B', text: 'A stored program', isCorrect: false },
                    { id: 'C', text: 'A system call', isCorrect: false },
                    { id: 'D', text: 'A hardware component', isCorrect: false }
                ],
                explanation: 'A process is an instance of a program that is being executed.'
            }
        ]
    },
    'dbms-fundamentals': {
        id: 'dbms-fundamentals',
        title: 'DBMS Fundamentals',
        questions: [
            {
                id: 1,
                questionText: 'What does ACID stand for in database transactions?',
                options: [
                    { id: 'A', text: 'Atomic, Consistent, Isolated, Durable', isCorrect: true },
                    { id: 'B', text: 'Automatic, Complete, Independent, Dynamic', isCorrect: false },
                    { id: 'C', text: 'Active, Continuous, Immediate, Direct', isCorrect: false },
                    { id: 'D', text: 'Atomic, Complete, Immediate, Dynamic', isCorrect: false }
                ],
                explanation: 'ACID properties ensure reliable database transactions: Atomicity, Consistency, Isolation, and Durability.'
            }
        ]
    },
    'advanced-dsa': {
        id: 'advanced-dsa',
        title: 'Advanced DSA',
        questions: [
            {
                id: 1,
                questionText: 'What is the time complexity of the Dijkstra\'s shortest path algorithm?',
                options: [
                    { id: 'A', text: 'O(V²)', isCorrect: false },
                    { id: 'B', text: 'O((V + E) log V)', isCorrect: true },
                    { id: 'C', text: 'O(V * E)', isCorrect: false },
                    { id: 'D', text: 'O(E log E)', isCorrect: false }
                ],
                explanation: 'Using a binary heap, Dijkstra\'s algorithm runs in O((V + E) log V) time.'
            }
        ]
    }
};

const QuizPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [quiz, setQuiz] = useState(null);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [selectedAnswer, setSelectedAnswer] = useState(null);
    const [showFeedback, setShowFeedback] = useState(false);
    const [answers, setAnswers] = useState([]);
    const [direction, setDirection] = useState(1);

    useEffect(() => {
        const quizData = mockQuizzes[id];
        if (quizData) {
            setQuiz(quizData);
        } else {
            navigate('/dashboard');
        }
    }, [id, navigate]);

    if (!quiz) {
        return (
            <div className="quiz-loading">
                <div className="spinner spinner-lg"></div>
            </div>
        );
    }

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
        const isCorrect = selectedAnswer === correctOption.id;

        setAnswers([...answers, {
            questionId: currentQuestion.id,
            selectedOption: selectedAnswer,
            isCorrect
        }]);

        setShowFeedback(true);
    };

    const handleNextQuestion = () => {
        if (isLastQuestion) {
            // Navigate to results
            const score = (answers.filter(a => a.isCorrect).length / quiz.questions.length) * 100;
            navigate(`/quiz/${id}/results`, {
                state: {
                    score,
                    answers,
                    totalQuestions: quiz.questions.length,
                    quizTitle: quiz.title
                }
            });
        } else {
            setDirection(1);
            setCurrentQuestionIndex(prev => prev + 1);
            setSelectedAnswer(null);
            setShowFeedback(false);
        }
    };

    const cardVariants = {
        enter: (direction) => ({
            x: direction > 0 ? 300 : -300,
            opacity: 0
        }),
        center: {
            x: 0,
            opacity: 1
        },
        exit: (direction) => ({
            x: direction < 0 ? 300 : -300,
            opacity: 0
        })
    };

    const getAnswerClassName = (option) => {
        const baseClass = 'answer-option';
        if (!showFeedback) {
            return `${baseClass} ${selectedAnswer === option.id ? 'selected' : ''}`;
        }

        if (option.isCorrect) {
            return `${baseClass} correct`;
        }

        if (selectedAnswer === option.id && !option.isCorrect) {
            return `${baseClass} incorrect`;
        }

        return `${baseClass} disabled`;
    };

    return (
        <div className="quiz-page">
            <div className="quiz-container container">
                {/* Progress Bar */}
                <div className="quiz-header">
                    <div className="quiz-progress-section">
                        <div className="quiz-progress-info">
                            <h2 className="quiz-title">{quiz.title}</h2>
                            <span className="question-counter">
                                Question {currentQuestionIndex + 1} of {quiz.questions.length}
                            </span>
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
                        transition={{
                            x: { type: "spring", stiffness: 300, damping: 30 },
                            opacity: { duration: 0.2 }
                        }}
                    >
                        <Card className="question-card">
                            <div className="question-header">
                                <h3 className="question-text">{currentQuestion.questionText}</h3>
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
                                        {showFeedback && option.isCorrect && (
                                            <CheckCircle className="option-icon" size={24} />
                                        )}
                                        {showFeedback && selectedAnswer === option.id && !option.isCorrect && (
                                            <XCircle className="option-icon" size={24} />
                                        )}
                                    </motion.button>
                                ))}
                            </div>

                            {showFeedback && (
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className={`feedback-container ${selectedAnswer === currentQuestion.options.find(o => o.isCorrect)?.id ? 'correct' : 'incorrect'}`}
                                >
                                    <div className="feedback-header">
                                        {selectedAnswer === currentQuestion.options.find(o => o.isCorrect)?.id ? (
                                            <>
                                                <CheckCircle size={24} />
                                                <span>Correct!</span>
                                            </>
                                        ) : (
                                            <>
                                                <XCircle size={24} />
                                                <span>Incorrect</span>
                                            </>
                                        )}
                                    </div>
                                    <p className="feedback-explanation">{currentQuestion.explanation}</p>
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
                                        fullWidth
                                    >
                                        {isLastQuestion ? 'View Results' : 'Next Question'}
                                    </Button>
                                )}
                            </div>
                        </Card>
                    </motion.div>
                </AnimatePresence>
            </div>
        </div>
    );
};

export default QuizPage;
