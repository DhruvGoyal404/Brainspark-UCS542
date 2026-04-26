import { useEffect, useState } from 'react';
import { Lightbulb, TrendingUp, BarChart2 } from 'lucide-react';
import Card from '../ui/Card';
import Button from '../ui/Button';
import api from '../../utils/api';
import { calculateSkillLevel, getPerformanceFeedback } from '../../utils/adaptiveDifficulty';
import './RecommendationsSection.css';

const RecommendationsSection = ({ onQuizSelect }) => {
    const [recommendations, setRecommendations] = useState(null);
    const [loading, setLoading]                 = useState(true);
    const [error, setError]                     = useState(null);

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

    if (error || !recommendations) return null;

    const { reason, quizzes, type, categoryPerformance } = recommendations;

    // ── Adaptive difficulty analysis ──────────────────────────────────────────
    // Convert categoryPerformance (from server) into the format adaptiveDifficulty expects
    let skillLevel    = null;
    let perfFeedback  = null;

    if (categoryPerformance && categoryPerformance.length > 0) {
        // Build a flat array of { score } entries for skill level calculation
        const recentResults = categoryPerformance.flatMap(cat =>
            Array(cat.attempts).fill({ score: cat.avgScore })
        );

        skillLevel   = calculateSkillLevel(recentResults);
        perfFeedback = getPerformanceFeedback(skillLevel);
    }

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

            {/* Adaptive feedback banner — shown when we have enough data for a skill assessment */}
            {perfFeedback && (
                <div style={{
                    marginBottom: '16px',
                    padding: '12px 16px',
                    background: 'var(--primary-alpha-10, rgba(99,102,241,0.08))',
                    borderRadius: '8px',
                    borderLeft: '4px solid var(--primary)'
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                        <BarChart2 size={16} style={{ color: 'var(--primary)' }} />
                        <span style={{ fontWeight: '600', fontSize: '13px' }}>
                            Skill Level: {skillLevel?.level?.charAt(0).toUpperCase() + skillLevel?.level?.slice(1)}
                            {skillLevel?.avgScore !== undefined && ` · Avg ${skillLevel.avgScore}%`}
                            {skillLevel?.trend && ` · ${skillLevel.trend}`}
                        </span>
                    </div>
                    <p style={{ margin: 0, fontSize: '13px', color: 'var(--text-secondary)' }}>
                        {perfFeedback.message} {perfFeedback.suggestion}
                    </p>
                </div>
            )}

            {/* Category performance grid */}
            {categoryPerformance && categoryPerformance.length > 0 && (
                <div style={{ marginBottom: '20px', padding: '15px', background: 'var(--bg-secondary)', borderRadius: '8px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                        <TrendingUp size={18} style={{ color: 'var(--primary)' }} />
                        <h4 style={{ margin: 0, fontSize: '14px' }}>Your Performance</h4>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '12px' }}>
                        {categoryPerformance.map(cat => (
                            <div key={cat.category} style={{ fontSize: '13px' }}>
                                <div style={{
                                    textTransform: 'capitalize',
                                    fontWeight: '500',
                                    marginBottom: '4px',
                                    color: cat.avgScore < 70 ? 'var(--error)' : 'var(--text-primary)'
                                }}>
                                    {cat.category.replace(/-/g, ' ')}
                                    {cat.avgScore < 70 && ' ⚠️'}
                                </div>
                                <div style={{ color: 'var(--text-secondary)' }}>
                                    Avg: <strong>{cat.avgScore}%</strong> ({cat.attempts} quiz{cat.attempts !== 1 ? 'zes' : ''})
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Recommended quizzes */}
            {quizzes && quizzes.length > 0 ? (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px' }}>
                    {quizzes.map(quiz => (
                        <div
                            key={quiz._id}
                            style={{
                                padding: '12px',
                                background: 'var(--bg-secondary)',
                                borderRadius: '8px',
                                borderLeft: '4px solid var(--primary)',
                                cursor: 'pointer',
                                transition: 'all 0.2s'
                            }}
                        >
                            <div style={{ fontWeight: '600', marginBottom: '4px', fontSize: '14px' }}>
                                {quiz.title}
                            </div>
                            <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '8px' }}>
                                <span style={{ textTransform: 'capitalize' }}>
                                    {quiz.category.replace(/-/g, ' ')} · {quiz.difficulty}
                                </span>
                                {quiz.attemptCount > 0 && (
                                    <span style={{ marginLeft: '6px' }}>· {quiz.attemptCount} attempts</span>
                                )}
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
