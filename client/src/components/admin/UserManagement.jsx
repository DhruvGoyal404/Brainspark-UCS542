import { useState, useEffect } from 'react';
import { Users, Search, Shield, Grid, List, Crown, Trash2 } from 'lucide-react';
import Card from '../ui/Card';
import Avatar from '../ui/Avatar';
import Input from '../ui/Input';
import Button from '../ui/Button';
import api from '../../utils/api';
import './UserManagement.css';

const UserManagement = () => {
    const [users, setUsers] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [viewMode, setViewMode] = useState('list'); // 'list' or 'card'
    const [updating, setUpdating] = useState(null);

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const response = await api.get('/admin/users');
            // Backend returns { success: true, data: [...] }
            setUsers(response.data?.data || []);
        } catch (error) {
            console.error('Failed to fetch users:', error);
            setUsers([]); // Ensure it's an array even on error
        }
    };

    // Filter to ONLY show users with role="user" (exclude admins)
    const filteredUsers = users.filter(user => {
        // Exclude any user with admin role
        if (user.role === 'admin' || user.isAdmin === true) {
            return false;
        }
        const matchesSearch = user.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.email?.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesSearch;
    });

    const handleToggleRole = async (userId, currentRole) => {
        const newRole = currentRole === 'admin' ? 'user' : 'admin';
        setUpdating(userId);

        try {
            await api.put(`/admin/users/${userId}/role`, { role: newRole });

            // Update local state
            setUsers(prev => prev.map(u =>
                u._id === userId ? { ...u, role: newRole } : u
            ));

            // Show success feedback
            console.log(`User role updated to ${newRole}`);
        } catch (error) {
            console.error('Failed to update user role:', error);
            alert('Failed to update user role. Please try again.');
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
                        <Card key={user._id} className={`user-item ${viewMode === 'card' ? 'user-card' : 'user-row'}`}>
                            <div className="user-info">
                                <Avatar
                                    src={user.avatar}
                                    fallback={user.username?.charAt(0).toUpperCase()}
                                    size="md"
                                />
                                <div className="user-details">
                                    <div className="user-name">
                                        {user.username}
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
                                    disabled={updating === user._id}
                                    title={user.role === 'admin' ? 'Demote to User' : 'Promote to Admin'}
                                >
                                    {updating === user._id ? 'Updating...' : user.role === 'admin' ? 'Admin' : 'Promote'}
                                </Button>
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
