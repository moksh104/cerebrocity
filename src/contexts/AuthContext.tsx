import { createContext, useContext, useState, useEffect, ReactNode } from "react";

const API_URL = "https://cerebrocity.onrender.com/api/auth";

interface User {
    id: number;
    username: string;
    email: string;
    xp: number;
    level: number;
    buildings_count: number;
    streak_days: number;
    created_at: string;
}

interface AuthContextType {
    user: User | null;
    loading: boolean;
    login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
    signup: (username: string, email: string, password: string) => Promise<{ success: boolean; error?: string }>;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error("useAuth must be used within AuthProvider");
    return ctx;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    // Auto-fetch user on mount if token exists
    useEffect(() => {
        const token = localStorage.getItem("cerebrocity_token");
        if (token) {
            fetch(`${API_URL}/me`, {
                headers: { Authorization: `Bearer ${token}` },
            })
                .then((r) => r.json())
                .then((data) => {
                    if (data.user) setUser(data.user);
                    else localStorage.removeItem("cerebrocity_token");
                })
                .catch(() => localStorage.removeItem("cerebrocity_token"))
                .finally(() => setLoading(false));
        } else {
            setLoading(false);
        }
    }, []);

    const signup = async (username: string, email: string, password: string) => {
        try {
            const res = await fetch(`${API_URL}/signup`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username, email, password }),
            });
            const data = await res.json();
            if (!res.ok) return { success: false, error: data.error };
            localStorage.setItem("cerebrocity_token", data.token);
            setUser(data.user);
            return { success: true };
        } catch {
            return { success: false, error: "Cannot connect to server. Is the backend running?" };
        }
    };

    const login = async (email: string, password: string) => {
        try {
            const res = await fetch(`${API_URL}/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
            });
            const data = await res.json();
            if (!res.ok) return { success: false, error: data.error };
            localStorage.setItem("cerebrocity_token", data.token);
            setUser(data.user);
            return { success: true };
        } catch {
            return { success: false, error: "Cannot connect to server. Is the backend running?" };
        }
    };

    const logout = () => {
        localStorage.removeItem("cerebrocity_token");
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, signup, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
