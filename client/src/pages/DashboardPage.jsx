import { useState, useEffect, useMemo, useCallback } from 'react';
import QuizModeModal from '../components/quiz/QuizModeModal';
import RecommendationsSection from '../components/common/RecommendationsSection';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Brain, Code, Database, Server, Trophy, Flame, TrendingUp, LayoutGrid, List, Search, Network, Cpu, BookOpen, Target, RefreshCw } from 'lucide-react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import api from '../utils/api';
import './DashboardPage.css';

// Category icon + color mapping
const CATEGORY_META = {
    dsa: { icon: <Brain size={32} />, color: 'hsl(243, 75%, 59%)', label: 'Data Structures' },
    'operating-systems': { icon: <Server size={32} />, color: 'hsl(160, 84%, 39%)', label: 'Operating Systems' },
    dbms: { icon: <Database size={32} />, color: 'hsl(31, 100%, 63%)', label: 'Database' },
    networks: { icon: <Network size={32} />, color: 'hsl(199, 89%, 48%)', label: 'Networks' },
    oops: { icon: <BookOpen size={32} />, color: 'hsl(280, 75%, 55%)', label: 'Object Oriented Programming' },
    web: { icon: <Code size={32} />, color: 'hsl(101, 80%, 50%)', label: 'Web Development' },
    other: { icon: <Cpu size={32} />, color: 'hsl(280, 75%, 55%)', label: 'Other' },
};

