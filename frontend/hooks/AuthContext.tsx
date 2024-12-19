import  { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import React from 'react';
import Cookies from 'js-cookie';
import { User } from '../types/types';
import { getCurrentUser, logoutUser } from '../src/api/auth';

interface AuthContextType {
    user: User | null;
    login: (User: User) => void;
    logout: () => void;
}



const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
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

    if (status === 'loading') {
        return <></>
    }

    const login = async  (userData: User) => {
        setUser(userData);
        await refreshUser();
    };

    const logout = async () => {
        await logoutUser();
        await refreshUser();
    };

    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    return useContext(AuthContext);
};
