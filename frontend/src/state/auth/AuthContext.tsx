import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { apiClient } from '../../lib/api';

export type Role = 'EMPLOYEE' | 'DEPT_HEAD' | 'ASSET_MANAGER' | 'ADMIN';

export type AuthUser = {
  id: string;
  name: string;
  email: string;
  role: Role;
  status: string;
};

type AuthContextValue = {
  token: string | null;
  user: AuthUser | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  refreshMe: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

const TOKEN_KEY = 'assetflow_token';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(() => localStorage.getItem(TOKEN_KEY));
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const refreshMe = async () => {
    if (!token) {
      setUser(null);
      return;
    }
    const res = (await apiClient.get('/auth/me', token)) as any;
    setUser(res.user as AuthUser);
  };

  useEffect(() => {
    (async () => {
      try {
        if (token) {
          await refreshMe();
        }
      } catch {
        // Keep the app usable even if backend returns unexpected payloads
        localStorage.removeItem(TOKEN_KEY);
        setToken(null);
        setUser(null);
      } finally {
        setLoading(false);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      token,
      user,
      loading,
      login: async (email, password) => {
        const res = (await apiClient.post('/auth/login', { email, password })) as any;
        const nextToken = res.token as string;
        localStorage.setItem(TOKEN_KEY, nextToken);
        setToken(nextToken);
        await refreshMe();
      },
      signup: async (name, email, password) => {
        const res = (await apiClient.post('/auth/signup', { name, email, password })) as any;
        const nextToken = res.token as string;
        localStorage.setItem(TOKEN_KEY, nextToken);
        setToken(nextToken);
        await refreshMe();
      },
      logout: () => {
        localStorage.removeItem(TOKEN_KEY);
        setToken(null);
        setUser(null);
      },
      refreshMe
    }),
    [token]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}

