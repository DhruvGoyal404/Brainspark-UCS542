import { Crown } from 'lucide-react';
import Avatar from '../ui/Avatar';
import './LeaderboardTable.css';

const LeaderboardTable = ({ users = [], currentUserId }) => {
    const getRankIcon = (rank) => {
        if (rank === 1) return '🥇';
        if (rank === 2) return '🥈';
        if (rank === 3) return '🥉';
        return null;
    };

    return (
        <div className="leaderboard-table">
            <table>
                <thead>
                    <tr>
                        <th>Rank</th>
                        <th>User</th>
                        <th>Quizzes</th>
                        <th>Accuracy</th>
                        <th>XP</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map((user, index) => {
                        const rank = index + 1;
                        const isCurrentUser = user._id === currentUserId;

                        return (
                            <tr
                                key={user._id}
                                className={isCurrentUser ? 'current-user' : ''}
                            >
                                <td className="rank-cell">
                                    {getRankIcon(rank) || <span className="rank-number">{rank}</span>}
                                </td>
                                <td className="user-cell">
                                    <Avatar
                                        src={user.avatar}
                                        fallback={user.username?.charAt(0).toUpperCase()}
                                        size="sm"
                                    />
                                    <span className="username">
                                        {user.username}
                                        {isCurrentUser && <span className="you-badge">You</span>}
                                    </span>
                                </td>
                                <td>{user.stats?.totalQuizzes || 0}</td>
                                <td>
                                    <span className="accuracy">
                                        {Math.round((user.stats?.totalScore || 0) / Math.max(user.stats?.totalQuizzes || 1, 1))}%
                                    </span>
                                </td>
                                <td className="xp-cell">
                                    <Crown size={16} className="xp-icon" />
                                    {user.stats?.currentXP || 0}
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
};

export default LeaderboardTable;
