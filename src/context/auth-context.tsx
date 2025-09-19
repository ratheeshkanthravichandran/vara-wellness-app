'use client';
import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react';
import { onAuthStateChanged, type User } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { usePathname, useRouter } from 'next/navigation';

type AuthContextType = {
  user: User | null;
  loading: boolean;
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
});

const PROTECTED_ROUTES = [
    '/dashboard',
    '/calendar',
    '/health-monitor',
    '/wellness',
    '/diet',
    '/suggestions',
    '/pcos-pcod',
    '/assistant',
    '/settings'
];
const AUTH_ROUTES = ['/login', '/register'];

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!loading && !user && PROTECTED_ROUTES.includes(pathname)) {
      router.push('/login');
    }
    if (!loading && user && AUTH_ROUTES.includes(pathname)) {
        router.push('/dashboard');
    }
  }, [user, loading, router, pathname]);

  if (loading) {
    return (
        <div className="flex flex-1 flex-col items-center justify-center">
            <p>Loading...</p>
        </div>
    );
  }


  return (
    <AuthContext.Provider value={{ user, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
