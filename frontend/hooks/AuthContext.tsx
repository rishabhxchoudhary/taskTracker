import  { createContext, ReactNode, useEffect } from 'react';
import React from 'react';
import { User } from '../types/types';
import { useAuthStore } from '../store/authStore'

interface AuthContextType {
    user: User | null;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const auth = useAuthStore((state)=> state)

    useEffect(()=>{
        auth?.refreshUser()
    },[])

    if (auth?.status === 'loading') {
        return <></>
    }

    return (
        <AuthContext.Provider value={{ user: null }}>
            {children}
        </AuthContext.Provider>
    );
};