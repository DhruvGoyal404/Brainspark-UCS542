import { useState, useMemo } from 'react';
import { useToast } from '../components/ui/Toast';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    Bookmark, 
    Search, 
    Filter, 
    Trash2, 
    ChevronDown, 
    ChevronUp,
    BookOpen,
    Code,
    Database,
    Globe,
    Cpu,
    Layers,
    X,
    CheckCircle
} from 'lucide-react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import useBookmarks from '../hooks/useBookmarks';
import './BookmarksPage.css';

// Category icons mapping
const categoryIcons = {
    'Data Structures & Algorithms': Code,
    'Operating Systems': Cpu,
    'Database Management': Database,
    'Web Development': Globe,
    'Object Oriented Programming': Layers,
    'Computer Networks': Globe
};

const BookmarksPage = () => {
    const { bookmarks: apiBookmarks, loading, removeBookmark: removeBookmarkById, clearAllBookmarks: clearAllApi } = useBookmarks();
    const toast = useToast();
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [expandedCards, setExpandedCards] = useState({});
    const [showFilters, setShowFilters] = useState(false);
    const [confirmClear, setConfirmClear] = useState(false);

    // Normalize bookmarks from API to display format
    const bookmarks = useMemo(() => apiBookmarks.map(b => ({
        id: b._id || `${b.quizId}_${b.questionIndex}`,
        quizId: b.quizId,
        quizTitle: b.quizTitle || b.quizId,
        category: b.quizTitle || b.quizId, // fallback grouping
        questionId: b.questionIndex,
        questionText: b.questionText,
        options: b.options || [],
        explanation: b.explanation || '',
        bookmarkedAt: new Date(b.createdAt).getTime() || Date.now()
    })), [apiBookmarks]);

    const categories = useMemo(() => [...new Set(bookmarks.map(b => b.category))], [bookmarks]);

    // Filter bookmarks based on search and category
    const filteredBookmarks = useMemo(() => {
        return bookmarks.filter(bookmark => {
            const matchesSearch = searchQuery === '' || 
                bookmark.questionText.toLowerCase().includes(searchQuery.toLowerCase()) ||
                bookmark.explanation.toLowerCase().includes(searchQuery.toLowerCase()) ||
                bookmark.quizTitle.toLowerCase().includes(searchQuery.toLowerCase());
            
            const matchesCategory = selectedCategory === 'all' || 
                bookmark.category === selectedCategory;

            return matchesSearch && matchesCategory;
        });
    }, [bookmarks, searchQuery, selectedCategory]);

    // Group bookmarks by category for display
    const groupedBookmarks = useMemo(() => {
        return filteredBookmarks.reduce((acc, bookmark) => {
            if (!acc[bookmark.category]) {
                acc[bookmark.category] = [];
            }
            acc[bookmark.category].push(bookmark);
            return acc;
        }, {});
    }, [filteredBookmarks]);

    const toggleCardExpand = (id) => {
        setExpandedCards(prev => ({
            ...prev,
            [id]: !prev[id]
        }));
    };

    const removeBookmark = (bookmark) => {
        removeBookmarkById(bookmark.quizId, bookmark.questionId);
    };

    const clearAllBookmarks = async () => {
        if (!confirmClear) {
            setConfirmClear(true);
            setTimeout(() => setConfirmClear(false), 3000);
            return;
        }
        setConfirmClear(false);
        await clearAllApi();
        toast.success('All bookmarks cleared');
    };

    const formatDate = (timestamp) => {
        const date = new Date(timestamp);
        return date.toLocaleDateString('en-US', { 
            month: 'short', 
            day: 'numeric',
            year: 'numeric'
        });
    };

    return (
        <div className="bookmarks-page">
            <div className="bookmarks-container container">
                {/* Header */}
                <motion.div 
                    className="bookmarks-header"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    <div className="header-content">
                        <div className="header-title-section">
                            <Bookmark className="header-icon" size={32} />
                            <div>
                                <h1 className="page-title">Bookmarked Questions</h1>
                                <p className="page-subtitle">
                                    {bookmarks.length} questions saved for review
                                </p>
                            </div>
                        </div>
                        {bookmarks.length > 0 && (
                            <Button
                                variant={confirmClear ? 'danger' : 'ghost'}
                                size="sm"
                                onClick={clearAllBookmarks}
                                className="clear-all-btn"
                            >
                                <Trash2 size={16} />
                                {confirmClear ? 'Tap again to confirm' : 'Clear All'}
                            </Button>
                        )}
                    </div>
                </motion.div>

                {/* Search and Filters */}
                <motion.div 
                    className="search-filter-section"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                >
                    <div className="search-bar">
                        <Search className="search-icon" size={20} />
                        <input
                            type="text"
                            placeholder="Search questions, explanations, or quizzes..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="search-input"
                        />
                        {searchQuery && (
                            <button 
                                className="clear-search"
                                onClick={() => setSearchQuery('')}
                            >
                                <X size={16} />
                            </button>
                        )}
                    </div>

                    <button 
                        className={`filter-toggle ${showFilters ? 'active' : ''}`}
                        onClick={() => setShowFilters(!showFilters)}
                    >
                        <Filter size={18} />
                        Filters
                        {selectedCategory !== 'all' && (
                            <span className="filter-badge">1</span>
                        )}
                    </button>
                </motion.div>

                {/* Filter Pills */}
                <AnimatePresence>
                    {showFilters && (
                        <motion.div 
                            className="filter-pills"
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                        >
                            <button
                                className={`filter-pill ${selectedCategory === 'all' ? 'active' : ''}`}
                                onClick={() => setSelectedCategory('all')}
                            >
                                <BookOpen size={14} />
                                All Subjects
                            </button>
                            {categories.map(category => {
                                const IconComponent = categoryIcons[category] || BookOpen;
                                const count = bookmarks.filter(b => b.category === category).length;
                                return (
                                    <button
                                        key={category}
                                        className={`filter-pill ${selectedCategory === category ? 'active' : ''}`}
                                        onClick={() => setSelectedCategory(category)}
                                    >
                                        <IconComponent size={14} />
                                        {category}
                                        <span className="pill-count">{count}</span>
                                    </button>
                                );
                            })}
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Results Summary */}
                {searchQuery || selectedCategory !== 'all' ? (
                    <div className="results-summary">
                        Showing {filteredBookmarks.length} of {bookmarks.length} bookmarks
                        {selectedCategory !== 'all' && (
                            <span className="active-filter">
                                in {selectedCategory}
                                <button onClick={() => setSelectedCategory('all')}>
                                    <X size={12} />
                                </button>
                            </span>
                        )}
                    </div>
                ) : null}

                {/* Bookmarks List */}
                {loading ? (
                    <div style={{ display: 'flex', justifyContent: 'center', padding: '60px 0' }}>
                        <div className="spinner spinner-lg"></div>
                    </div>
                ) : filteredBookmarks.length === 0 ? (
                    <motion.div 
                        className="empty-state"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                    >
                        <Bookmark className="empty-icon" size={64} />
                        <h3>No Bookmarks Found</h3>
                        <p>
                            {searchQuery || selectedCategory !== 'all' 
                                ? "Try adjusting your search or filters"
                                : "Bookmark questions during quizzes to review them later"}
                        </p>
                    </motion.div>
                ) : (
                    <div className="bookmarks-list">
                        {Object.entries(groupedBookmarks).map(([category, questions], groupIndex) => {
                            const IconComponent = categoryIcons[category] || BookOpen;
                            return (
                                <motion.div 
                                    key={category}
                                    className="category-group"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: groupIndex * 0.1 }}
                                >
                                    <div className="category-header">
                                        <IconComponent size={20} />
                                        <h2>{category}</h2>
                                        <span className="question-count">{questions.length} questions</span>
                                    </div>
                                    
                                    <div className="questions-grid">
                                        {questions.map((bookmark, index) => (
                                            <motion.div
                                                key={bookmark.id}
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ delay: index * 0.05 }}
                                            >
                                                <Card className={`bookmark-card ${expandedCards[bookmark.id] ? 'expanded' : ''}`}>
                                                    <div className="card-header">
                                                        <span className="quiz-badge">{bookmark.quizTitle}</span>
                                                        <div className="card-actions">
                                                            <span className="bookmark-date">
                                                                {formatDate(bookmark.bookmarkedAt)}
                                                            </span>
                                                            <button 
                                                                className="remove-btn"
                                                                onClick={() => removeBookmark(bookmark)}
                                                                title="Remove bookmark"
                                                            >
                                                                <Trash2 size={16} />
                                                            </button>
                                                        </div>
                                                    </div>

                                                    <h3 className="question-text">{bookmark.questionText}</h3>

                                                    <div className="options-list">
                                                        {bookmark.options.map(option => (
                                                            <div 
                                                                key={option.id}
                                                                className={`option-item ${option.isCorrect ? 'correct' : ''}`}
                                                            >
                                                                <span className="option-letter">{option.id}</span>
                                                                <span className="option-text">{option.text}</span>
                                                                {option.isCorrect && (
                                                                    <CheckCircle className="correct-icon" size={16} />
                                                                )}
                                                            </div>
                                                        ))}
                                                    </div>

                                                    <button 
                                                        className="expand-btn"
                                                        onClick={() => toggleCardExpand(bookmark.id)}
                                                    >
                                                        {expandedCards[bookmark.id] ? (
                                                            <>
                                                                <ChevronUp size={16} />
                                                                Hide Explanation
                                                            </>
                                                        ) : (
                                                            <>
                                                                <ChevronDown size={16} />
                                                                Show Explanation
                                                            </>
                                                        )}
                                                    </button>

                                                    <AnimatePresence>
                                                        {expandedCards[bookmark.id] && (
                                                            <motion.div 
                                                                className="explanation-section"
                                                                initial={{ opacity: 0, height: 0 }}
                                                                animate={{ opacity: 1, height: 'auto' }}
                                                                exit={{ opacity: 0, height: 0 }}
                                                            >
                                                                <div className="explanation-content">
                                                                    <strong>Explanation:</strong>
                                                                    <p>{bookmark.explanation}</p>
                                                                </div>
                                                            </motion.div>
                                                        )}
                                                    </AnimatePresence>
                                                </Card>
                                            </motion.div>
                                        ))}
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
};

export default BookmarksPage;
