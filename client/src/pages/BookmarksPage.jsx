import { useState, useMemo } from 'react';
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
import './BookmarksPage.css';

// Hardcoded bookmarked questions data
const hardcodedBookmarks = [
    {
        id: 'dsa-basics_1',
        quizId: 'dsa-basics',
        quizTitle: 'DSA Basics',
        category: 'Data Structures & Algorithms',
        questionId: 1,
        questionText: 'What is the time complexity of accessing an element in an array by index?',
        options: [
            { id: 'A', text: 'O(1)', isCorrect: true },
            { id: 'B', text: 'O(n)', isCorrect: false },
            { id: 'C', text: 'O(log n)', isCorrect: false },
            { id: 'D', text: 'O(n²)', isCorrect: false }
        ],
        explanation: 'Array access by index is O(1) because arrays store elements in contiguous memory locations, allowing direct calculation of memory address.',
        bookmarkedAt: Date.now() - 86400000 * 2
    },
    {
        id: 'dsa-basics_2',
        quizId: 'dsa-basics',
        quizTitle: 'DSA Basics',
        category: 'Data Structures & Algorithms',
        questionId: 2,
        questionText: 'Which data structure uses LIFO (Last In First Out) principle?',
        options: [
            { id: 'A', text: 'Queue', isCorrect: false },
            { id: 'B', text: 'Stack', isCorrect: true },
            { id: 'C', text: 'Tree', isCorrect: false },
            { id: 'D', text: 'Graph', isCorrect: false }
        ],
        explanation: 'Stack follows LIFO principle - the last element added is the first one to be removed. Think of a stack of plates!',
        bookmarkedAt: Date.now() - 86400000
    },
    {
        id: 'dsa-basics_3',
        quizId: 'dsa-basics',
        quizTitle: 'DSA Basics',
        category: 'Data Structures & Algorithms',
        questionId: 3,
        questionText: 'What is the worst-case time complexity of Quick Sort?',
        options: [
            { id: 'A', text: 'O(n log n)', isCorrect: false },
            { id: 'B', text: 'O(n)', isCorrect: false },
            { id: 'C', text: 'O(n²)', isCorrect: true },
            { id: 'D', text: 'O(log n)', isCorrect: false }
        ],
        explanation: 'Quick Sort has O(n²) worst case when the pivot selection is poor (already sorted array with first/last element as pivot).',
        bookmarkedAt: Date.now() - 3600000
    },
    {
        id: 'operating-systems_1',
        quizId: 'operating-systems',
        quizTitle: 'Operating Systems',
        category: 'Operating Systems',
        questionId: 1,
        questionText: 'What is a process in an operating system?',
        options: [
            { id: 'A', text: 'A program in execution', isCorrect: true },
            { id: 'B', text: 'A stored program', isCorrect: false },
            { id: 'C', text: 'A system call', isCorrect: false },
            { id: 'D', text: 'A hardware component', isCorrect: false }
        ],
        explanation: 'A process is an instance of a program that is being executed. It includes the program code, current activity, and allocated resources.',
        bookmarkedAt: Date.now() - 86400000 * 3
    },
    {
        id: 'operating-systems_2',
        quizId: 'operating-systems',
        quizTitle: 'Operating Systems',
        category: 'Operating Systems',
        questionId: 2,
        questionText: 'Which scheduling algorithm may cause starvation?',
        options: [
            { id: 'A', text: 'Round Robin', isCorrect: false },
            { id: 'B', text: 'First Come First Serve', isCorrect: false },
            { id: 'C', text: 'Shortest Job First', isCorrect: true },
            { id: 'D', text: 'FIFO', isCorrect: false }
        ],
        explanation: 'SJF can cause starvation because longer processes may wait indefinitely if shorter processes keep arriving.',
        bookmarkedAt: Date.now() - 86400000 * 2
    },
    {
        id: 'dbms-fundamentals_1',
        quizId: 'dbms-fundamentals',
        quizTitle: 'DBMS Fundamentals',
        category: 'Database Management',
        questionId: 1,
        questionText: 'What does ACID stand for in database transactions?',
        options: [
            { id: 'A', text: 'Atomic, Consistent, Isolated, Durable', isCorrect: true },
            { id: 'B', text: 'Automatic, Complete, Independent, Dynamic', isCorrect: false },
            { id: 'C', text: 'Active, Continuous, Immediate, Direct', isCorrect: false },
            { id: 'D', text: 'Atomic, Complete, Immediate, Dynamic', isCorrect: false }
        ],
        explanation: 'ACID properties ensure reliable database transactions: Atomicity (all or nothing), Consistency (valid state), Isolation (concurrent safety), Durability (permanent).',
        bookmarkedAt: Date.now() - 86400000 * 5
    },
    {
        id: 'dbms-fundamentals_2',
        quizId: 'dbms-fundamentals',
        quizTitle: 'DBMS Fundamentals',
        category: 'Database Management',
        questionId: 2,
        questionText: 'What is normalization in DBMS?',
        options: [
            { id: 'A', text: 'Adding redundant data', isCorrect: false },
            { id: 'B', text: 'Organizing data to reduce redundancy', isCorrect: true },
            { id: 'C', text: 'Creating backup of data', isCorrect: false },
            { id: 'D', text: 'Encrypting data', isCorrect: false }
        ],
        explanation: 'Normalization is the process of organizing data in a database to reduce redundancy and improve data integrity through a series of normal forms.',
        bookmarkedAt: Date.now() - 86400000 * 4
    },
    {
        id: 'web-development_1',
        quizId: 'web-development',
        quizTitle: 'Web Development',
        category: 'Web Development',
        questionId: 1,
        questionText: 'What does CSS stand for?',
        options: [
            { id: 'A', text: 'Computer Style Sheets', isCorrect: false },
            { id: 'B', text: 'Cascading Style Sheets', isCorrect: true },
            { id: 'C', text: 'Creative Style Sheets', isCorrect: false },
            { id: 'D', text: 'Colorful Style Sheets', isCorrect: false }
        ],
        explanation: 'CSS stands for Cascading Style Sheets. It describes how HTML elements should be displayed on screen.',
        bookmarkedAt: Date.now() - 86400000 * 6
    },
    {
        id: 'web-development_2',
        quizId: 'web-development',
        quizTitle: 'Web Development',
        category: 'Web Development',
        questionId: 2,
        questionText: 'Which HTTP method is used to update a resource?',
        options: [
            { id: 'A', text: 'GET', isCorrect: false },
            { id: 'B', text: 'POST', isCorrect: false },
            { id: 'C', text: 'PUT', isCorrect: true },
            { id: 'D', text: 'DELETE', isCorrect: false }
        ],
        explanation: 'PUT method is used to update an existing resource. POST is for creating, GET for reading, DELETE for removing.',
        bookmarkedAt: Date.now() - 86400000
    },
    {
        id: 'oops_1',
        quizId: 'oops-concepts',
        quizTitle: 'OOPs Concepts',
        category: 'Object Oriented Programming',
        questionId: 1,
        questionText: 'Which OOP concept is used to hide implementation details?',
        options: [
            { id: 'A', text: 'Inheritance', isCorrect: false },
            { id: 'B', text: 'Polymorphism', isCorrect: false },
            { id: 'C', text: 'Encapsulation', isCorrect: true },
            { id: 'D', text: 'Abstraction', isCorrect: false }
        ],
        explanation: 'Encapsulation bundles data and methods together, hiding internal implementation details and exposing only necessary interfaces.',
        bookmarkedAt: Date.now() - 86400000 * 7
    },
    {
        id: 'networks_1',
        quizId: 'computer-networks',
        quizTitle: 'Computer Networks',
        category: 'Computer Networks',
        questionId: 1,
        questionText: 'Which layer of OSI model is responsible for routing?',
        options: [
            { id: 'A', text: 'Data Link Layer', isCorrect: false },
            { id: 'B', text: 'Network Layer', isCorrect: true },
            { id: 'C', text: 'Transport Layer', isCorrect: false },
            { id: 'D', text: 'Session Layer', isCorrect: false }
        ],
        explanation: 'The Network Layer (Layer 3) handles routing, forwarding packets between different networks using IP addresses.',
        bookmarkedAt: Date.now() - 86400000 * 8
    }
];

// Category icons mapping
const categoryIcons = {
    'Data Structures & Algorithms': Code,
    'Operating Systems': Cpu,
    'Database Management': Database,
    'Web Development': Globe,
    'Object Oriented Programming': Layers,
    'Computer Networks': Globe
};

// Get unique categories
const categories = [...new Set(hardcodedBookmarks.map(b => b.category))];

const BookmarksPage = () => {
    const [bookmarks, setBookmarks] = useState(hardcodedBookmarks);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [expandedCards, setExpandedCards] = useState({});
    const [showFilters, setShowFilters] = useState(false);

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

    const removeBookmark = (id) => {
        setBookmarks(prev => prev.filter(b => b.id !== id));
    };

    const clearAllBookmarks = () => {
        if (window.confirm('Are you sure you want to remove all bookmarks?')) {
            setBookmarks([]);
        }
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
                                variant="ghost" 
                                size="sm"
                                onClick={clearAllBookmarks}
                                className="clear-all-btn"
                            >
                                <Trash2 size={16} />
                                Clear All
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
                {filteredBookmarks.length === 0 ? (
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
                                                                onClick={() => removeBookmark(bookmark.id)}
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