const DashboardPage = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [quizToStart, setQuizToStart] = useState(null);
    const [quizViewMode, setQuizViewMode] = useState('card');
    const [searchQuery, setSearchQuery] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('all');
    const [difficultyFilter, setDifficultyFilter] = useState('all');

    // API state
    const [quizzes, setQuizzes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [dailyGoal, setDailyGoal] = useState(null);

    // Fetch quizzes from DB
    const fetchQuizzes = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const [quizRes, statsRes] = await Promise.all([
                api.get('/quiz'),
                api.get('/user/stats').catch(() => null)
            ]);
            setQuizzes(quizRes.data.data || []);
            if (statsRes?.data?.data?.dailyGoal) {
                setDailyGoal(statsRes.data.data.dailyGoal);
            }
        } catch (err) {
            setError('Failed to load quizzes. Please refresh.');
            console.error('Dashboard fetch error:', err);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchQuizzes();
    }, [fetchQuizzes]);

    const handleQuizClick = (quiz) => setQuizToStart(quiz);

    const handleModeSelect = (mode) => {
        navigate(`/quiz/${quizToStart.id}`, {
            state: { mode, quizTitle: quizToStart.title }
        });
    };

    const getDifficultyColor = (difficulty) => {
        switch ((difficulty || '').toLowerCase()) {
            case 'easy': return 'var(--success)';
            case 'medium': return 'var(--warning)';
            case 'hard': return 'var(--error)';
            default: return 'var(--text-secondary)';
        }
    };

    // Enrich quiz with display meta from CATEGORY_META
    const enrichedQuizzes = useMemo(() => quizzes.map(q => ({
        ...q,
        icon: CATEGORY_META[q.category]?.icon || <BookOpen size={32} />,
        color: CATEGORY_META[q.category]?.color || 'hsl(243, 75%, 59%)',
        categoryLabel: CATEGORY_META[q.category]?.label || q.category,
        questionCount: q.metadata?.totalQuestions || q.questions?.length || '?',
        estimatedTime: q.metadata?.estimatedTime || 15,
    })), [quizzes]);

    const filteredQuizzes = useMemo(() => {
        return enrichedQuizzes.filter(quiz => {
            const searchTerm = searchQuery.trim().toLowerCase();
            const matchesSearch = !searchTerm ||
                quiz.title.toLowerCase().includes(searchTerm) ||
                quiz.description?.toLowerCase().includes(searchTerm) ||
                quiz.category.toLowerCase().includes(searchTerm);
            const matchesCategory = categoryFilter === 'all' || quiz.category === categoryFilter;
            const matchesDifficulty = difficultyFilter === 'all' || quiz.difficulty === difficultyFilter;
            return matchesSearch && matchesCategory && matchesDifficulty;
        });
    }, [enrichedQuizzes, searchQuery, categoryFilter, difficultyFilter]);

    const categories = useMemo(() => [...new Set(quizzes.map(q => q.category))], [quizzes]);

    const dailyProgress = dailyGoal
        ? Math.min((dailyGoal.todayCount / dailyGoal.targetQuizzes) * 100, 100)
        : 0;

    return (
        <main className="dashboard-page">
            <div className="dashboard-container container">
                {/* Welcome Section */}
                <motion.header
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="welcome-section"
                >
                    <div className="welcome-text">
                        <h1 className="welcome-title">
                            Welcome back, <span className="gradient-text">{user?.username || 'Learner'}</span>!
                        </h1>
                        <p className="welcome-subtitle">Ready to spark some knowledge today?</p>
                    </div>

                    <aside className="quick-stats" aria-label="User statistics summary">
                        <article className="quick-stat">
                            <div className="stat-icon" style={{ backgroundColor: 'var(--primary-alpha-20)', color: 'var(--primary)' }}>
                                <Flame size={24} />
                            </div>
                            <div className="stat-info">
                                <div className="stat-value">{user?.stats?.currentStreak || 0}</div>
                                <div className="stat-label">Day Streak</div>
                            </div>
                        </article>

                        <article className="quick-stat">
                            <div className="stat-icon" style={{ backgroundColor: 'var(--secondary)', color: 'white' }}>
                                <Trophy size={24} />
                            </div>
                            <div className="stat-info">
                                <div className="stat-value">Level {user?.stats?.level || 1}</div>
                                <div className="stat-label">{user?.stats?.currentXP || 0} XP</div>
                            </div>
                        </article>

                        <article className="quick-stat">
                            <div className="stat-icon" style={{ backgroundColor: 'var(--accent)', color: 'white' }}>
                                <TrendingUp size={24} />
                            </div>
                            <div className="stat-info">
                                <div className="stat-value">{user?.stats?.totalQuizzes || 0}</div>
                                <div className="stat-label">Quizzes Taken</div>
                            </div>
                        </article>
                    </aside>
                </motion.header>

                {/* Daily Goal Progress */}
                <motion.section
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                    aria-labelledby="daily-goal-title"
                >
                    <Card className="daily-goal-card">
                        <div className="daily-goal-header">
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <Target size={20} />
                                <h3 id="daily-goal-title" className="daily-goal-title">Daily Goal</h3>
                            </div>
                            <span className="daily-goal-progress-text">
                                {dailyGoal ? `${dailyGoal.todayCount} / ${dailyGoal.targetQuizzes} quizzes` : '0 / 3 quizzes'}
                            </span>
                        </div>
                        <div className="progress-bar">
                            <div className="progress-fill" style={{ width: `${dailyProgress}%` }}></div>
                        </div>
                        <p className="daily-goal-message">
                            {dailyGoal?.completed
                                ? '🎉 Daily goal achieved! Amazing work!'
                                : `Complete ${(dailyGoal?.targetQuizzes || 3) - (dailyGoal?.todayCount || 0)} more quiz${(dailyGoal?.targetQuizzes || 3) - (dailyGoal?.todayCount || 0) !== 1 ? 'zes' : ''} to hit your daily goal!`}
                        </p>
                    </Card>
                </motion.section>

                {/* Personalized Recommendations */}
                <motion.section
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                >
                    <RecommendationsSection onQuizSelect={handleQuizClick} />
                </motion.section>

                {/* Available Quizzes */}
                <section className="quizzes-section" aria-labelledby="quizzes-title">
                    <header className="section-header">
                        <div className="section-header-content">
                            <h2 id="quizzes-title" className="section-title">
                                Available Quizzes
                                {!loading && <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 400, marginLeft: '8px' }}>({filteredQuizzes.length})</span>}
                            </h2>
                            <p className="section-subtitle">Choose a quiz to test your knowledge</p>
                        </div>
                        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                            <button
                                onClick={fetchQuizzes}
                                title="Refresh quizzes"
                                style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)', padding: '6px' }}
                            >
                                <RefreshCw size={18} />
                            </button>
                            <div className="view-toggle">
                                <button className={`view-toggle-btn ${quizViewMode === 'card' ? 'active' : ''}`} onClick={() => setQuizViewMode('card')} aria-label="Card view">
                                    <LayoutGrid size={18} />
                                </button>
                                <button className={`view-toggle-btn ${quizViewMode === 'list' ? 'active' : ''}`} onClick={() => setQuizViewMode('list')} aria-label="List view">
                                    <List size={18} />
                                </button>
                            </div>
                        </div>
                    </header>

                    {/* Search and Filter */}
                    <div className="quiz-filters">
                        <div className="search-bar">
                            <Search size={18} className="search-icon" />
                            <input
                                type="text"
                                placeholder="Search quizzes..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="search-input"
                            />
                        </div>
                        <div className="filter-controls">
                            <select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)} className="filter-select">
                                <option value="all">All Subjects</option>
                                {categories.map(cat => (
                                    <option key={cat} value={cat}>{CATEGORY_META[cat]?.label || cat}</option>
                                ))}
                            </select>
                            <select value={difficultyFilter} onChange={(e) => setDifficultyFilter(e.target.value)} className="filter-select">
                                <option value="all">All Levels</option>
                                <option value="easy">Easy</option>
                                <option value="medium">Medium</option>
                                <option value="hard">Hard</option>
                            </select>
                            {(categoryFilter !== 'all' || difficultyFilter !== 'all' || searchQuery) && (
                                <Button variant="ghost" size="sm" onClick={() => { setSearchQuery(''); setCategoryFilter('all'); setDifficultyFilter('all'); }}>
                                    Clear
                                </Button>
                            )}
                        </div>
                    </div>

                    {/* Loading / Error / Quizzes */}
                    {loading ? (
                        <div style={{ display: 'flex', justifyContent: 'center', padding: '60px 0' }}>
                            <div className="spinner spinner-lg"></div>
                        </div>
                    ) : error ? (
                        <Card style={{ textAlign: 'center', padding: '40px' }}>
                            <p style={{ color: 'var(--error)', marginBottom: '16px' }}>{error}</p>
                            <Button variant="primary" onClick={fetchQuizzes}>Retry</Button>
                        </Card>
                    ) : (
                        <div className={quizViewMode === 'card' ? 'quizzes-grid' : 'quizzes-list'}>
                            <AnimatePresence mode="popLayout">
                                {filteredQuizzes.length > 0 ? filteredQuizzes.map((quiz) => (
                                    <motion.article
                                        key={quiz._id || quiz.id}
                                        layout
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.9 }}
                                        transition={{ duration: 0.2 }}
                                    >
                                        <Card className="quiz-card" hoverable>
                                            <div className="quiz-card-header">
                                                <figure className="quiz-icon" style={{ backgroundColor: quiz.color + '20', color: quiz.color }}>
                                                    {quiz.icon}
                                                </figure>
                                                <span
                                                    className="quiz-difficulty-badge"
                                                    style={{
                                                        backgroundColor: getDifficultyColor(quiz.difficulty) + '20',
                                                        color: getDifficultyColor(quiz.difficulty)
                                                    }}
                                                >
                                                    {quiz.difficulty}
                                                </span>
                                            </div>

                                            <div className="quiz-card-body">
                                                <h3 className="quiz-title">{quiz.title}</h3>
                                                <p className="quiz-description">{quiz.description}</p>

                                                <dl className="quiz-meta">
                                                    <div className="quiz-meta-item">
                                                        <dt className="meta-label">Questions:</dt>
                                                        <dd className="meta-value">{quiz.questionCount}</dd>
                                                    </div>
                                                    <div className="quiz-meta-item">
                                                        <dt className="meta-label">Time:</dt>
                                                        <dd className="meta-value">~{quiz.estimatedTime} min</dd>
                                                    </div>
                                                </dl>
                                            </div>

                                            <div className="quiz-card-footer">
                                                <Button variant="primary" fullWidth onClick={() => handleQuizClick(quiz)}>
                                                    Start Quiz
                                                </Button>
                                            </div>
                                        </Card>
                                    </motion.article>
                                )) : (
                                    <motion.div
                                        className="no-quizzes-found"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        key="no-results"
                                    >
                                        <p>No quizzes found matching your criteria.</p>
                                        <Button variant="ghost" onClick={() => { setSearchQuery(''); setCategoryFilter('all'); setDifficultyFilter('all'); }}>
                                            Clear Filters
                                        </Button>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    )}
                </section>

                {/* Quick Links */}
                <motion.section
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                    className="quick-links-section"
                    aria-labelledby="quick-links-title"
                >
                    <h3 id="quick-links-title" className="section-title">Quick Links</h3>
                    <nav className="quick-links-grid" aria-label="Quick navigation links">
                        <Card className="quick-link-card" clickable onClick={() => navigate('/leaderboard')}>
                            <Trophy size={32} className="quick-link-icon" />
                            <div className="quick-link-text">
                                <h4 className="quick-link-title">Leaderboard</h4>
                                <p className="quick-link-desc">See how you rank</p>
                            </div>
                        </Card>

                        <Card className="quick-link-card" clickable onClick={() => navigate('/analytics')}>
                            <TrendingUp size={32} className="quick-link-icon" />
                            <div className="quick-link-text">
                                <h4 className="quick-link-title">Analytics</h4>
                                <p className="quick-link-desc">Track your progress</p>
                            </div>
                        </Card>

                        <Card className="quick-link-card" clickable onClick={() => navigate('/profile')}>
                            <Brain size={32} className="quick-link-icon" />
                            <div className="quick-link-text">
                                <h4 className="quick-link-title">Profile</h4>
                                <p className="quick-link-desc">View achievements</p>
                            </div>
                        </Card>
                    </nav>
                </motion.section>
            </div>

            {/* Quiz Mode Selection Modal */}
            <QuizModeModal
                isOpen={!!quizToStart}
                onClose={() => setQuizToStart(null)}
                onSelectMode={handleModeSelect}
                quizTitle={quizToStart?.title}
                questionCount={quizToStart?.questionCount}
                estimatedTime={quizToStart?.estimatedTime}
            />
        </main>
    );
};

export default DashboardPage;
