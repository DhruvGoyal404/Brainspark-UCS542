import { createContext, useContext, useState, useEffect } from 'react';
import api from '../utils/api';
import { useTheme } from './ThemeContext';

const AuthContext = createContext();

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within AuthProvider');
    }
    return context;
};

export const AuthProvider = ({ children }) => {
    const [user, setUser]       = useState(null);
    const [loading, setLoading] = useState(true);
    const [token, setToken]     = useState(() => localStorage.getItem('auth_token'));

    // ThemeProvider wraps AuthProvider in App.jsx, so useTheme() is safe here
    const { loadUserPreferences } = useTheme();

    // Check if user is still logged in on app mount (e.g. page refresh)
    useEffect(() => {
        const checkAuth = async () => {
            const savedToken = localStorage.getItem('auth_token');
            if (savedToken) {
                try {
                    const response = await api.get('/auth/me');
                    const userData = response.data.data;
                    setUser(userData);
                    setToken(savedToken);
                    // Cross-device preference sync: load DB preferences into ThemeContext
                    loadUserPreferences(userData.preferences);
                } catch (error) {
                    console.error('Auth check failed:', error);
                    logout();
                }
            }
            setLoading(false);
        };

        checkAuth();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []); // loadUserPreferences is stable — excluded to avoid re-running on theme changes

    const login = async (email, password) => {
        try {
            const response = await api.post('/auth/login', { email, password });
            const { token: authToken, user: userData } = response.data.data;

            localStorage.setItem('auth_token', authToken);
            localStorage.setItem('user_data', JSON.stringify(userData));
            setUser(userData);
            setToken(authToken);

            // Sync cross-device preferences immediately on login
            loadUserPreferences(userData.preferences);

            const redirectTo = userData.role === 'admin' ? '/admin' : '/dashboard';
            return { success: true, redirectTo };
        } catch (error) {
            return {
                success: false,
                message: error.response?.data?.message || 'Login failed'
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

            // Edge case: server returned 2xx with success: false (shouldn't happen but handle it)
            return { success: false, error: 'Registration failed. Please try again.' };
        } catch (error) {
            console.error('Registration failed:', error);
            return {
                success: false,
                error: error.response?.data?.message || 'Registration failed. Please try again.'
            };
        }
    };

    const logout = async () => {
        // Inform the server so the JWT is blacklisted — prevents token replay after logout
        try {
            const currentToken = localStorage.getItem('auth_token');
            if (currentToken) {
                await api.post('/auth/logout');
            }
        } catch {
            // Continue with client-side logout even if the server call fails
        }
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
            return { success: false, error: 'Update failed' };
        } catch (error) {
            console.error('Update failed:', error);
            return { success: false, error: error.response?.data?.message || error.message };
        }
    };

    const changePassword = async (currentPassword, newPassword) => {
        try {
            await api.post('/auth/change-password', { currentPassword, newPassword });
            // Server blacklists the token after password change — log out on client too
            await logout();
            return { success: true };
        } catch (error) {
            return {
                success: false,
                message: error.response?.data?.message || 'Failed to change password'
            };
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
        changePassword,
        isAuthenticated: !!user
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};
