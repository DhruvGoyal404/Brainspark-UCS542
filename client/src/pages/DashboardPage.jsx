import { useState, useMemo } from 'react';
import ConfirmationModal from '../components/ui/ConfirmationModal';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Brain, Code, Database, Server, Trophy, Flame, TrendingUp, LayoutGrid, List, Search, Network, Cpu, BookOpen } from 'lucide-react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import './DashboardPage.css';

const DashboardPage = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [quizToStart, setQuizToStart] = useState(null);
    const [quizViewMode, setQuizViewMode] = useState('card');
    const [searchQuery, setSearchQuery] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('all');
    const [difficultyFilter, setDifficultyFilter] = useState('all');

    const handleQuizClick = (quizId, quizTitle) => {
        setQuizToStart({ id: quizId, title: quizTitle });
    };

    const confirmStartQuiz = () => {
        navigate(`/quiz/${quizToStart.id}`);
    };

    // Mock quiz data - expanded with more subjects
    const quizzes = useMemo(() => [
        {
            id: 'dsa-basics',
            title: 'DSA Basics',
            description: 'Master fundamental data structures and algorithms',
            category: 'Data Structures',
            difficulty: 'Easy',
            questionCount: 15,
            estimatedTime: 20,
            icon: <Brain size={32} />,
            color: 'hsl(243, 75%, 59%)'
        },
        {
            id: 'advanced-dsa',
            title: 'Advanced DSA',
            description: 'Complex algorithms, dynamic programming, and graphs',
            category: 'Data Structures',
            difficulty: 'Hard',
            questionCount: 25,
            estimatedTime: 35,
            icon: <Code size={32} />,
            color: 'hsl(0, 84%, 60%)'
        },
        {
            id: 'operating-systems',
            title: 'Operating Systems',
            description: 'Learn OS concepts, processes, and memory management',
            category: 'Operating Systems',
            difficulty: 'Medium',
            questionCount: 20,
            estimatedTime: 25,
            icon: <Server size={32} />,
            color: 'hsl(160, 84%, 39%)'
        },
        {
            id: 'dbms-fundamentals',
            title: 'DBMS Fundamentals',
            description: 'Database concepts, SQL, and normalization',
            category: 'Database',
            difficulty: 'Medium',
            questionCount: 18,
            estimatedTime: 22,
            icon: <Database size={32} />,
            color: 'hsl(31, 100%, 63%)'
        },
        {
            id: 'computer-networks',
            title: 'Computer Networks',
            description: 'Networking protocols, OSI model, and TCP/IP',
            category: 'Networks',
            difficulty: 'Medium',
            questionCount: 20,
            estimatedTime: 25,
            icon: <Network size={32} />,
            color: 'hsl(199, 89%, 48%)'
        },
        {
            id: 'oops-concepts',
            title: 'OOPs Concepts',
            description: 'Object-oriented programming principles and design patterns',
            category: 'OOPs',
            difficulty: 'Easy',
            questionCount: 15,
            estimatedTime: 18,
            icon: <Cpu size={32} />,
            color: 'hsl(280, 75%, 55%)'
        },
        {
            id: 'system-design',
            title: 'System Design Basics',
            description: 'Learn to design scalable systems and architectures',
            category: 'System Design',
            difficulty: 'Hard',
            questionCount: 12,
            estimatedTime: 30,
            icon: <BookOpen size={32} />,
            color: 'hsl(340, 80%, 55%)'
        }
    ], []);

    const getDifficultyColor = (difficulty) => {
        switch (difficulty.toLowerCase()) {
            case 'easy':
                return 'var(--success)';
            case 'medium':
                return 'var(--warning)';
            case 'hard':
                return 'var(--error)';
            default:
                return 'var(--text-secondary)';
        }
    };

    // Filter quizzes based on search and filters - using useMemo for performance
    const filteredQuizzes = useMemo(() => {
        return quizzes.filter(quiz => {
            // Search filter - empty string matches all
            const searchTerm = searchQuery.trim().toLowerCase();
            const matchesSearch = searchTerm === '' || 
                quiz.title.toLowerCase().includes(searchTerm) ||
                quiz.description.toLowerCase().includes(searchTerm) ||
                quiz.category.toLowerCase().includes(searchTerm);
            
            // Category filter
            const matchesCategory = categoryFilter === 'all' || quiz.category === categoryFilter;
            
            // Difficulty filter
            const matchesDifficulty = difficultyFilter === 'all' || quiz.difficulty.toLowerCase() === difficultyFilter;
            
            return matchesSearch && matchesCategory && matchesDifficulty;
        });
    }, [quizzes, searchQuery, categoryFilter, difficultyFilter]);

    // Get unique categories for filter dropdown
    const categories = useMemo(() => [...new Set(quizzes.map(q => q.category))], [quizzes]);

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
                            <h3 id="daily-goal-title" className="daily-goal-title">Daily Goal</h3>
                            <span className="daily-goal-progress-text">0 / 3 quizzes</span>
                        </div>
                        <div className="progress-bar">
                            <div className="progress-fill" style={{ width: '0%' }}></div>
                        </div>
                        <p className="daily-goal-message">Complete 3 quizzes today to maintain your streak!</p>
                    </Card>
                </motion.section>

                {/* Available Quizzes */}
                <section className="quizzes-section" aria-labelledby="quizzes-title">
                    <header className="section-header">
                        <div className="section-header-content">
                            <h2 id="quizzes-title" className="section-title">Available Quizzes</h2>
                            <p className="section-subtitle">Choose a quiz to test your knowledge</p>
                        </div>
                        <div className="view-toggle">
                            <button 
                                className={`view-toggle-btn ${quizViewMode === 'card' ? 'active' : ''}`}
                                onClick={() => setQuizViewMode('card')}
                                aria-label="Card view"
                            >
                                <LayoutGrid size={18} />
                            </button>
                            <button 
                                className={`view-toggle-btn ${quizViewMode === 'list' ? 'active' : ''}`}
                                onClick={() => setQuizViewMode('list')}
                                aria-label="List view"
                            >
                                <List size={18} />
                            </button>
                        </div>
                    </header>

                    {/* Search and Filter Bar */}
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
                            <select
                                value={categoryFilter}
                                onChange={(e) => setCategoryFilter(e.target.value)}
                                className="filter-select"
                            >
                                <option value="all">All Subjects</option>
                                {categories.map(cat => (
                                    <option key={cat} value={cat}>{cat}</option>
                                ))}
                            </select>
                            <select
                                value={difficultyFilter}
                                onChange={(e) => setDifficultyFilter(e.target.value)}
                                className="filter-select"
                            >
                                <option value="all">All Levels</option>
                                <option value="easy">Easy</option>
                                <option value="medium">Medium</option>
                                <option value="hard">Hard</option>
                            </select>
                            {(categoryFilter !== 'all' || difficultyFilter !== 'all' || searchQuery) && (
                                <Button 
                                    variant="ghost" 
                                    size="sm"
                                    onClick={() => { 
                                        setSearchQuery(''); 
                                        setCategoryFilter('all'); 
                                        setDifficultyFilter('all'); 
                                    }}
                                >
                                    Clear
                                </Button>
                            )}
                        </div>
                    </div>

                    <div className={quizViewMode === 'card' ? 'quizzes-grid' : 'quizzes-list'}>
                        <AnimatePresence mode="popLayout">
                            {filteredQuizzes.length > 0 ? filteredQuizzes.map((quiz) => (
                                <motion.article 
                                    key={quiz.id} 
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
                                        <Button
                                            variant="primary"
                                            fullWidth
                                            onClick={() => handleQuizClick(quiz.id, quiz.title)}
                                        >
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

            {/* Quiz Start Confirmation */}
            <ConfirmationModal
                isOpen={!!quizToStart}
                onClose={() => setQuizToStart(null)}
                onConfirm={confirmStartQuiz}
                title="Ready to Start?"
                message={`You're about to begin "${quizToStart?.title}". Make sure you're ready!`}
                confirmText="Start Quiz"
                cancelText="Not Yet"
            />
        </main>
    );
};

export default DashboardPage;
