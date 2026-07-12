import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from './AuthContext';

export function RequireAuth({ children }: { children: React.ReactNode }) {
  const { token, loading, user } = useAuth();

  if (loading) {
    return (
      <div className="container">
        <div className="card" style={{ padding: 18 }}>
          Loading...
        </div>
      </div>
    );
  }

  if (!token || !user) return <Navigate to="/login" replace />;
  return <>{children}</>;
}

