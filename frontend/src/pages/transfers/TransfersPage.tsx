import React, { useState } from 'react';
import { useAuth } from '../../state/auth/AuthContext';
import { apiClient } from '../../lib/api';

export default function TransfersPage() {
  const { token } = useAuth();
  const [assetId, setAssetId] = useState('');
  const [targetUserId, setTargetUserId] = useState('');
  const [message, setMessage] = useState<string | null>(null);

  const onCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;
    try {
      await apiClient.transfers.create({ assetId, targetUserId }, token);
      setMessage('Transfer request created');
      setAssetId('');
      setTargetUserId('');
    } catch (err: any) {
      setMessage(err?.message ?? 'Unable to create transfer');
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Transfers</h2>
      <form onSubmit={onCreate} style={{ display: 'grid', gap: 8, maxWidth: 320 }}>
        <input value={assetId} onChange={(e) => setAssetId(e.target.value)} placeholder="Asset ID" />
        <input value={targetUserId} onChange={(e) => setTargetUserId(e.target.value)} placeholder="Target User ID" />
        <button type="submit">Create transfer request</button>
      </form>
      {message ? <p>{message}</p> : null}
    </div>
  );
}

