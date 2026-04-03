import { useState, useEffect } from 'react';
import { X, Check, X as Cross, HelpCircle } from 'lucide-react';
import Button from '../ui/Button';
import api from '../../utils/api';
import './QuizAttemptReviewModal.css';

const QuizAttemptReviewModal = ({ resultId, onClose }) => {
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [expandedQuestion, setExpandedQuestion] = useState(null);

    useEffect(() => {
        fetchReviewData();
    }, [resultId]);

    const fetchReviewData = async () => {
        try {
            const response = await api.get(`/quiz/results/${resultId}`);
            setResult(response.data.data);
            setError(null);
        } catch (err) {
            setError('Failed to load quiz attempt details');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const getDifficultyColor = (difficulty) => {
        switch (difficulty?.toLowerCase()) {
            case 'easy': return 'hsl(120, 85%, 48%)';
            case 'medium': return 'hsl(38, 92%, 50%)';
            case 'hard': return 'hsl(0, 84%, 60%)';
            default: return 'var(--text-secondary)';
        }
    };

    if (loading) {
        return (
            <div className="modal-overlay" onClick={onClose}>
                <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                    <div style={{ padding: '60px 20px', textAlign: 'center' }}>
                        <div className="spinner spinner-sm"></div>
                    </div>
                </div>
            </div>
        );
    }

    if (error || !result) {
        return (
            <div className="modal-overlay" onClick={onClose}>
                <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                    <div className="modal-header">
                        <h3 style={{ margin: 0 }}>Error</h3>
                        <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                            <X size={24} />
                        </button>
                    </div>
                    <div style={{ padding: '24px', textAlign: 'center', color: 'var(--error)' }}>
                        {error}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content review-modal" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <div>
                        <h3 style={{ margin: '0 0 8px 0' }}>{result.quizTitle}</h3>
                        <p style={{ margin: 0, fontSize: '14px', color: 'var(--text-secondary)' }}>
                            {new Date(result.completedAt).toLocaleDateString()} • {result.mode} mode
                        </p>
                    </div>
                    <button 
                        onClick={onClose}
                        style={{
                            background: 'none',
                            border: 'none',
                            cursor: 'pointer',
                            padding: '0',
                            color: 'var(--text-secondary)',
                            display: 'flex',
                            alignItems: 'center'
                        }}
                    >
                        <X size={24} />
                    </button>
                </div>

                {/* Score Summary */}
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
                    gap: '16px',
                    padding: '20px 24px',
                    background: 'var(--bg-secondary)',
                    borderBottom: '1px solid var(--border)'
                }}>
                    <div style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: '28px', fontWeight: 'bold', color: 'var(--primary)' }}>
                            {result.score}%
                        </div>
                        <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Score</div>
                    </div>
                    <div style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: '28px', fontWeight: 'bold', color: 'var(--success)' }}>
                            {result.correctAnswers}/{result.totalQuestions}
                        </div>
                        <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Correct</div>
                    </div>
                    <div style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: '28px', fontWeight: 'bold', color: 'hsl(31, 100%, 63%)' }}>
                            +{result.xpEarned}
                        </div>
                        <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>XP Earned</div>
                    </div>
                    {result.timeSpent && (
                        <div style={{ textAlign: 'center' }}>
                            <div style={{ fontSize: '28px', fontWeight: 'bold', color: 'var(--info)' }}>
                                {Math.round(result.timeSpent / 60)}:
                                {String(result.timeSpent % 60).padStart(2, '0')}
                            </div>
                            <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Time</div>
                        </div>
                    )}
                </div>

                {/* Question Review */}
                <div style={{ padding: '24px' }}>
                    <h4 style={{ margin: '0 0 16px 0', fontSize: '16px' }}>Question Review</h4>
                    <div style={{ display: 'grid', gap: '12px' }}>
                        {result.answers.map((answer, index) => (
                            <div
                                key={index}
                                style={{
                                    border: '1px solid var(--border)',
                                    borderRadius: '8px',
                                    overflow: 'hidden',
                                    background: answer.isCorrect ? 'rgba(34, 197, 94, 0.05)' : 'rgba(239, 68, 68, 0.05)'
                                }}
                            >
                                <button
                                    onClick={() => setExpandedQuestion(expandedQuestion === index ? null : index)}
                                    style={{
                                        width: '100%',
                                        padding: '16px',
                                        background: 'transparent',
                                        border: 'none',
                                        cursor: 'pointer',
                                        textAlign: 'left',
                                        display: 'flex',
                                        alignItems: 'flex-start',
                                        gap: '12px',
                                        transition: 'background 0.2s'
                                    }}
                                >
                                    <div style={{
                                        flexShrink: 0,
                                        width: '32px',
                                        height: '32px',
                                        borderRadius: '50%',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        background: answer.isCorrect ? 'rgba(34, 197, 94, 0.2)' : 'rgba(239, 68, 68, 0.2)',
                                        color: answer.isCorrect ? 'var(--success)' : 'var(--error)'
                                    }}>
                                        {answer.isCorrect ? <Check size={18} /> : <Cross size={18} />}
                                    </div>
                                    <div style={{ flex: 1 }}>
                                        <div style={{ fontWeight: '500', marginBottom: '4px' }}>
                                            Question {index + 1}
                                        </div>
                                        <div style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
                                            {answer.questionText}
                                        </div>
                                    </div>
                                </button>

                                {expandedQuestion === index && (
                                    <div style={{
                                        padding: '16px',
                                        borderTop: '1px solid var(--border)',
                                        background: 'var(--bg-secondary)'
                                    }}>
                                        <div style={{ marginBottom: '12px' }}>
                                            <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '4px' }}>
                                                Your Answer:
                                            </div>
                                            <div style={{
                                                padding: '8px',
                                                background: answer.isCorrect ? 'rgba(34, 197, 94, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                                                borderRadius: '4px',
                                                fontSize: '13px'
                                            }}>
                                                {answer.selectedOptionText || 'No answer selected'}
                                            </div>
                                        </div>

                                        {!answer.isCorrect && (
                                            <div style={{ marginBottom: '12px' }}>
                                                <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '4px' }}>
                                                    Correct Answer:
                                                </div>
                                                <div style={{
                                                    padding: '8px',
                                                    background: 'rgba(34, 197, 94, 0.1)',
                                                    borderRadius: '4px',
                                                    fontSize: '13px'
                                                }}>
                                                    {answer.correctOptionText}
                                                </div>
                                            </div>
                                        )}

                                        <div>
                                            <div style={{ fontSize: '12px', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px' }}>
                                                <HelpCircle size={14} />
                                                <strong>Explanation:</strong>
                                            </div>
                                            <div style={{
                                                padding: '8px',
                                                background: 'var(--bg)',
                                                borderRadius: '4px',
                                                fontSize: '13px',
                                                lineHeight: '1.5'
                                            }}>
                                                {answer.explanation}
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                <div style={{
                    padding: '16px 24px',
                    borderTop: '1px solid var(--border)',
                    display: 'flex',
                    gap: '12px'
                }}>
                    <Button variant="secondary" fullWidth onClick={onClose}>
                        Close
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default QuizAttemptReviewModal;
