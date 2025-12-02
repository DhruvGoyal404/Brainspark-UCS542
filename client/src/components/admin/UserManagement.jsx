import { useState, useEffect } from 'react';
import { Users, Search, Shield } from 'lucide-react';
import Card from '../ui/Card';
import Avatar from '../ui/Avatar';
import Input from '../ui/Input';
import api from '../../utils/api';
import './UserManagement.css';

const UserManagement = () => {
    const [users, setUsers] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const response = await api.get('/admin/users');
            setUsers(response.data);
        } catch (error) {
            console.error('Failed to fetch users:', error);
        }
    };

    const filteredUsers = users.filter(user =>
        user.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="user-management">
            <Card className="management-card">
                <h2 className="management-title">User Management</h2>

                <Input
                    placeholder="Search users by name or email..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    icon={<Search size={18} />}
                    className="search-input"
                />

                <div className="users-table">
                    {filteredUsers.map(user => (
                        <Card key={user._id} className="user-row">
                            <div className="user-info">
                                <Avatar
                                    src={user.avatar}
                                    fallback={user.username?.charAt(0).toUpperCase()}
                                    size="md"
                                />
                                <div className="user-details">
                                    <div className="user-name">
                                        {user.username}
                                        {user.isAdmin && (
                                            <span className="admin-badge">
                                                <Shield size={14} /> Admin
                                            </span>
                                        )}
                                    </div>
                                    <div className="user-email">{user.email}</div>
                                </div>
                            </div>

                            <div className="user-stats">
                                <div className="stat">
                                    <span className="stat-label">Level</span>
                                    <span className="stat-value">{user.stats?.level || 1}</span>
                                </div>
                                <div className="stat">
                                    <span className="stat-label">XP</span>
                                    <span className="stat-value">{user.stats?.currentXP || 0}</span>
                                </div>
                                <div className="stat">
                                    <span className="stat-label">Quizzes</span>
                                    <span className="stat-value">{user.stats?.totalQuizzes || 0}</span>
                                </div>
                                <div className="stat">
                                    <span className="stat-label">Streak</span>
                                    <span className="stat-value">{user.stats?.currentStreak || 0}🔥</span>
                                </div>
                            </div>
                        </Card>
                    ))}

                    {filteredUsers.length === 0 && (
                        <div className="empty-state">
                            <Users size={48} />
                            <p>No users found.</p>
                        </div>
                    )}
                </div>
            </Card>
        </div>
    );
};

export default UserManagement;
