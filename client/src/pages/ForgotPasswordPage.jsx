import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, ArrowLeft, CheckCircle } from 'lucide-react';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import api from '../utils/api';
import './AuthPages.css';

const ForgotPasswordPage = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!email) {
            setError('Please enter your email address');
            return;
        }

        setLoading(true);
        setError('');

        try {
            await api.post('/auth/forgot-password', { email });
            setSubmitted(true);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to send reset email');
        } finally {
            setLoading(false);
        }
    };

    if (submitted) {
        return (
            <div className="auth-page">
                <Card className="auth-card" style={{ maxWidth: '500px' }}>
                    <div style={{ textAlign: 'center', padding: '40px 20px' }}>
                        <CheckCircle size={64} style={{ color: 'var(--success)', marginBottom: '20px' }} />
                        <h1>Check Your Email</h1>
                        <p style={{ color: 'var(--text-secondary)', marginBottom: '30px' }}>
                            We've sent a password reset link to <strong>{email}</strong>. 
                            The link expires in 15 minutes.
                        </p>
                        <Button 
                            onClick={() => navigate('/login')}
                            variant="primary"
                            style={{ width: '100%' }}
                        >
                            Back to Login
                        </Button>
                    </div>
                </Card>
            </div>
        );
    }

    return (
        <div className="auth-page">
            <Card className="auth-card" style={{ maxWidth: '500px' }}>
                <button 
                    onClick={() => navigate('/login')}
                    style={{
                        background: 'none',
                        border: 'none',
                        color: 'var(--primary)',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        marginBottom: '30px'
                    }}
                >
                    <ArrowLeft size={20} /> Back to Login
                </button>

                <div style={{ marginBottom: '30px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '10px' }}>
                        <Mail size={32} style={{ color: 'var(--primary)' }} />
                        <h1 style={{ margin: 0 }}>Forgot Password?</h1>
                    </div>
                    <p style={{ color: 'var(--text-secondary)' }}>
                        Enter your email address and we'll send you a link to reset your password.
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
                            Email Address
                        </label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="you@example.com"
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

                    <Button
                        type="submit"
                        variant="primary"
                        fullWidth
                        disabled={loading}
                    >
                        {loading ? 'Sending...' : 'Send Reset Link'}
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

export default ForgotPasswordPage;
