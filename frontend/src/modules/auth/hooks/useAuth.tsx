import type { User } from '@starsector-builds/shared/user/types';
import { createContext, useContext } from 'react';

export interface AuthContextType {
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    signup: (
        username: string,
        password: string,
        email: string,
    ) => Promise<void>;
    login: (identifier: string, password: string) => Promise<void>;
    logout: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | null>(null);

export default function useAuth() {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
    return ctx;
}
