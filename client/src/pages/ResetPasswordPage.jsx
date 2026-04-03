import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Lock, CheckCircle, AlertCircle } from 'lucide-react';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import api from '../utils/api';
import './AuthPages.css';

const ResetPasswordPage = () => {
    const { token } = useParams();
    const navigate = useNavigate();
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    useEffect(() => {
        if (!token) {
            setError('Invalid reset link');
        }
    }, [token]);

    const validatePassword = () => {
        if (password.length < 6) {
            setError('Password must be at least 6 characters');
            return false;
        }
        if (!/^(?=.*[a-zA-Z])(?=.*[0-9])/.test(password)) {
            setError('Password must contain at least one letter and one number');
            return false;
        }
        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return false;
        }
        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!validatePassword()) return;

        setLoading(true);

        try {
            await api.post('/auth/reset-password', {
                token,
                password
            });
            setSuccess(true);
            setTimeout(() => navigate('/login'), 3000);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to reset password');
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        return (
            <div className="auth-page">
                <Card className="auth-card" style={{ maxWidth: '500px' }}>
                    <div style={{ textAlign: 'center', padding: '40px 20px' }}>
                        <CheckCircle size={64} style={{ color: 'var(--success)', marginBottom: '20px' }} />
                        <h1>Password Reset Successful!</h1>
                        <p style={{ color: 'var(--text-secondary)', marginBottom: '30px' }}>
                            Your password has been reset. You'll be redirected to login shortly...
                        </p>
                    </div>
                </Card>
            </div>
        );
    }

    if (error && error.includes('Invalid')) {
        return (
            <div className="auth-page">
                <Card className="auth-card" style={{ maxWidth: '500px' }}>
                    <div style={{ textAlign: 'center', padding: '40px 20px' }}>
                        <AlertCircle size={64} style={{ color: 'var(--error)', marginBottom: '20px' }} />
                        <h1>Invalid Reset Link</h1>
                        <p style={{ color: 'var(--text-secondary)', marginBottom: '30px' }}>
                            The reset link is invalid or has expired. Please request a new one.
                        </p>
                        <Button 
                            onClick={() => navigate('/forgot-password')}
                            variant="primary"
                            style={{ width: '100%' }}
                        >
                            Request New Link
                        </Button>
                    </div>
                </Card>
            </div>
        );
    }

    return (
        <div className="auth-page">
            <Card className="auth-card" style={{ maxWidth: '500px' }}>
                <div style={{ marginBottom: '30px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '10px' }}>
                        <Lock size={32} style={{ color: 'var(--primary)' }} />
                        <h1 style={{ margin: 0 }}>Reset Password</h1>
                    </div>
                    <p style={{ color: 'var(--text-secondary)' }}>
                        Enter a new password for your BrainSpark account.
                    </p>
                </div>

                <form onSubmit={handleSubmit}>
                    {error && (
                        <div style={{
                            background: 'rgba(255, 0, 0, 0.1)',
                            color: 'var(--error)',
                            padding: '12px',
                            borderRadius: '8px',
                            marginBottom: '20px',
                            fontSize: '14px'
                        }}>
                            {error}
                        </div>
                    )}

                    <div style={{ marginBottom: '20px' }}>
                        <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>
                            New Password
                        </label>
                        <div style={{ position: 'relative' }}>
                            <input
                                type={showPassword ? 'text' : 'password'}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Min 6 chars, with letter & number"
                                disabled={loading}
                                style={{
                                    width: '100%',
                                    padding: '12px',
                                    border: '1px solid var(--border)',
                                    borderRadius: '8px',
                                    fontSize: '16px',
                                    opacity: loading ? 0.5 : 1
                                }}
                            />
                        </div>
                        <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '6px' }}>
                            Must contain at least one letter and one number
                        </p>
                    </div>

                    <div style={{ marginBottom: '20px' }}>
                        <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>
                            Confirm Password
                        </label>
                        <input
                            type={showPassword ? 'text' : 'password'}
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            placeholder="Re-enter your password"
                            disabled={loading}
                            style={{
                                width: '100%',
                                padding: '12px',
                                border: '1px solid var(--border)',
                                borderRadius: '8px',
                                fontSize: '16px',
                                opacity: loading ? 0.5 : 1
                            }}
                        />
                    </div>

                    <label style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px', cursor: 'pointer' }}>
                        <input
                            type="checkbox"
                            checked={showPassword}
                            onChange={(e) => setShowPassword(e.target.checked)}
                            style={{ cursor: 'pointer' }}
                        />
                        <span>Show password</span>
                    </label>

                    <Button
                        type="submit"
                        variant="primary"
                        fullWidth
                        disabled={loading}
                    >
                        {loading ? 'Resetting...' : 'Reset Password'}
                    </Button>
                </form>

                <p style={{
                    textAlign: 'center',
                    color: 'var(--text-secondary)',
                    marginTop: '20px',
                    fontSize: '14px'
                }}>
                    Remember your password? <a href="/login" style={{ color: 'var(--primary)', textDecoration: 'none' }}>Login here</a>
                </p>
            </Card>
        </div>
    );
};

export default ResetPasswordPage;
