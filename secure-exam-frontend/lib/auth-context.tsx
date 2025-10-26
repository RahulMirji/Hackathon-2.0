'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User } from 'firebase/auth';

interface AuthContextType {
  user: User | null;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Lazy load Firebase to not block initial render
    let unsubscribe: (() => void) | undefined;

    const loadAuth = async () => {
      try {
        const { auth } = await import('./firebase');
        const { onAuthStateChanged } = await import('firebase/auth');

        unsubscribe = onAuthStateChanged(auth, (user) => {
          setUser(user);
          setLoading(false);
        });
      } catch (error) {
        console.error('Failed to load auth:', error);
        setLoading(false);
      }
    };

    // Start loading auth but don't wait for it
    loadAuth();

    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
