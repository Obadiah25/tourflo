import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { supabase } from '../lib/supabase';

interface User {
    id: string;
    email?: string;
    user_metadata: {
        role?: 'tourist' | 'operator';
        [key: string]: any;
    };
}

interface AuthContextType {
    session: any;
    user: User | null;
    role: 'tourist' | 'operator' | null;
    isGuestMode: boolean;
    loading: boolean;
    login: (role: 'tourist' | 'operator') => void;
    guestLogin: () => void;
    logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [session, setSession] = useState<any>(null);
    const [user, setUser] = useState<User | null>(null);
    const [role, setRole] = useState<'tourist' | 'operator' | null>(null);
    const [isGuestMode, setIsGuestMode] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Load state from local storage
        const storedGuestMode = localStorage.getItem('tourflo_guest_mode') === 'true';
        setIsGuestMode(storedGuestMode);

        // Check active session
        supabase.auth.getSession().then(({ data: { session } }) => {
            setSession(session);
            if (session?.user) {
                setUser(session.user as User);
                setRole(session.user.user_metadata?.role || 'tourist');
            }
            setLoading(false);
        });

        // Listen for auth changes
        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session);
            if (session?.user) {
                setUser(session.user as User);
                setRole(session.user.user_metadata?.role || 'tourist');
                setIsGuestMode(false); // Clear guest mode on login
                localStorage.removeItem('tourflo_guest_mode');
            } else {
                setUser(null);
                setRole(null);
            }
        });

        return () => subscription.unsubscribe();
    }, []);

    const login = (role: 'tourist' | 'operator') => {
        // This is mostly handled by Supabase auth flow, but we can use this to set local state if needed
        // For now, we rely on onAuthStateChange
    };

    const guestLogin = () => {
        setIsGuestMode(true);
        localStorage.setItem('tourflo_guest_mode', 'true');
    };

    const logout = async () => {
        await supabase.auth.signOut();
        setSession(null);
        setUser(null);
        setRole(null);
        setIsGuestMode(false);
        localStorage.removeItem('tourflo_guest_mode');
    };

    return (
        <AuthContext.Provider value={{ session, user, role, isGuestMode, loading, login, guestLogin, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
