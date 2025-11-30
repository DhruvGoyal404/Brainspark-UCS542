import { createContext, useContext, useState, useEffect } from 'react';
import api from '../utils/api';

const AuthContext = createContext();

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within AuthProvider');
    }
    return context;
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [token, setToken] = useState(() => localStorage.getItem('auth_token'));

    // Check if user is logged in on mount
    useEffect(() => {
        const checkAuth = async () => {
            const savedToken = localStorage.getItem('auth_token');

            if (savedToken) {
                try {
                    // Verify token with backend
                    const response = await api.get('/auth/me');
                    setUser(response.data.data);
                    setToken(savedToken);
                } catch (error) {
                    console.error('Auth check failed:', error);
                    logout();
                }
            }
            setLoading(false);
        };

        checkAuth();
    }, []);

    const login = async (email, password) => {
        try {
            const response = await api.post('/auth/login', { email, password });

            if (response.data.success) {
                const { user: userData, token: authToken } = response.data.data;

                setUser(userData);
                setToken(authToken);
                localStorage.setItem('auth_token', authToken);
                localStorage.setItem('user_data', JSON.stringify(userData));

                return { success: true };
            }
        } catch (error) {
            console.error('Login failed:', error);
            return {
                success: false,
                error: error.response?.data?.message || 'Login failed. Please try again.'
            };
        }
    };

    const register = async (email, password, username) => {
        try {
            const response = await api.post('/auth/register', { email, password, username });

            if (response.data.success) {
                const { user: userData, token: authToken } = response.data.data;

                setUser(userData);
                setToken(authToken);
                localStorage.setItem('auth_token', authToken);
                localStorage.setItem('user_data', JSON.stringify(userData));

                return { success: true };
            }
        } catch (error) {
            console.error('Registration failed:', error);
            return {
                success: false,
                error: error.response?.data?.message || 'Registration failed. Please try again.'
            };
        }
    };

    const logout = () => {
        setUser(null);
        setToken(null);
        localStorage.removeItem('auth_token');
        localStorage.removeItem('user_data');
    };

    const updateUser = async (updates) => {
        try {
            const response = await api.put('/user/profile', updates);
            if (response.data.success) {
                setUser(response.data.data);
                localStorage.setItem('user_data', JSON.stringify(response.data.data));
                return { success: true };
            }
        } catch (error) {
            console.error('Update failed:', error);
            return { success: false, error: error.message };
        }
    };

    const value = {
        user,
        token,
        loading,
        login,
        register,
        logout,
        updateUser,
        isAuthenticated: !!user
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};
