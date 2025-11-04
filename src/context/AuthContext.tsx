import type { ReactNode } from 'react';
import { createContext, useContext, useEffect, useState } from 'react';
import { clearUserSession, getUserSession, setUserSession } from '../lib/auth';
import type { User } from '../lib/types';

interface AuthContextType {
    user: User | null;
    login: (user: User) => void;
    logout: () => void;
    isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const currentUser = getUserSession();
        setUser(currentUser);
        setIsLoading(false);
    }, []);

    const login = (userData: User) => {
        setUserSession(userData);
        setUser(userData);
    };

    const logout = () => {
        clearUserSession();
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, isLoading }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
