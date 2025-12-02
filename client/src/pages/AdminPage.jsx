import { useState } from 'react';
import { Plus, BookOpen, Users, FileText } from 'lucide-react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import QuizCreator from '../components/admin/QuizCreator';
import QuestionBank from '../components/admin/QuestionBank';
import UserManagement from '../components/admin/UserManagement';
import './AdminPage.css';

const AdminPage = () => {
    const [activeTab, setActiveTab] = useState('quizzes');

    const tabs = [
        { id: 'quizzes', label: 'Quiz Creator', icon: Plus },
        { id: 'questions', label: 'Question Bank', icon: FileText },
        { id: 'users', label: 'User Management', icon: Users },
    ];

    const renderContent = () => {
        switch (activeTab) {
            case 'quizzes':
                return <QuizCreator />;
            case 'questions':
                return <QuestionBank />;
            case 'users':
                return <UserManagement />;
            default:
                return null;
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
