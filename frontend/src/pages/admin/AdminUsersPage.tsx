import React, { useState } from 'react';
import { useAuth } from '../../state/auth/AuthContext';
import { apiClient } from '../../lib/api';

export default function AdminUsersPage() {
  const { token } = useAuth();
  const [userId, setUserId] = useState('');
  const [role, setRole] = useState<'DEPT_HEAD' | 'ASSET_MANAGER'>('DEPT_HEAD');
  const [message, setMessage] = useState<string | null>(null);

  const onPromote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;
    try {
      await apiClient.admin.promoteUser(userId, role, token);
      setMessage(`User ${userId} promoted to ${role}`);
      setUserId('');
    } catch (err: any) {
      setMessage(err?.message ?? 'Unable to promote user');
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Admin - Users</h2>
      <form onSubmit={onPromote} style={{ display: 'grid', gap: 8, maxWidth: 320 }}>
        <input value={userId} onChange={(e) => setUserId(e.target.value)} placeholder="User ID" />
        <select value={role} onChange={(e) => setRole(e.target.value as 'DEPT_HEAD' | 'ASSET_MANAGER')}>
          <option value="DEPT_HEAD">Department Head</option>
          <option value="ASSET_MANAGER">Asset Manager</option>
        </select>
        <button type="submit">Promote user</button>
      </form>
      {message ? <p>{message}</p> : null}
    </div>
  );
}

