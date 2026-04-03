import { useState } from 'react';
import { AlertCircle, X } from 'lucide-react';
import Button from '../ui/Button';
import api from '../../utils/api';
import './ReportQuestionModal.css';

const ReportQuestionModal = ({ quiz, questionIndex, questionText, onClose, onSuccess }) => {
    const [reportType, setReportType] = useState('');
    const [description, setDescription] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    const reportTypes = [
        { value: 'unclear', label: 'Question is unclear', emoji: '❓' },
        { value: 'incorrect_answer', label: 'Answer key is wrong', emoji: '❌' },
        { value: 'typo', label: 'Typo or grammar issue', emoji: '📝' },
        { value: 'offensive', label: 'Offensive content', emoji: '⚠️' },
        { value: 'other', label: 'Other issue', emoji: '🔍' }
    ];

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!reportType) {
            setError('Please select a report type');
            return;
        }

        setLoading(true);
        setError('');

        try {
            await api.post(
                `/quiz/${quiz.id}/questions/${questionIndex}/report`,
                {
                    reportType,
                    description: description.trim()
                }
            );
            setSuccess(true);
            setTimeout(() => {
                if (onSuccess) onSuccess();
                onClose();
            }, 1500);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to submit report');
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        return (
            <div className="modal-overlay" onClick={onClose}>
                <div className="modal-content" style={{ maxWidth: '400px' }} onClick={(e) => e.stopPropagation()}>
                    <div style={{ textAlign: 'center', padding: '40px 20px' }}>
                        <div style={{
                            fontSize: '48px',
                            marginBottom: '16px'
                        }}>
                            ✅
                        </div>
                        <h3 style={{ margin: '0 0 8px 0' }}>Report Submitted</h3>
                        <p style={{ color: 'var(--text-secondary)', margin: '0 0 24px 0', fontSize: '14px' }}>
                            Thank you for helping improve BrainSpark! Our team will review this shortly.
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <AlertCircle size={24} style={{ color: 'var(--warning)' }} />
                        <h3 style={{ margin: 0 }}>Report This Question</h3>
                    </div>
                    <button 
                        onClick={onClose}
                        style={{
                            background: 'none',
                            border: 'none',
                            cursor: 'pointer',
                            padding: '0',
                            color: 'var(--text-secondary)'
                        }}
                    >
                        <X size={24} />
                    </button>
                </div>

                <div style={{ marginBottom: '24px', padding: '12px', background: 'var(--bg-secondary)', borderRadius: '8px' }}>
                    <p style={{ fontSize: '12px', color: 'var(--text-secondary)', margin: 0 }}>
                        Question: <strong>{questionText}</strong>
                    </p>
                </div>

                <form onSubmit={handleSubmit}>
                    {error && (
                        <div style={{
                            background: 'rgba(255, 0, 0, 0.1)',
                            color: 'var(--error)',
                            padding: '12px',
                            borderRadius: '8px',
                            marginBottom: '16px',
                            fontSize: '14px'
                        }}>
                            {error}
                        </div>
                    )}

                    <div style={{ marginBottom: '20px' }}>
                        <label style={{ display: 'block', marginBottom: '12px', fontWeight: '500' }}>
                            What's the issue?
                        </label>
                        <div style={{ display: 'grid', gap: '8px' }}>
                            {reportTypes.map(type => (
                                <label 
                                    key={type.value}
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '12px',
                                        padding: '12px',
                                        borderRadius: '8px',
                                        border: `2px solid ${reportType === type.value ? 'var(--primary)' : 'var(--border)'}`,
                                        background: reportType === type.value ? 'rgba(102, 126, 234, 0.05)' : 'transparent',
                                        cursor: 'pointer',
                                        transition: 'all 0.2s'
                                    }}
                                >
                                    <input
                                        type="radio"
                                        name="reportType"
                                        value={type.value}
                                        checked={reportType === type.value}
                                        onChange={(e) => setReportType(e.target.value)}
                                        style={{ cursor: 'pointer' }}
                                    />
                                    <span>{type.emoji}</span>
                                    <span>{type.label}</span>
                                </label>
                            ))}
                        </div>
                    </div>

                    <div style={{ marginBottom: '20px' }}>
                        <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>
                            Additional details (optional)
                        </label>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Please provide any additional context..."
                            maxLength="500"
                            disabled={loading}
                            style={{
                                width: '100%',
                                minHeight: '100px',
                                padding: '12px',
                                border: '1px solid var(--border)',
                                borderRadius: '8px',
                                fontSize: '14px',
                                fontFamily: 'inherit',
                                resize: 'vertical',
                                opacity: loading ? 0.5 : 1
                            }}
                        />
                        <p style={{
                            fontSize: '12px',
                            color: 'var(--text-secondary)',
                            margin: '4px 0 0 0',
                            textAlign: 'right'
                        }}>
                            {description.length}/500
                        </p>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                        <Button
                            type="button"
                            variant="secondary"
                            onClick={onClose}
                            disabled={loading}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            variant="primary"
                            disabled={!reportType || loading}
                        >
                            {loading ? 'Submitting...' : 'Submit Report'}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ReportQuestionModal;
