import React, { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { supabase } from '../supabaseClient';
import type { Session, User } from '@supabase/supabase-js';

interface AuthContextType {
    isAuthenticated: boolean;
    user: User | null;
    login: (password: string) => Promise<{ error: any }>;
    logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [session, setSession] = useState<Session | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    useEffect(() => {
        // Check active session
        const initSession = async () => {
            try {
                const { data: { session }, error } = await supabase.auth.getSession();
                if (error) {
                    throw error;
                }
                setSession(session);
            } catch (error: any) {
                console.error("Error checking session:", error);
                if (error.message?.includes("Refresh Token Not Found") || error.message?.includes("Invalid Refresh Token")) {
                    await supabase.auth.signOut();
                    setSession(null);
                }
            } finally {
                setIsLoading(false);
            }
        };

        initSession();

        // Listen for changes
        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session);
            setIsLoading(false);
        });

        return () => subscription.unsubscribe();
    }, []);

    const login = async (password: string) => {
        const EMAIL = 'rooshy@dailyflow.app';

        console.log('Attempting login with:', EMAIL);

        // 1. Try to sign in
        const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
            email: EMAIL,
            password: password,
        });

        if (!signInError && signInData.session) {
            console.log('Login successful');
            return { error: null };
        }

        console.log('Login failed (expected if new user):', signInData, signInError?.message);

        // 2. If sign in fails, try to sign up (first time setup)
        console.log('Attempting auto-signup...');
        const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
            email: EMAIL,
            password: password,
        });

        if (signUpError) {
            console.error('Signup error:', signUpError);
            // Check if user already exists (meaning password was wrong in step 1)
            if (signUpError.message.includes('already registered') || signUpError.message.includes('User already exists')) {
                return { error: { message: 'Incorrect password' } };
            }
            return { error: signUpError };
        }

        if (signUpData.user && !signUpData.session) {
            console.warn('Signup successful but no session. Email confirmation likely enabled.');
            return { error: { message: 'Account created but not logged in. Please disable "Confirm Email" in Supabase settings.' } };
        }

        console.log('Signup successful, session created');
        return { error: null };
    };

    const logout = async () => {
        await supabase.auth.signOut();
    };

    if (isLoading) {
        return <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Loading...</div>;
    }

    return (
        <AuthContext.Provider value={{
            isAuthenticated: !!session,
            user: session?.user ?? null,
            login,
            logout
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
