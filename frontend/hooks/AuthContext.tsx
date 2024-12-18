import  { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import React from 'react';
import Cookies from 'js-cookie';

interface AuthContextType {
    user: User | null;
    login: (User: User) => void;
    logout: () => void;
}

interface User {
    username: string;
    email: string;
    avatar: string;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    console.log("user", user);

    useEffect(() => {
        const userCookie = Cookies.get('user');
        if (userCookie) {
            setUser(JSON.parse(userCookie));
        }
    }, []);

    const login = (userData: User) => {
        setUser(userData);
    };

    const logout = () => {
        Cookies.remove('user'); 
        setUser(null);
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
