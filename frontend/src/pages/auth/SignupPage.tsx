import React, { useState } from 'react';
import { useAuth } from '../../state/auth/AuthContext';

export default function SignupPage() {
  const { signup } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      await signup(name, email, password);
    } catch (err: any) {
      setError(err?.message ?? 'Signup failed');
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Sign up</h2>
      <form onSubmit={onSubmit} style={{ display: 'grid', gap: 12, maxWidth: 320 }}>
        <label>
          Name
          <input value={name} onChange={(e) => setName(e.target.value)} style={{ width: '100%' }} />
        </label>
        <label>
          Email
          <input value={email} onChange={(e) => setEmail(e.target.value)} style={{ width: '100%' }} />
        </label>
        <label>
          Password
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{ width: '100%' }}
          />
        </label>
        <button type="submit">Create account</button>
        {error ? <div style={{ color: 'crimson' }}>{error}</div> : null}
      </form>

      <p style={{ marginTop: 16 }}>
        Already have an account? <a href="/login">Login</a>
      </p>
    </div>
  );
}

