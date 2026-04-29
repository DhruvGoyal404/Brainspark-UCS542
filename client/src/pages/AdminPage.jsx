import { useState, useEffect } from 'react';
import { Plus, BookOpen, Users, FileText, Sparkles, Camera, Trophy } from 'lucide-react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import QuizCreator from '../components/admin/QuizCreator';
import QuestionBank from '../components/admin/QuestionBank';
import UserManagement from '../components/admin/UserManagement';
import QuestionGenerator from '../components/admin/QuestionGenerator';
import { useToast } from '../components/ui/Toast';
import api from '../utils/api';
import './AdminPage.css';

const SnapshotViewer = () => {
    const [rows, setRows] = useState([]);
    const [loading, setLoading] = useState(true);
    const toast = useToast();

    useEffect(() => {
        api.get('/admin/analytics/snapshot')
            .then(res => setRows(res.data.data || []))
            .catch(() => toast.error('Failed to load snapshot data'))
            .finally(() => setLoading(false));
    }, []);

    if (loading) return <div style={{ display: 'flex', justifyContent: 'center', padding: '60px' }}><div className="spinner spinner-lg" /></div>;

    if (!rows.length) return (
        <Card style={{ padding: '48px', textAlign: 'center' }}>
            <Trophy size={48} style={{ opacity: 0.3, margin: '0 auto 16px' }} />
            <p style={{ color: 'var(--text-secondary)' }}>No snapshot data yet. Click "Save Leaderboard Snapshot" first.</p>
        </Card>
    );

    return (
        <Card>
            <div style={{ padding: '20px 24px 8px', borderBottom: '1px solid var(--border)' }}>
                <h2 style={{ fontSize: '18px', fontWeight: 700 }}>Leaderboard Snapshot</h2>
                <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '4px' }}>
                    {rows.length} users · Last updated {new Date(rows[0]?.snapshotDate).toLocaleString()} · 1 doc/user (overwrites on re-run)
                </p>
            </div>
            <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
                    <thead>
                        <tr style={{ background: 'var(--bg-secondary)' }}>
                            {['Rank', 'Username', 'Total XP', 'Level', 'Snapshot Date'].map(h => (
                                <th key={h} style={{ padding: '10px 16px', textAlign: 'left', fontWeight: 600, color: 'var(--text-secondary)', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{h}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {rows.map((row, i) => (
                            <tr key={String(row._id)} style={{ borderTop: '1px solid var(--border)' }}>
                                <td style={{ padding: '12px 16px', fontWeight: 700, color: i < 3 ? '#f59e0b' : 'var(--text-primary)' }}>
                                    {i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : `#${i + 1}`}
                                </td>
                                <td style={{ padding: '12px 16px', fontWeight: 600 }}>{row.username}</td>
                                <td style={{ padding: '12px 16px', color: '#6366f1', fontWeight: 700 }}>{(row.totalXP || 0).toLocaleString()}</td>
                                <td style={{ padding: '12px 16px' }}>Lv. {row.level || 1}</td>
                                <td style={{ padding: '12px 16px', color: 'var(--text-secondary)', fontSize: '13px' }}>
                                    {new Date(row.snapshotDate).toLocaleString()}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </Card>
    );
};

const AdminPage = () => {
    const [activeTab, setActiveTab] = useState('quizzes');
    const [snapshotting, setSnapshotting] = useState(false);
    const toast = useToast();

    const handleSnapshot = async () => {
        setSnapshotting(true);
        try {
            const res = await api.post('/admin/analytics/snapshot');
            toast.success(res.data.message || 'Leaderboard snapshot saved');
        } catch (err) {
            toast.error(err.response?.data?.message || 'Snapshot failed');
        } finally {
            setSnapshotting(false);
        }
    };

    const tabs = [
        { id: 'quizzes',   label: 'Quiz Creator',                      icon: Plus    },
        { id: 'ai-gen',    label: 'AI Generator',                       icon: Sparkles },
        { id: 'questions', label: 'Question Bank',                      icon: FileText },
        { id: 'users',     label: 'User Management',                    icon: Users   },
        { id: 'snapshot',  label: 'View Recentmost Leaderboard Snapshots', icon: Trophy  },
    ];

    const renderContent = () => {
        switch (activeTab) {
            case 'quizzes':   return <QuizCreator />;
            case 'ai-gen':    return <QuestionGenerator />;
            case 'questions': return <QuestionBank />;
            case 'users':     return <UserManagement />;
            case 'snapshot':  return <SnapshotViewer />;
            default:          return null;
        }
    };

    return (
        <div className="admin-page">
            <div className="admin-container container">
                {/* Header */}
                <div className="admin-header">
                    <div className="header-content">
                        <BookOpen size={40} className="header-icon" />
                        <div>
                            <h1 className="admin-title">Admin Panel</h1>
                            <p className="admin-subtitle">Manage quizzes, questions, and users</p>
                        </div>
                    </div>
                    <Button
                        variant="outline"
                        size="sm"
                        icon={<Camera size={16} />}
                        onClick={handleSnapshot}
                        loading={snapshotting}
                        title="Save current leaderboard XP totals into leaderboard_snapshots collection"
                    >
                        Save Leaderboard Snapshot
                    </Button>
                </div>

                {/* Navigation Tabs */}
                <Card className="admin-tabs">
                    <div className="tabs-list">
                        {tabs.map(tab => {
                            const Icon = tab.icon;
                            return (
                                <button
                                    key={tab.id}
                                    className={`tab-button ${activeTab === tab.id ? 'active' : ''}`}
                                    onClick={() => setActiveTab(tab.id)}
                                >
                                    <Icon size={20} />
                                    {tab.label}
                                </button>
                            );
                        })}
                    </div>
                </Card>

                {/* Content */}
                <div className="admin-content">
                    {renderContent()}
                </div>
            </div>
        </div>
    );
};

export default AdminPage;
