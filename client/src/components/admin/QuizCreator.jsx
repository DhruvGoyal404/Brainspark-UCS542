import { useState } from 'react';
import { Plus, Save, X, GripVertical, FileText } from 'lucide-react';
import Card from '../ui/Card';
import Button from '../ui/Button';
import Input from '../ui/Input';
import Select from '../ui/Select';
import Checkbox from '../ui/Checkbox';
import Toast from '../ui/Toast';
import api from '../../utils/api';
import './QuizCreator.css';

const QuizCreator = () => {
    const [quizData, setQuizData] = useState({
        title: '',
        description: '',
        category: '',
        difficulty: 'medium',
        estimatedTime: 15,
    });

    const [questions, setQuestions] = useState([]);
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState('');

    const addQuestion = () => {
        setQuestions([
            ...questions,
            {
                id: Date.now(),
                questionText: '',
                options: [
                    { id: 'A', text: '', isCorrect: false },
                    { id: 'B', text: '', isCorrect: false },
                    { id: 'C', text: '', isCorrect: false },
                    { id: 'D', text: '', isCorrect: false },
                ],
                explanation: '',
                difficulty: 'medium',
            },
        ]);
    };

    const removeQuestion = (id) => {
        setQuestions(questions.filter(q => q.id !== id));
    };

    const updateQuestion = (id, field, value) => {
        setQuestions(questions.map(q =>
            q.id === id ? { ...q, [field]: value } : q
        ));
    };

    const updateOption = (questionId, optionId, field, value) => {
        setQuestions(questions.map(q => {
            if (q.id === questionId) {
                return {
                    ...q,
                    options: q.options.map(opt => {
                        if (opt.id === optionId) {
                            // If setting as correct, uncheck others
                            if (field === 'isCorrect' && value) {
                                return { ...opt, [field]: value };
                            }
                            return { ...opt, [field]: value };
                        }
                        // Uncheck other options when one is checked
                        if (field === 'isCorrect' && value) {
                            return { ...opt, isCorrect: false };
                        }
                        return opt;
                    }),
                };
            }
            return q;
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validation
        if (!quizData.title || !quizData.category) {
            setToastMessage('Please fill in quiz title and category');
            setShowToast(true);
            return;
        }

        if (questions.length === 0) {
            setToastMessage('Please add at least one question');
            setShowToast(true);
            return;
        }

        // Check if all questions have correct answers
        const invalidQuestions = questions.filter(q =>
            !q.questionText || q.options.every(opt => !opt.isCorrect) || q.options.some(opt => !opt.text)
        );

        if (invalidQuestions.length > 0) {
            setToastMessage('Please ensure all questions have text, options, and a correct answer');
            setShowToast(true);
            return;
        }

        try {
            // Generate unique quiz ID
            const quizId = `quiz-${Date.now()}`;

            await api.post('/admin/quiz', {
                id: quizId,
                title: quizData.title,
                description: quizData.description,
                category: quizData.category,
                difficulty: quizData.difficulty,
                questions: questions.map(q => ({
                    questionText: q.questionText,
                    options: q.options,
                    explanation: q.explanation,
                    difficulty: q.difficulty,
                })),
                metadata: {
                    estimatedTime: quizData.estimatedTime,
                    totalQuestions: questions.length
                }
            });

            setToastMessage('Quiz created successfully!');
            setShowToast(true);

            // Reset form
            setQuizData({
                title: '',
                description: '',
                category: '',
                difficulty: 'medium',
                estimatedTime: 15,
            });
            setQuestions([]);
        } catch (error) {
            setToastMessage(error.response?.data?.message || 'Failed to create quiz');
            setShowToast(true);
        }
    };

    return (
        <div className="quiz-creator">
            <Card className="creator-card">
                <h2 className="creator-title">Create New Quiz</h2>

                <form onSubmit={handleSubmit}>
                    {/* Quiz Metadata */}
                    <div className="form-section">
                        <h3 className="section-title">Quiz Details</h3>
                        <div className="form-grid">
                            <Input
                                label="Quiz Title"
                                value={quizData.title}
                                onChange={(e) => setQuizData({ ...quizData, title: e.target.value })}
                                required
                                placeholder="e.g., DSA Fundamentals"
                            />

                            <Select
                                label="Category"
                                value={quizData.category}
                                onChange={(e) => setQuizData({ ...quizData, category: e.target.value })}
                                options={[
                                    { value: 'dsa', label: 'Data Structures & Algorithms' },
                                    { value: 'dbms', label: 'Database Management' },
                                    { value: 'operating-systems', label: 'Operating Systems' },
                                    { value: 'networks', label: 'Computer Networks' },
                                    { value: 'other', label: 'Other' },
                                ]}
                                required
                            />

                            <Select
                                label="Difficulty"
                                value={quizData.difficulty}
                                onChange={(e) => setQuizData({ ...quizData, difficulty: e.target.value })}
                                options={[
                                    { value: 'easy', label: 'Easy' },
                                    { value: 'medium', label: 'Medium' },
                                    { value: 'hard', label: 'Hard' },
                                ]}
                            />

                            <Input
                                label="Estimated Time (minutes)"
                                type="number"
                                value={quizData.estimatedTime}
                                onChange={(e) => setQuizData({ ...quizData, estimatedTime: parseInt(e.target.value) })}
                                min="1"
                                max="120"
                            />
                        </div>

                        <Input
                            label="Description"
                            value={quizData.description}
                            onChange={(e) => setQuizData({ ...quizData, description: e.target.value })}
                            placeholder="Brief description of the quiz..."
                        />
                    </div>

                    {/* Questions */}
                    <div className="form-section">
                        <div className="section-header">
                            <h3 className="section-title">Questions ({questions.length})</h3>
                            <Button
                                type="button"
                                variant="primary"
                                icon={<Plus size={18} />}
                                onClick={addQuestion}
                            >
                                Add Question
                            </Button>
                        </div>

                        <div className="questions-list">
                            {questions.map((question, qIndex) => (
                                <Card key={question.id} className="question-card">
                                    <div className="question-header">
                                        <GripVertical className="drag-handle" size={20} />
                                        <span className="question-number">Question {qIndex + 1}</span>
                                        <Button
                                            type="button"
                                            variant="danger"
                                            size="sm"
                                            icon={<X size={16} />}
                                            onClick={() => removeQuestion(question.id)}
                                        >
                                            Remove
                                        </Button>
                                    </div>

                                    <Input
                                        label="Question Text"
                                        value={question.questionText}
                                        onChange={(e) => updateQuestion(question.id, 'questionText', e.target.value)}
                                        placeholder="Enter your question..."
                                        required
                                    />

                                    <div className="options-grid">
                                        {question.options.map((option) => (
                                            <div key={option.id} className="option-row">
                                                <span className="option-label">{option.id}</span>
                                                <Input
                                                    value={option.text}
                                                    onChange={(e) => updateOption(question.id, option.id, 'text', e.target.value)}
                                                    placeholder={`Option ${option.id}`}
                                                    required
                                                />
                                                <Checkbox
                                                    label="Correct"
                                                    checked={option.isCorrect}
                                                    onChange={(e) => updateOption(question.id, option.id, 'isCorrect', e.target.checked)}
                                                />
                                            </div>
                                        ))}
                                    </div>

                                    <Input
                                        label="Explanation (Optional)"
                                        value={question.explanation}
                                        onChange={(e) => updateQuestion(question.id, 'explanation', e.target.value)}
                                        placeholder="Explain the correct answer..."
                                    />

                                    <Select
                                        label="Question Difficulty"
                                        value={question.difficulty}
                                        onChange={(e) => updateQuestion(question.id, 'difficulty', e.target.value)}
                                        options={[
                                            { value: 'easy', label: 'Easy' },
                                            { value: 'medium', label: 'Medium' },
                                            { value: 'hard', label: 'Hard' },
                                        ]}
                                    />
                                </Card>
                            ))}

                            {questions.length === 0 && (
                                <div className="empty-state">
                                    <FileText size={48} />
                                    <p>No questions yet. Click "Add Question" to get started.</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Submit */}
                    <div className="form-actions">
                        <Button type="submit" variant="primary" size="lg" icon={<Save size={20} />}>
                            Create Quiz
                        </Button>
                    </div>
                </form>
            </Card>

            {showToast && (
                <Toast
                    toast={{
                        message: toastMessage,
                        type: toastMessage.includes('success') ? 'success' : 'error'
                    }}
                    onClose={() => setShowToast(false)}
                />
            )}
        </div>
    );
};

export default QuizCreator;
