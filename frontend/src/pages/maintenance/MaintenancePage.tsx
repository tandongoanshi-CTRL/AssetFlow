import React, { useState } from 'react';
import { useAuth } from '../../state/auth/AuthContext';
import { apiClient } from '../../lib/api';

export default function MaintenancePage() {
  const { token } = useAuth();
  const [assetId, setAssetId] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('MEDIUM');
  const [message, setMessage] = useState<string | null>(null);

  const onCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;
    try {
      await apiClient.maintenance.create({ assetId, description, priority }, token);
      setMessage('Maintenance request submitted');
      setAssetId('');
      setDescription('');
      setPriority('MEDIUM');
    } catch (err: any) {
      setMessage(err?.message ?? 'Unable to create maintenance request');
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Maintenance</h2>
      <form onSubmit={onCreate} style={{ display: 'grid', gap: 8, maxWidth: 320 }}>
        <input value={assetId} onChange={(e) => setAssetId(e.target.value)} placeholder="Asset ID" />
        <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Description" />
        <select value={priority} onChange={(e) => setPriority(e.target.value)}>
          <option value="LOW">Low</option>
          <option value="MEDIUM">Medium</option>
          <option value="HIGH">High</option>
        </select>
        <button type="submit">Submit maintenance request</button>
      </form>
      {message ? <p>{message}</p> : null}
    </div>
  );
}

