import { useState, useEffect } from 'react';
import { Search, Edit, Trash2, Filter } from 'lucide-react';
import Card from '../ui/Card';
import Button from '../ui/Button';
import Input from '../ui/Input';
import Select from '../ui/Select';
import api from '../../utils/api';
import './QuestionBank.css';

const QuestionBank = () => {
    const [questions, setQuestions] = useState([]);
    const [filteredQuestions, setFilteredQuestions] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('all');
    const [difficultyFilter, setDifficultyFilter] = useState('all');

    useEffect(() => {
        fetchQuestions();
    }, []);

    useEffect(() => {
        filterQuestions();
    }, [questions, searchTerm, categoryFilter, difficultyFilter]);

    const fetchQuestions = async () => {
        try {
            // Note: Backend doesn't have /admin/questions endpoint
            // We'll fetch from quizzes and extract all questions
            const response = await api.get('/quiz');
            // Extract all questions from all quizzes
            const allQuestions = [];
            if (response.data?.data) {
                response.data.data.forEach(quiz => {
                    quiz.questions?.forEach(q => {
                        allQuestions.push({
                            ...q,
                            category: quiz.category,
                            quizTitle: quiz.title
                        });
                    });
                });
            }
            setQuestions(allQuestions);
        } catch (error) {
            console.error('Failed to fetch questions:', error);
            setQuestions([]); // Ensure it's an array even on error
        }
    };

    const filterQuestions = () => {
        let filtered = questions;

        if (searchTerm) {
            filtered = filtered.filter(q =>
                q.questionText?.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        if (categoryFilter !== 'all') {
            filtered = filtered.filter(q => q.category === categoryFilter);
        }

        if (difficultyFilter !== 'all') {
            filtered = filtered.filter(q => q.difficulty === difficultyFilter);
        }

        setFilteredQuestions(filtered);
    };

    const deleteQuestion = async (id) => {
        if (!window.confirm('Are you sure you want to delete this question?')) return;

        try {
            await api.delete(`/admin/questions/${id}`);
            fetchQuestions();
        } catch (error) {
            console.error('Failed to delete question:', error);
        }
    };

    return (
        <div className="question-bank">
            <Card className="bank-card">
                <h2 className="bank-title">Question Bank</h2>

                {/* Filters */}
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
                            { value: 'all', label: 'All Categories' },
                            { value: 'DSA', label: 'DSA' },
                            { value: 'DBMS', label: 'DBMS' },
                            { value: 'OS', label: 'OS' },
                            { value: 'Networks', label: 'Networks' },
                        ]}
                    />

                    <Select
                        value={difficultyFilter}
                        onChange={(e) => setDifficultyFilter(e.target.value)}
                        options={[
                            { value: 'all', label: 'All Difficulties' },
                            { value: 'easy', label: 'Easy' },
                            { value: 'medium', label: 'Medium' },
                            { value: 'hard', label: 'Hard' },
                        ]}
                    />
                </div>

                {/* Questions List */}
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
            </Card>
        </div>
    );
};

export default QuestionBank;
