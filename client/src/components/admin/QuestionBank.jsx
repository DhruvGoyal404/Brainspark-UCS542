import { useState, useEffect } from 'react';
import { Search, Edit, Trash2, Filter } from 'lucide-react';
import Card from '../ui/Card';
import Button from '../ui/Button';
import Input from '../ui/Input';
import Select from '../ui/Select';
import './QuestionBank.css';

// Hardcoded questions data for demo
const hardcodedQuestions = [
    {
        _id: '1',
        questionText: 'What is the time complexity of accessing an element in an array by index?',
        category: 'dsa',
        difficulty: 'easy',
        quizTitle: 'DSA Basics',
        options: ['O(1)', 'O(n)', 'O(log n)', 'O(n²)'],
        correctAnswer: 0
    },
    {
        _id: '2',
        questionText: 'Which data structure uses LIFO (Last In First Out) principle?',
        category: 'dsa',
        difficulty: 'easy',
        quizTitle: 'DSA Basics',
        options: ['Queue', 'Stack', 'Tree', 'Graph'],
        correctAnswer: 1
    },
    {
        _id: '3',
        questionText: 'What is the worst-case time complexity of Quick Sort?',
        category: 'dsa',
        difficulty: 'medium',
        quizTitle: 'Advanced DSA',
        options: ['O(n log n)', 'O(n)', 'O(n²)', 'O(log n)'],
        correctAnswer: 2
    },
    {
        _id: '4',
        questionText: 'What is the time complexity of binary search?',
        category: 'dsa',
        difficulty: 'easy',
        quizTitle: 'DSA Basics',
        options: ['O(n)', 'O(log n)', 'O(n²)', 'O(1)'],
        correctAnswer: 1
    },
    {
        _id: '5',
        questionText: 'Which traversal of a BST gives elements in sorted order?',
        category: 'dsa',
        difficulty: 'medium',
        quizTitle: 'Advanced DSA',
        options: ['Preorder', 'Postorder', 'Inorder', 'Level order'],
        correctAnswer: 2
    },
    {
        _id: '6',
        questionText: 'What does ACID stand for in database transactions?',
        category: 'dbms',
        difficulty: 'easy',
        quizTitle: 'DBMS Fundamentals',
        options: ['Atomic, Consistent, Isolated, Durable', 'Automatic, Complete, Independent, Dynamic', 'Active, Continuous, Immediate, Direct', 'Atomic, Complete, Immediate, Dynamic'],
        correctAnswer: 0
    },
    {
        _id: '7',
        questionText: 'What is normalization in DBMS?',
        category: 'dbms',
        difficulty: 'medium',
        quizTitle: 'DBMS Fundamentals',
        options: ['Adding redundant data', 'Organizing data to reduce redundancy', 'Creating backup of data', 'Encrypting data'],
        correctAnswer: 1
    },
    {
        _id: '8',
        questionText: 'Which normal form removes partial dependencies?',
        category: 'dbms',
        difficulty: 'hard',
        quizTitle: 'DBMS Advanced',
        options: ['1NF', '2NF', '3NF', 'BCNF'],
        correctAnswer: 1
    },
    {
        _id: '9',
        questionText: 'What is a process in an operating system?',
        category: 'operating-systems',
        difficulty: 'easy',
        quizTitle: 'Operating Systems',
        options: ['A program in execution', 'A stored program', 'A system call', 'A hardware component'],
        correctAnswer: 0
    },
    {
        _id: '10',
        questionText: 'Which scheduling algorithm may cause starvation?',
        category: 'operating-systems',
        difficulty: 'medium',
        quizTitle: 'Operating Systems',
        options: ['Round Robin', 'FCFS', 'Shortest Job First', 'FIFO'],
        correctAnswer: 2
    },
    {
        _id: '11',
        questionText: 'What is a deadlock in operating systems?',
        category: 'operating-systems',
        difficulty: 'medium',
        quizTitle: 'Operating Systems',
        options: ['Process termination', 'CPU overload', 'Circular wait among processes', 'Memory overflow'],
        correctAnswer: 2
    },
    {
        _id: '12',
        questionText: 'Which layer of OSI model is responsible for routing?',
        category: 'networks',
        difficulty: 'easy',
        quizTitle: 'Computer Networks',
        options: ['Data Link Layer', 'Network Layer', 'Transport Layer', 'Session Layer'],
        correctAnswer: 1
    },
    {
        _id: '13',
        questionText: 'What protocol is used for secure web browsing?',
        category: 'networks',
        difficulty: 'easy',
        quizTitle: 'Computer Networks',
        options: ['HTTP', 'FTP', 'HTTPS', 'SMTP'],
        correctAnswer: 2
    },
    {
        _id: '14',
        questionText: 'What is the purpose of DNS?',
        category: 'networks',
        difficulty: 'easy',
        quizTitle: 'Computer Networks',
        options: ['File transfer', 'Domain name to IP resolution', 'Email routing', 'Video streaming'],
        correctAnswer: 1
    },
    {
        _id: '15',
        questionText: 'Which OOP concept allows a class to inherit from another class?',
        category: 'other',
        difficulty: 'easy',
        quizTitle: 'OOPs Concepts',
        options: ['Encapsulation', 'Inheritance', 'Polymorphism', 'Abstraction'],
        correctAnswer: 1
    },
    {
        _id: '16',
        questionText: 'What is method overloading?',
        category: 'other',
        difficulty: 'medium',
        quizTitle: 'OOPs Concepts',
        options: ['Same method name with different parameters', 'Hiding implementation', 'Multiple inheritance', 'Runtime binding'],
        correctAnswer: 0
    },
    {
        _id: '17',
        questionText: 'What does CSS stand for?',
        category: 'other',
        difficulty: 'easy',
        quizTitle: 'Web Development',
        options: ['Computer Style Sheets', 'Cascading Style Sheets', 'Creative Style Sheets', 'Colorful Style Sheets'],
        correctAnswer: 1
    },
    {
        _id: '18',
        questionText: 'Which HTTP method is used to update a resource?',
        category: 'other',
        difficulty: 'medium',
        quizTitle: 'Web Development',
        options: ['GET', 'POST', 'PUT', 'DELETE'],
        correctAnswer: 2
    }
];

const QuestionBank = () => {
    const [questions, setQuestions] = useState(hardcodedQuestions);
    const [filteredQuestions, setFilteredQuestions] = useState(hardcodedQuestions);
    const [searchTerm, setSearchTerm] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('all');
    const [difficultyFilter, setDifficultyFilter] = useState('all');

    useEffect(() => {
        filterQuestions();
    }, [questions, searchTerm, categoryFilter, difficultyFilter]);

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

    const deleteQuestion = (id) => {
        if (!window.confirm('Are you sure you want to delete this question?')) return;
        setQuestions(prev => prev.filter(q => q._id !== id));
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
                            { value: 'dsa', label: 'DSA' },
                            { value: 'dbms', label: 'DBMS' },
                            { value: 'operating-systems', label: 'Operating Systems' },
                            { value: 'networks', label: 'Networks' },
                            { value: 'other', label: 'Other' },
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
