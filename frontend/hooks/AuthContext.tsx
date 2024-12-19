import  { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import React from 'react';
import { User } from '../types/types';
import { getCurrentUser, logoutUser } from '../src/api/auth';

interface AuthContextType {
    user: User | null;
    login: (User: User) => void;
    logout: () => void;
    status: string
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    console.log("user", user)
    const [status, setStatus] = useState('loading');
    useEffect(() => {
        console.log("useEffect called");
        refreshUser();
    }, []);

    const refreshUser = async () => {
        try {
            const data = await getCurrentUser(); 
            console.log("data", data);
            setUser(data);
            setStatus('authenticated')
        } catch {
            setUser(null);
            setStatus('unauthenticated')
        }
    };

    const login = async  (userData: User) => {
        setUser(userData);
        await refreshUser();
    };

    const logout = async () => {
        await logoutUser();
        await refreshUser();
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, status }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    return useContext(AuthContext);
};
