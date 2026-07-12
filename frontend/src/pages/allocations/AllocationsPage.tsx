import React, { useEffect, useState } from 'react';
import { useAuth } from '../../state/auth/AuthContext';
import { apiClient } from '../../lib/api';

type AllocationRow = {
  id: string;
  assetId: string;
  status: string;
  assignedToUser?: { name?: string } | null;
  assignedToDepartment?: { name?: string } | null;
};

export default function AllocationsPage() {
  const { token } = useAuth();
  const [allocations, setAllocations] = useState<AllocationRow[]>([]);
  const [assetId, setAssetId] = useState('');
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!token) return;
    apiClient.allocations.list(token).then((res: any) => setAllocations(res.allocations ?? [])).catch(() => setAllocations([]));
  }, [token]);

  const onCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;
    try {
      await apiClient.allocations.create({ assetId }, token);
      setMessage('Allocation created');
      setAssetId('');
      const res: any = await apiClient.allocations.list(token);
      setAllocations(res.allocations ?? []);
    } catch (err: any) {
      setMessage(err?.message ?? 'Unable to create allocation');
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Allocations</h2>
      <form onSubmit={onCreate} style={{ display: 'grid', gap: 8, maxWidth: 320, marginBottom: 16 }}>
        <input value={assetId} onChange={(e) => setAssetId(e.target.value)} placeholder="Asset ID" />
        <button type="submit">Create allocation</button>
      </form>
      {message ? <p>{message}</p> : null}
      <ul>
        {allocations.map((allocation) => (
          <li key={allocation.id}>
            {allocation.assetId} — {allocation.status} — {allocation.assignedToUser?.name ?? allocation.assignedToDepartment?.name ?? 'Unassigned'}
          </li>
        ))}
      </ul>
    </div>
  );
}

