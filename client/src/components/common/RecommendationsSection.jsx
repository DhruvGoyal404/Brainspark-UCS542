import { useEffect, useState } from 'react';
import { Lightbulb, TrendingUp } from 'lucide-react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import api from '../utils/api';
import './RecommendationsSection.css';

const RecommendationsSection = ({ onQuizSelect }) => {
    const [recommendations, setRecommendations] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchRecommendations();
    }, []);

    const fetchRecommendations = async () => {
        try {
            setLoading(true);
            const response = await api.get('/user/recommendations');
            setRecommendations(response.data.data);
            setError(null);
        } catch (err) {
            setError('Failed to load recommendations');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <Card className="recommendations-section">
                <div style={{ padding: '40px', textAlign: 'center' }}>
                    <div className="spinner spinner-sm"></div>
                </div>
            </Card>
        );
    }

    if (error || !recommendations) {
        return null;
    }

    const { reason, quizzes, type, categoryPerformance } = recommendations;

    return (
        <Card className="recommendations-section">
            <div style={{ marginBottom: '20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                    <Lightbulb size={24} style={{ color: 'hsl(51, 100%, 50%)' }} />
                    <h3 style={{ margin: 0 }}>Recommended For You</h3>
                </div>
                <p style={{ color: 'var(--text-secondary)', fontSize: '14px', margin: 0 }}>
                    {reason}
                </p>
            </div>

            {categoryPerformance && categoryPerformance.length > 0 && (
                <div style={{ marginBottom: '20px', padding: '15px', background: 'var(--bg-secondary)', borderRadius: '8px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                        <TrendingUp size={18} style={{ color: 'var(--primary)' }} />
                        <h4 style={{ margin: 0, fontSize: '14px' }}>Your Performance</h4>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '12px' }}>
                        {categoryPerformance.map(cat => (
                            <div key={cat.category} style={{ fontSize: '13px' }}>
                                <div style={{ textTransform: 'capitalize', fontWeight: '500', marginBottom: '4px' }}>
                                    {cat.category.replace('-', ' ')}
                                </div>
                                <div style={{ color: 'var(--text-secondary)' }}>
                                    Avg: <strong>{cat.avgScore}%</strong> ({cat.attempts} quiz{cat.attempts !== 1 ? 'zes' : ''})
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {quizzes && quizzes.length > 0 ? (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px' }}>
                    {quizzes.map(quiz => (
                        <div key={quiz._id} style={{
                            padding: '12px',
                            background: 'var(--bg-secondary)',
                            borderRadius: '8px',
                            borderLeft: '4px solid var(--primary)',
                            cursor: 'pointer',
                            transition: 'all 0.2s',
                            ':hover': { background: 'var(--bg-tertiary)' }
                        }}>
                            <div style={{ fontWeight: '600', marginBottom: '4px', fontSize: '14px' }}>
                                {quiz.title}
                            </div>
                            <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '8px' }}>
                                <span style={{ textTransform: 'capitalize' }}>
                                    {quiz.category.replace('-', ' ')} • {quiz.difficulty}
                                </span>
                            </div>
                            <Button
                                size="sm"
                                variant="primary"
                                onClick={() => onQuizSelect(quiz)}
                                fullWidth
                            >
                                Start Quiz
                            </Button>
                        </div>
                    ))}
                </div>
            ) : (
                <p style={{ color: 'var(--text-secondary)', textAlign: 'center', margin: 0 }}>
                    No personalized recommendations available yet. Keep learning!
                </p>
            )}
        </Card>
    );
};

export default RecommendationsSection;
