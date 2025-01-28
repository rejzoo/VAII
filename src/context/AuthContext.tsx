'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { createClient } from '../app/utils/supabase/client';
import { User, Session, AuthChangeEvent } from '@supabase/supabase-js';

const supabase = createClient();

interface AuthContextType {
  isLoggedIn: boolean;
  user: User | null;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType>({
  isLoggedIn: false,
  user: null,
  loading: true,
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      setIsLoggedIn(!!session);
      setUser(session?.user || null);
      setLoading(false);
    };

    // Listen for login/logout events
    const { data: listener } = supabase.auth.onAuthStateChange(
      (_: AuthChangeEvent, session: Session | null) => {
        setIsLoggedIn(!!session);
        setUser(session?.user || null);
      }
    );

    fetchSession();

    // Cleanup listener on component unmount
    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  return (
    <AuthContext.Provider value={{ isLoggedIn, user, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
