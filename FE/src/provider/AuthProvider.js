// src/contexts/AuthContext.jsx
import { createContext, useContext, useEffect, useState } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [auth, setAuth] = useState({
        isAuthenticated: false,
        role: null,
        token: null,
    });

    useEffect(() => {
        const token = sessionStorage.getItem('token');
        const role = sessionStorage.getItem('role');
        if (token && role) {
            setAuth({
                isAuthenticated: true,
                token,
                role,
            });
        }
    }, []);

    const saveToken = (token, role) => {
        sessionStorage.setItem('token', token);
        sessionStorage.setItem('role', role);
        setAuth({
            isAuthenticated: true,
            token,
            role,
        });
    };

    const logout = () => {
        sessionStorage.clear();
        setAuth({
            isAuthenticated: false,
            role: null,
            token: null,
        });
    };

    return (
        <AuthContext.Provider value={{ auth, saveToken, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

// Custom hook để dùng ở mọi nơi
export const useAuth = () => useContext(AuthContext);
