import type { User } from './types';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

export async function loginWithCustomAuth(username: string, password: string) {
    const response = await fetch(`${API_URL}/api/auth/login`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
    });

    if (!response.ok) {
        throw new Error('Credenciales inválidas');
    }

    const data = await response.json();
    return data;
}

export function setUserSession(user: User) {
    sessionStorage.setItem('user', JSON.stringify(user));
}

export function getUserSession(): User | null {
    const userStr = sessionStorage.getItem('user');
    if (!userStr) return null;
    try {
        return JSON.parse(userStr);
    } catch {
        return null;
    }
}

export function clearUserSession() {
    sessionStorage.removeItem('user');
}

export function isAuthenticated(): boolean {
    return getUserSession() !== null;
}