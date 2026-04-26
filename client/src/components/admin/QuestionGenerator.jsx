import { useState } from 'react';
import { Sparkles, Save, RefreshCw, ChevronDown, ChevronUp, CheckCircle } from 'lucide-react';
import Card from '../ui/Card';
import Button from '../ui/Button';
import Input from '../ui/Input';
import Select from '../ui/Select';
import { useToast } from '../ui/Toast';
import api from '../../utils/api';
import './QuestionGenerator.css';

const CATEGORIES = [
    { value: 'dsa',              label: 'Data Structures & Algorithms' },
    { value: 'operating-systems',label: 'Operating Systems' },
    { value: 'dbms',             label: 'Database Management' },
    { value: 'networks',         label: 'Computer Networks' },
    { value: 'oops',             label: 'Object-Oriented Programming' },
    { value: 'web',              label: 'Web Development' },
    { value: 'other',            label: 'Other' },
];

const DIFFICULTIES = [
    { value: 'easy',   label: 'Easy'   },
    { value: 'medium', label: 'Medium' },
    { value: 'hard',   label: 'Hard'   },
];

const QuestionGenerator = () => {
    const [form, setForm] = useState({
        topic:      '',
        category:   'dsa',
        difficulty: 'medium',
        count:      10,
    });
    const [saveForm, setSaveForm] = useState({
        quizTitle:   '',
        quizId:      '',
        description: '',
    });

    const toast = useToast();
    const [questions, setQuestions]   = useState([]);
    const [loading, setLoading]       = useState(false);
    const [saving, setSaving]         = useState(false);
    const [expanded, setExpanded]     = useState({});
    const [tokensUsed, setTokensUsed] = useState(null);
    const [savedQuiz, setSavedQuiz]   = useState(null);

    const handleGenerate = async () => {
        if (!form.topic.trim()) return toast.error('Enter a topic first');
        setLoading(true);
        setQuestions([]);
        setSavedQuiz(null);
        try {
            const { data } = await api.post('/admin/quiz/generate', {
                topic:      form.topic,
                category:   form.category,
                difficulty: form.difficulty,
                count:      form.count,
            });
            setQuestions(data.data.questions);
            setTokensUsed(data.data.tokensUsed);
            toast.success(`${data.data.count} questions generated successfully`);
        } catch (err) {
            toast.error(err.response?.data?.message || 'Generation failed');
        } finally {
            setLoading(false);
        }
    };

    const handleSaveAsQuiz = async () => {
        if (!saveForm.quizTitle.trim() || !saveForm.quizId.trim()) {
            return toast.error('Quiz title and ID are required to save');
        }
        setSaving(true);
        try {
            const { data } = await api.post('/admin/quiz/generate', {
                topic:       form.topic,
                category:    form.category,
                difficulty:  form.difficulty,
                count:       form.count,
                saveAsQuiz:  true,
                quizTitle:   saveForm.quizTitle,
                quizId:      saveForm.quizId,
                description: saveForm.description,
            });
            setSavedQuiz(data.data.savedQuiz);
            setQuestions(data.data.questions);
            toast.success(`Quiz "${data.data.savedQuiz.title}" saved to database`);
        } catch (err) {
            toast.error(err.response?.data?.message || 'Save failed');
        } finally {
            setSaving(false);
        }
    };

    const toggleExpanded = (i) => setExpanded(e => ({ ...e, [i]: !e[i] }));

    return (
        <div className="qgen-root">
            {/* ── Config card ─────────────────────────────────────────── */}
            <Card className="qgen-config-card">
                <div className="qgen-config-header">
                    <Sparkles size={22} className="qgen-sparkle-icon" />
                    <div>
                        <h2 className="qgen-title">AI Question Generator</h2>
                        <p className="qgen-subtitle">Powered by Claude Sonnet — generates structured MCQs instantly</p>
                    </div>
                </div>

                <div className="qgen-form-grid">
                    <div className="qgen-topic-row">
                        <Input
                            label="Topic"
                            placeholder="e.g. Binary Search Trees, TCP/IP, Deadlock Prevention"
                            value={form.topic}
                            onChange={e => setForm(f => ({ ...f, topic: e.target.value }))}
                        />
                    </div>

                    <div className="qgen-selects-row">
                        <Select
                            label="Category"
                            value={form.category}
                            onChange={e => setForm(f => ({ ...f, category: e.target.value }))}
                            options={CATEGORIES}
                        />
                        <Select
                            label="Difficulty"
                            value={form.difficulty}
                            onChange={e => setForm(f => ({ ...f, difficulty: e.target.value }))}
                            options={DIFFICULTIES}
                        />
                        <div className="qgen-count-field">
                            <label className="qgen-label">Questions</label>
                            <input
                                type="number"
                                className="qgen-number-input"
                                min={1}
                                max={20}
                                value={form.count}
                                onChange={e => setForm(f => ({ ...f, count: parseInt(e.target.value) || 10 }))}
                            />
                        </div>
                    </div>
                </div>

                <div className="qgen-actions">
                    <Button
                        variant="primary"
                        icon={loading ? <RefreshCw size={18} className="spin" /> : <Sparkles size={18} />}
                        onClick={handleGenerate}
                        disabled={loading}
                    >
                        {loading ? 'Generating…' : 'Generate Questions'}
                    </Button>
                    {tokensUsed && (
                        <span className="qgen-tokens">
                            Tokens: {tokensUsed.input_tokens} in / {tokensUsed.output_tokens} out
                        </span>
                    )}
                </div>
            </Card>

            {/* ── Generated questions ──────────────────────────────────── */}
            {questions.length > 0 && (
                <>
                    <div className="qgen-results-header">
                        <h3 className="qgen-results-title">
                            {questions.length} Questions Generated
                            <span className={`qgen-badge qgen-badge-${form.difficulty}`}>{form.difficulty}</span>
                        </h3>
                        {savedQuiz && (
                            <div className="qgen-saved-pill">
                                <CheckCircle size={16} />
                                Saved as "{savedQuiz.title}" (ID: {savedQuiz.id})
                            </div>
                        )}
                    </div>

                    <div className="qgen-questions-list">
                        {questions.map((q, i) => (
                            <Card key={i} className="qgen-question-card">
                                <div className="qgen-q-header" onClick={() => toggleExpanded(i)}>
                                    <span className="qgen-q-num">Q{i + 1}</span>
                                    <p className="qgen-q-text">{q.questionText}</p>
                                    {expanded[i] ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                                </div>

                                {expanded[i] && (
                                    <div className="qgen-q-body">
                                        <div className="qgen-options">
                                            {q.options.map(opt => (
                                                <div
                                                    key={opt.id}
                                                    className={`qgen-option ${opt.isCorrect ? 'correct' : ''}`}
                                                >
                                                    <span className="qgen-opt-id">{opt.id.toUpperCase()}</span>
                                                    <span className="qgen-opt-text">{opt.text}</span>
                                                    {opt.isCorrect && <CheckCircle size={16} className="qgen-check" />}
                                                </div>
                                            ))}
                                        </div>
                                        <div className="qgen-explanation">
                                            <strong>Explanation:</strong> {q.explanation}
                                        </div>
                                    </div>
                                )}
                            </Card>
                        ))}
                    </div>

                    {/* ── Save as quiz ─────────────────────────────────── */}
                    {!savedQuiz && (
                        <Card className="qgen-save-card">
                            <h3 className="qgen-save-title">
                                <Save size={20} />
                                Save as Quiz
                            </h3>
                            <div className="qgen-save-grid">
                                <Input
                                    label="Quiz Title"
                                    placeholder="e.g. Binary Search Trees — Hard"
                                    value={saveForm.quizTitle}
                                    onChange={e => setSaveForm(f => ({ ...f, quizTitle: e.target.value }))}
                                />
                                <Input
                                    label="Quiz ID (URL slug)"
                                    placeholder="e.g. bst-hard-2024"
                                    value={saveForm.quizId}
                                    onChange={e => setSaveForm(f => ({
                                        ...f,
                                        quizId: e.target.value.toLowerCase().replace(/\s+/g, '-')
                                    }))}
                                />
                                <Input
                                    label="Description (optional)"
                                    placeholder="Brief description of the quiz"
                                    value={saveForm.description}
                                    onChange={e => setSaveForm(f => ({ ...f, description: e.target.value }))}
                                />
                            </div>
                            <Button
                                variant="success"
                                icon={saving ? <RefreshCw size={18} className="spin" /> : <Save size={18} />}
                                onClick={handleSaveAsQuiz}
                                disabled={saving}
                            >
                                {saving ? 'Saving to MongoDB…' : 'Save to Database'}
                            </Button>
                        </Card>
                    )}
                </>
            )}
        </div>
    );
};

export default QuestionGenerator;
