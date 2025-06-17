import { useState, useEffect, createContext, useContext } from 'react';
import * as authServices from '~/api/authApi';

const AuthContext = createContext();

export function useAuth() {
    return useContext(AuthContext);
}

export function AuthProvider({ children }) {
    const [userData, setUserData] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Fetch current user if token exists
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            fetchUser();
        } else {
            setLoading(false);
            setIsAuthenticated(false);
            setUserData({});
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const fetchUser = async () => {
        const token = localStorage.getItem('token');
        if (!token) return null;

        setLoading(true);
        try {
            const result = await authServices.getCurrentUser(token);
            if (result) {
                setUserData(result);
                setIsAuthenticated(true);
                return result;
            } else {
                logout();
                return null;
            }
        } catch (err) {
            logout();
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const login = async (email, password) => {
        setLoading(true);
        try {
            const res = await authServices.login(email, password);
            if (res.token) {
                localStorage.setItem('token', res.token);

                const user = await fetchUser();
                setIsAuthenticated(true);
                setError(null);
                return user;
            } else {
                setError('Tài khoản hoặc mật khẩu không đúng.');
                return null;
            }
        } catch (err) {
            console.error('>>> Login error:', err);
            setError('Lỗi đăng nhập. Vui lòng thử lại.');
            return null;
        } finally {
            setLoading(false);
        }
    };

    const logout = () => {
        try {
            authServices.logout(); // optional: notify backend
        } catch (err) {
            console.error('>>> Logout error:', err);
        } finally {
            localStorage.removeItem('token');
            setUserData(null);
            setIsAuthenticated(false);
        }
    };

    const value = {
        userData,
        isAuthenticated,
        loading,
        error,
        login,
        logout,
        fetchUser,
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
}
