import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, User, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Card from '../components/ui/Card';
import './AuthPages.css';

const RegisterPage = () => {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        confirmPassword: ''
    });
    const [errors, setErrors] = useState({});
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { register } = useAuth();

    const validateForm = () => {
        const newErrors = {};

        if (!formData.username.trim()) {
            newErrors.username = 'Username is required';
        } else if (formData.username.length < 3) {
            newErrors.username = 'Username must be at least 3 characters';
        }

        if (!formData.email.trim()) {
            newErrors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Email is invalid';
        }

        if (!formData.password) {
            newErrors.password = 'Password is required';
        } else if (formData.password.length < 6) {
            newErrors.password = 'Password must be at least 6 characters';
        }

        if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = 'Passwords do not match';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        // Clear error for this field
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const VALIDATION_PATTERNS = {
        username: /^[a-zA-Z0-9_]{3,20}$/,
        email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        password: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
    };

    // const [errors, setErrors] = useState({});

    const validateField = (name, value) => {
        let error = '';

        switch (name) {
            case 'username':
                if (!VALIDATION_PATTERNS.username.test(value)) {
                    error = 'Username must be 3-20 alphanumeric characters or underscores';
                }
                break;
            case 'email':
                if (!VALIDATION_PATTERNS.email.test(value)) {
                    error = 'Please enter a valid email address';
                }
                break;
            case 'password':
                if (!VALIDATION_PATTERNS.password.test(value)) {
                    error = 'Password must be 8+ characters with uppercase, lowercase, number, and special character';
                }
                break;
        }

        setErrors(prev => ({ ...prev, [name]: error }));
        return !error;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) return;  // This line is PERFECT - keep it!

        setLoading(true);
        try {
            const result = await register(formData.email, formData.password, formData.username);
            if (result.success) {
                navigate('/dashboard');
            } else {
                setErrors({ submit: result.error || 'Registration failed' });
            }
        } catch (error) {
            setErrors({ submit: 'An error occurred. Please try again.' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-page">
            <div className="auth-background"></div>
            <div className="auth-container">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="auth-content"
                >
                    <div className="auth-header">
                        <h1 className="auth-title">Create Account</h1>
                        <p className="auth-subtitle">Start your learning journey with BrainSpark</p>
                    </div>

                    <Card className="auth-card">
                        <form onSubmit={handleSubmit} className="auth-form">
                            {errors.submit && (
                                <div className="error-banner" role="alert">
                                    {errors.submit}
                                </div>
                            )}

                            {/* Username Field */}
                            <div className="form-group">
                                <label htmlFor="username" className="form-label">
                                    Username
                                </label>
                                <div className="input-wrapper">
                                    <User className="input-icon" size={20} />
                                    <Input
                                        type="text"
                                        name="username"
                                        placeholder="Choose a username"
                                        value={formData.username}
                                        onChange={handleChange}
                                        error={errors.username}
                                        aria-invalid={!!errors.username}
                                        pattern="[a-zA-Z0-9_]{3,20}"
                                        required
                                    />
                                </div>
                            </div>

                            {/* Email Field */}
                            <div className="form-group">
                                <label htmlFor="email" className="form-label">
                                    Email Address
                                </label>
                                <div className="input-wrapper">
                                    <Mail className="input-icon" size={20} />
                                    <Input
                                        type="email"
                                        id="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        className={`form-input ${errors.email ? 'input-error' : ''}`}
                                        placeholder="you@example.com"
                                        aria-invalid={errors.email ? 'true' : 'false'}
                                        aria-describedby={errors.email ? 'email-error' : undefined}
                                    />
                                </div>
                                {errors.email && (
                                    <span id="email-error" className="error-message" role="alert">
                                        {errors.email}
                                    </span>
                                )}
                            </div>

                            {/* Password Field */}
                            <div className="form-group">
                                <label htmlFor="password" className="form-label">
                                    Password
                                </label>
                                <div className="input-wrapper">
                                    <Lock className="input-icon" size={20} />
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        id="password"
                                        name="password"
                                        value={formData.password}
                                        onChange={handleChange}
                                        className={`form-input ${errors.password ? 'input-error' : ''}`}
                                        placeholder="Create a strong password"
                                        aria-invalid={errors.password ? 'true' : 'false'}
                                        aria-describedby={errors.password ? 'password-error' : undefined}
                                    />
                                    <button
                                        type="button"
                                        className="input-icon-button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        aria-label={showPassword ? 'Hide password' : 'Show password'}
                                    >
                                        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                    </button>
                                </div>
                                {errors.password && (
                                    <span id="password-error" className="error-message" role="alert">
                                        {errors.password}
                                    </span>
                                )}
                            </div>

                            {/* Confirm Password Field */}
                            <div className="form-group">
                                <label htmlFor="confirmPassword" className="form-label">
                                    Confirm Password
                                </label>
                                <div className="input-wrapper">
                                    <Lock className="input-icon" size={20} />
                                    <input
                                        type={showConfirmPassword ? 'text' : 'password'}
                                        id="confirmPassword"
                                        name="confirmPassword"
                                        value={formData.confirmPassword}
                                        onChange={handleChange}
                                        className={`form-input ${errors.confirmPassword ? 'input-error' : ''}`}
                                        placeholder="Confirm your password"
                                        aria-invalid={errors.confirmPassword ? 'true' : 'false'}
                                        aria-describedby={errors.confirmPassword ? 'confirmPassword-error' : undefined}
                                    />
                                    <button
                                        type="button"
                                        className="input-icon-button"
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                                    >
                                        {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                    </button>
                                </div>
                                {errors.confirmPassword && (
                                    <span id="confirmPassword-error" className="error-message" role="alert">
                                        {errors.confirmPassword}
                                    </span>
                                )}
                            </div>

                            <Button
                                type="submit"
                                variant="primary"
                                size="lg"
                                fullWidth
                                loading={loading}
                            >
                                Create Account
                            </Button>

                            <div className="auth-footer">
                                <p className="auth-footer-text">
                                    Already have an account?{' '}
                                    <Link to="/login" className="auth-link">
                                        Sign In
                                    </Link>
                                </p>
                            </div>
                        </form>
                    </Card>
                </motion.div>
            </div>
        </div>
    );
};

export default RegisterPage;
