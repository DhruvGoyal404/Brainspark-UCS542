import { useState, useEffect } from 'react';
import { Users, Search, Shield, Grid, List, Crown, Trash2, UserX, UserCheck } from 'lucide-react';
import Card from '../ui/Card';
import Avatar from '../ui/Avatar';
import Input from '../ui/Input';
import Button from '../ui/Button';
import api from '../../utils/api';
import { useToast } from '../ui/Toast';
import useDebounce from '../../hooks/useDebounce';
import './UserManagement.css';

const UserManagement = () => {
    const toast = useToast();
    const [users, setUsers]       = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [viewMode, setViewMode] = useState('list');
    const [updating, setUpdating] = useState(null);

    // Debounce the search — prevents a re-filter on every keystroke
    const debouncedSearch = useDebounce(searchTerm, 350);

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const response = await api.get('/admin/users?limit=100');
            setUsers(response.data?.data || []);
        } catch (error) {
            console.error('Failed to fetch users:', error);
            setUsers([]);
        }
    };

    // Client-side filter — applied to already-loaded user list using debounced value
    const filteredUsers = users.filter(user => {
        if (user.role === 'admin' || user.isAdmin === true) return false;
        if (!debouncedSearch) return true;
        const term = debouncedSearch.toLowerCase();
        return (
            user.username?.toLowerCase().includes(term) ||
            user.email?.toLowerCase().includes(term)
        );
    });

    const handleToggleRole = async (userId, currentRole) => {
        const newRole = currentRole === 'admin' ? 'user' : 'admin';
        setUpdating(userId);
        try {
            await api.put(`/admin/users/${userId}/role`, { role: newRole });
            setUsers(prev => prev.map(u => u._id === userId ? { ...u, role: newRole } : u));
        } catch (error) {
            toast.error('Failed to update user role. Please try again.');
        } finally {
            setUpdating(null);
        }
    };

    const handleDeactivate = async (userId, username) => {
        if (!window.confirm(`Deactivate user "${username}"? They will no longer be able to log in. This can be reversed via the database.`)) return;

        setUpdating(userId);
        try {
            await api.delete(`/admin/users/${userId}`);
            // Mark locally as inactive so the badge updates immediately
            setUsers(prev => prev.map(u => u._id === userId ? { ...u, isActive: false } : u));
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to deactivate user. Please try again.');
        } finally {
            setUpdating(null);
        }
    };

    return (
        <div className="user-management">
            <Card className="management-card">
                <div className="management-header">
                    <h2 className="management-title">User Management</h2>
                    <div className="view-toggle">
                        <Button
                            variant={viewMode === 'list' ? 'primary' : 'outline'}
                            size="sm"
                            icon={<List size={18} />}
                            onClick={() => setViewMode('list')}
                        />
                        <Button
                            variant={viewMode === 'card' ? 'primary' : 'outline'}
                            size="sm"
                            icon={<Grid size={18} />}
                            onClick={() => setViewMode('card')}
                        />
                    </div>
                </div>

                <div className="search-wrapper">
                    <Input
                        placeholder="Search users by name or email..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        icon={<Search size={18} />}
                        className="search-input"
                    />
                </div>

                <div className={`users-container ${viewMode === 'card' ? 'users-grid' : 'users-list'}`}>
                    {filteredUsers.map(user => (
                        <Card
                            key={user._id}
                            className={`user-item ${viewMode === 'card' ? 'user-card' : 'user-row'} ${user.isActive === false ? 'user-inactive' : ''}`}
                        >
                            <div className="user-info">
                                <Avatar
                                    src={user.avatar}
                                    fallback={user.username?.charAt(0).toUpperCase()}
                                    size="md"
                                />
                                <div className="user-details">
                                    <div className="user-name">
                                        {user.username}
                                        {user.isActive === false && (
                                            <span style={{
                                                marginLeft: '8px',
                                                fontSize: '11px',
                                                padding: '2px 6px',
                                                borderRadius: '999px',
                                                background: 'var(--error-bg, rgba(239,68,68,0.1))',
                                                color: 'var(--error)',
                                                fontWeight: 600
                                            }}>
                                                Inactive
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

                            <div className="user-actions">
                                <Button
                                    variant={user.role === 'admin' ? 'primary' : 'outline'}
                                    size="sm"
                                    icon={<Crown size={16} />}
                                    onClick={() => handleToggleRole(user._id, user.role)}
                                    disabled={updating === user._id || user.isActive === false}
                                    title={user.role === 'admin' ? 'Demote to User' : 'Promote to Admin'}
                                >
                                    {updating === user._id ? '...' : user.role === 'admin' ? 'Admin' : 'Promote'}
                                </Button>

                                {user.isActive !== false && (
                                    <Button
                                        variant="danger"
                                        size="sm"
                                        icon={<UserX size={16} />}
                                        onClick={() => handleDeactivate(user._id, user.username)}
                                        disabled={updating === user._id}
                                        title="Deactivate user account (soft delete)"
                                    >
                                        {updating === user._id ? '...' : 'Deactivate'}
                                    </Button>
                                )}
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
