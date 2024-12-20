import { create } from 'zustand';
import { AuthState, User } from '../types/types';
import { getCurrentUser, logoutUser } from '../src/api/auth';

export const useAuthStore = create<AuthState>((set) => ({
    user: null,
    status: 'loading',
    login: async (userData: User) => {
        set({ user: userData, status: 'loading' });
        try {
            await getCurrentUser(); // Assuming this sets the current user on the server
            set({ user: userData, status: 'authenticated' });
        } catch (error) {
            set({ user: null, status: 'unauthenticated' });
            console.error('Login failed:', error);
        }
    },
    logout: async () => {
        set({ status: 'loading' });
        try {
            await logoutUser();
            set({ user: null, status: 'unauthenticated' });
        } catch (error) {
            console.error('Logout failed:', error);
        }
    },
    refreshUser: async () => {
        set({ status: 'loading' });
        try {
            const data = await getCurrentUser();
            set({ user: data, status: 'authenticated' });
        } catch {
            set({ user: null, status: 'unauthenticated' });
        }
    },
}));