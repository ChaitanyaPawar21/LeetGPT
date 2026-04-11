import React, { createContext, useContext, useState, useEffect } from "react";
import api from "../utils/api";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    const checkAuthStatus = async () => {
        try {
            const res = await api.get("/auth/me");
            if (res.data.success) {
                setUser(res.data.user);
                setIsAuthenticated(true);
            }
        } catch (error) {
            setUser(null);
            setIsAuthenticated(false);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        checkAuthStatus();
    }, []);

    const login = async (email, password) => {
        try {
            const response = await api.post('/auth/login', { email, password });
            
            if (response.data.success) {
                setUser(response.data.user);
                setIsAuthenticated(true);
                return response.data;
            }
        } catch (error) {
            console.error('Login failed:', error);
            throw error;
        }
    };

    const register = async (name, email, password) => {
        try {
            const res = await api.post("/auth/register", { name, email, password });
            if (res.data.success) {
                setUser(res.data.user);
                setIsAuthenticated(true);
                return res.data;
            }
        } catch (error) {
            console.error('Registration failed:', error);
            throw error;
        }
    };

    const logout = async () => {
        try {
            await api.get("/auth/logout");
        } catch (error) {
            console.error('Logout error:', error);
        } finally {
            setUser(null);
            setIsAuthenticated(false);
            localStorage.removeItem('token'); // Cleanup just in case
            window.location.href = "/login";
        }
    };

    const updateProfile = async (data) => {
        try {
            const res = await api.patch("/auth/profile", data);
            if (res.data.success) {
                setUser(res.data.user);
                return res.data;
            }
        } catch (error) {
            console.error('Update profile failed:', error);
            throw error;
        }
    };

    return (
        <AuthContext.Provider value={{ user, loading, isAuthenticated, login, register, logout, updateProfile, checkAuthStatus }}>

            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
