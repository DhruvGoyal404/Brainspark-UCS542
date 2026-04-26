import { useState, useEffect } from 'react';
import { Search, Edit, Trash2, Filter } from 'lucide-react';
import Card from '../ui/Card';
import Button from '../ui/Button';
import Input from '../ui/Input';
import Select from '../ui/Select';
import './QuestionBank.css';
import api from '../../utils/api';
import useDebounce from '../../hooks/useDebounce';

const QuestionBank = () => {
    const [questions, setQuestions]               = useState([]);
    const [filteredQuestions, setFilteredQuestions] = useState([]);
    const [loading, setLoading]                   = useState(false);
    const [error, setError]                       = useState(null);
    const [searchTerm, setSearchTerm]             = useState('');
    const [categoryFilter, setCategoryFilter]     = useState('all');
    const [difficultyFilter, setDifficultyFilter] = useState('all');

    // Debounce search — avoids re-filtering on every keystroke in a potentially large list
    const debouncedSearch = useDebounce(searchTerm, 350);

    useEffect(() => {
        const fetchQuestions = async () => {
            setLoading(true);
            setError(null);
            try {
                const response = await api.get('/quiz?page=1&limit=1000');
                if (response.data.success && response.data.data) {
                    const allQuestions = [];
                    response.data.data.forEach(quiz => {
                        quiz.questions?.forEach((q, idx) => {
                            allQuestions.push({
                                ...q,
                                _id:       `${quiz.id}_${idx}`,
                                quizId:    quiz.id,
                                quizTitle: quiz.title,
                                category:  quiz.category
                            });
                        });
                    });
                    setQuestions(allQuestions);
                    setFilteredQuestions(allQuestions);
                }
            } catch (err) {
                console.error('Error fetching questions:', err);
                setError('Failed to load questions. Please try again.');
            } finally {
                setLoading(false);
            }
        };

        fetchQuestions();
    }, []);

    // Re-filter whenever debounced search or dropdowns change
    useEffect(() => {
        let filtered = questions;

        if (debouncedSearch) {
            const term = debouncedSearch.toLowerCase();
            filtered = filtered.filter(q =>
                q.questionText?.toLowerCase().includes(term)
            );
        }

        if (categoryFilter !== 'all') {
            filtered = filtered.filter(q => q.category === categoryFilter);
        }

        if (difficultyFilter !== 'all') {
            filtered = filtered.filter(q => q.difficulty === difficultyFilter);
        }

        setFilteredQuestions(filtered);
    }, [questions, debouncedSearch, categoryFilter, difficultyFilter]);

    const deleteQuestion = (id) => {
        if (!window.confirm('Are you sure you want to delete this question?')) return;
        setQuestions(prev => prev.filter(q => q._id !== id));
    };

    return (
        <div className="question-bank">
            <Card className="bank-card">
                <h2 className="bank-title">Question Bank</h2>

                {error && (
                    <div className="error-message">
                        <p>{error}</p>
                    </div>
                )}

                {loading ? (
                    <div className="loading-state">
                        <div className="spinner"></div>
                        <p>Loading questions...</p>
                    </div>
                ) : (
                    <>
                        {/* Filters — search is debounced, dropdowns trigger immediately */}
                        <div className="filters">
                            <Input
                                placeholder="Search questions..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                icon={<Search size={18} />}
                            />

                            <Select
                                value={categoryFilter}
                                onChange={(e) => setCategoryFilter(e.target.value)}
                                options={[
                                    { value: 'all',               label: 'All Categories' },
                                    { value: 'dsa',               label: 'DSA' },
                                    { value: 'dbms',              label: 'DBMS' },
                                    { value: 'operating-systems', label: 'Operating Systems' },
                                    { value: 'networks',          label: 'Networks' },
                                    { value: 'oops',              label: 'OOP' },
                                    { value: 'web',               label: 'Web Dev' },
                                    { value: 'other',             label: 'Other' },
                                ]}
                            />

                            <Select
                                value={difficultyFilter}
                                onChange={(e) => setDifficultyFilter(e.target.value)}
                                options={[
                                    { value: 'all',    label: 'All Difficulties' },
                                    { value: 'easy',   label: 'Easy' },
                                    { value: 'medium', label: 'Medium' },
                                    { value: 'hard',   label: 'Hard' },
                                ]}
                            />
                        </div>

                        <div style={{ color: 'var(--text-secondary)', fontSize: '13px', marginBottom: '12px' }}>
                            Showing {filteredQuestions.length} of {questions.length} questions
                        </div>

                        <div className="questions-list">
                            {filteredQuestions.map((question, index) => (
                                <Card key={question._id} className="question-item">
                                    <div className="question-content">
                                        <span className="question-index">#{index + 1}</span>
                                        <div className="question-details">
                                            <p className="question-text">{question.questionText}</p>
                                            <div className="question-meta">
                                                <span className={`difficulty-badge ${question.difficulty}`}>
                                                    {question.difficulty}
                                                </span>
                                                <span className="category-badge">{question.category}</span>
                                                <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
                                                    {question.quizTitle}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="question-actions">
                                        <Button variant="outline" size="sm" icon={<Edit size={16} />}>
                                            Edit
                                        </Button>
                                        <Button
                                            variant="danger"
                                            size="sm"
                                            icon={<Trash2 size={16} />}
                                            onClick={() => deleteQuestion(question._id)}
                                        >
                                            Delete
                                        </Button>
                                    </div>
                                </Card>
                            ))}

                            {filteredQuestions.length === 0 && (
                                <div className="empty-state">
                                    <Filter size={48} />
                                    <p>No questions found matching your filters.</p>
                                </div>
                            )}
                        </div>
                    </>
                )}
            </Card>
        </div>
    );
};

export default QuestionBank;
