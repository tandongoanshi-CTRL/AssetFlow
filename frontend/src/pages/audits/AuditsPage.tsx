import React, { useState } from 'react';
import { useAuth } from '../../state/auth/AuthContext';
import { apiClient } from '../../lib/api';

export default function AuditsPage() {
  const { token } = useAuth();
  const [auditCycleId, setAuditCycleId] = useState('');
  const [message, setMessage] = useState<string | null>(null);

  const onClose = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;
    try {
      const res: any = await apiClient.audits.close(auditCycleId, token);
      setMessage(res?.result ? 'Audit cycle closed' : 'Audit cycle closed');
      setAuditCycleId('');
    } catch (err: any) {
      setMessage(err?.message ?? 'Unable to close audit cycle');
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Audits</h2>
      <form onSubmit={onClose} style={{ display: 'grid', gap: 8, maxWidth: 320 }}>
        <input value={auditCycleId} onChange={(e) => setAuditCycleId(e.target.value)} placeholder="Audit Cycle ID" />
        <button type="submit">Close audit cycle</button>
      </form>
      {message ? <p>{message}</p> : null}
    </div>
  );
}

