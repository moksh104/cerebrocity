import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, onAuthStateChanged, signOut, updateProfile } from "firebase/auth";
import { auth } from "../firebase";

interface User {
    id: string;
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

// Helper to format firebase user to our app's user structure
const formatUser = (firebaseUser: any): User => {
    return {
        id: firebaseUser.uid,
        username: firebaseUser.displayName || firebaseUser.email?.split("@")[0] || "Commander",
        email: firebaseUser.email || "",
        xp: 150, // Mock stats
        level: 2,
        buildings_count: 5,
        streak_days: 3,
        created_at: firebaseUser.metadata.creationTime || new Date().toISOString()
    };
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
            if (firebaseUser) {
                setUser(formatUser(firebaseUser));
            } else {
                setUser(null);
            }
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const signup = async (username: string, email: string, password: string) => {
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            // Update display name for the new user
            await updateProfile(userCredential.user, { displayName: username });
            
            setUser(formatUser({ ...userCredential.user, displayName: username }));
            console.log("Account created");
            return { success: true };
        } catch (error: any) {
            console.log(error.message);
            return { success: false, error: error.message };
        }
    };

    const login = async (email: string, password: string) => {
        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            setUser(formatUser(userCredential.user));
            console.log("Login success", userCredential.user);
            return { success: true };
        } catch (error: any) {
            console.error(error.message);
            return { success: false, error: error.message };
        }
    };

    const logout = async () => {
        try {
            await signOut(auth);
            setUser(null);
        } catch (error) {
            console.error("Logout error", error);
        }
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, signup, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
