import { useState } from 'react';
import { motion } from 'framer-motion';
import { Check, X, BookOpen, ChevronDown, ChevronUp } from 'lucide-react';
import Card from '../ui/Card';
import Button from '../ui/Button';
import './AnswerReview.css';

const AnswerReview = ({ answers = [], questions = [] }) => {
    const [expandedQuestions, setExpandedQuestions] = useState(new Set());

    const toggleQuestion = (index) => {
        const newExpanded = new Set(expandedQuestions);
        if (newExpanded.has(index)) {
            newExpanded.delete(index);
        } else {
            newExpanded.add(index);
        }
        setExpandedQuestions(newExpanded);
    };

    const expandAll = () => {
        setExpandedQuestions(new Set(questions.map((_, i) => i)));
    };

    const collapseAll = () => {
        setExpandedQuestions(new Set());
    };

    const incorrectAnswers = answers.filter(a => !a.isCorrect);
    const hasIncorrect = incorrectAnswers.length > 0;

    return (
        <div className="answer-review">
            <div className="review-header">
                <div className="header-content">
                    <BookOpen size={24} className="header-icon" />
                    <div>
                        <h2 className="review-title">Answer Review</h2>
                        <p className="review-subtitle">
                            {hasIncorrect
                                ? `Review ${incorrectAnswers.length} incorrect ${incorrectAnswers.length === 1 ? 'answer' : 'answers'}`
                                : 'Perfect! All answers correct.'}
                        </p>
                    </div>
                </div>
                <div className="header-actions">
                    <Button variant="outline" size="sm" onClick={expandAll}>
                        Expand All
                    </Button>
                    <Button variant="outline" size="sm" onClick={collapseAll}>
                        Collapse All
                    </Button>
                </div>
            </div>

            <div className="review-list">
                {questions.map((question, index) => {
                    const answer = answers[index];
                    const isExpanded = expandedQuestions.has(index);
                    const isCorrect = answer?.isCorrect;

                    return (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 }}
                        >
                            <Card className={`review-item ${isCorrect ? 'correct' : 'incorrect'}`}>
                                <div
                                    className="review-question-header"
                                    onClick={() => toggleQuestion(index)}
                                    role="button"
                                    tabIndex={0}
                                >
                                    <div className="question-info">
                                        <div className="question-number">
                                            {isCorrect ? (
                                                <Check className="status-icon correct" size={20} />
                                            ) : (
                                                <X className="status-icon incorrect" size={20} />
                                            )}
                                            <span>Question {index + 1}</span>
                                        </div>
                                        <p className="question-text">{question.questionText || question.text}</p>
                                    </div>
                                    {isExpanded ? (
                                        <ChevronUp size={20} className="expand-icon" />
                                    ) : (
                                        <ChevronDown size={20} className="expand-icon" />
                                    )}
                                </div>

                                {isExpanded && (
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: 'auto', opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        transition={{ duration: 0.3 }}
                                        className="review-details"
                                    >
                                        <div className="options-list">
                                            {question.options.map((option) => {
                                                const isSelected = answer?.selectedOption === option.id;
                                                const isCorrectOption = option.isCorrect;

                                                return (
                                                    <div
                                                        key={option.id}
                                                        className={`option-item ${isCorrectOption ? 'correct-option' : ''
                                                            } ${isSelected ? 'selected-option' : ''}`}
                                                    >
                                                        <span className="option-label">{option.id}</span>
                                                        <span className="option-text">{option.text}</span>
                                                        {isCorrectOption && (
                                                            <Check size={16} className="correct-marker" />
                                                        )}
                                                        {isSelected && !isCorrectOption && (
                                                            <X size={16} className="incorrect-marker" />
                                                        )}
                                                    </div>
                                                );
                                            })}
                                        </div>

                                        {answer?.explanation && (
                                            <div className="explanation">
                                                <h4 className="explanation-title">Explanation</h4>
                                                <p className="explanation-text">{answer.explanation}</p>
                                            </div>
                                        )}
                                    </motion.div>
                                )}
                            </Card>
                        </motion.div>
                    );
                })}
            </div>
        </div>
    );
};

export default AnswerReview;
