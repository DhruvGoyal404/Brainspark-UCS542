import { motion, AnimatePresence } from 'framer-motion';
import Card from '../ui/Card';
import './QuizCard.css';

const QuizCard = ({
    question,
    direction = 1,
    children,
    className = ''
}) => {
    const cardVariants = {
        enter: (direction) => ({
            x: direction > 0 ? 1000 : -1000,
            opacity: 0,
            scale: 0.95
        }),
        center: {
            x: 0,
            opacity: 1,
            scale: 1
        },
        exit: (direction) => ({
            x: direction < 0 ? 1000 : -1000,
            opacity: 0,
            scale: 0.95
        })
    };

    return (
        <AnimatePresence initial={false} custom={direction} mode="wait">
            <motion.div
                key={question?.id || 'quiz-card'}
                custom={direction}
                variants={cardVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{
                    x: { type: "spring", stiffness: 300, damping: 30 },
                    opacity: { duration: 0.2 },
                    scale: { duration: 0.2 }
                }}
                className={`quiz-card-wrapper ${className}`}
            >
                <Card className="quiz-card" elevated>
                    {question && (
                        <motion.div
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.2 }}
                            className="question-container"
                        >
                            <h2 className="question-text">{question.text || question.questionText}</h2>
                            {question.image && (
                                <img
                                    src={question.image}
                                    alt="Question illustration"
                                    className="question-image"
                                />
                            )}
                        </motion.div>
                    )}

                    <motion.div
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.3 }}
                        className="card-content"
                    >
                        {children}
                    </motion.div>
                </Card>
            </motion.div>
        </AnimatePresence>
    );
};

export default QuizCard;
