export interface User {
    id: string;
    username: string;
    email: string;
    avatar: string;
    name: string;
    created_at: number;
}

export interface GoogleJWT {
    email: string;
    name: string;
    avatar: string;
}

export interface AuthState {
    user: User | null;
    status: 'loading' | 'authenticated' | 'unauthenticated';
    login: (userData: User) => Promise<void>;
    logout: () => Promise<void>;
    refreshUser: () => Promise<void>;
}

export interface Project {
    id: string;
    name: string;
}

export interface ProjectStore {
    project: Project | null ;
    setProject: (project: Project) => void;
}