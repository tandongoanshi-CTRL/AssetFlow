import React, { useState } from 'react';
import { useAuth } from '../../state/auth/AuthContext';
import { apiClient } from '../../lib/api';

export default function BookingsPage() {
  const { token } = useAuth();
  const [assetId, setAssetId] = useState('');
  const [startDatetime, setStartDatetime] = useState('');
  const [endDatetime, setEndDatetime] = useState('');
  const [message, setMessage] = useState<string | null>(null);

  const onCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;
    try {
      await apiClient.bookings.create({ assetId, startDatetime, endDatetime }, token);
      setMessage('Booking created');
      setAssetId('');
      setStartDatetime('');
      setEndDatetime('');
    } catch (err: any) {
      setMessage(err?.message ?? 'Unable to create booking');
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Bookings</h2>
      <form onSubmit={onCreate} style={{ display: 'grid', gap: 8, maxWidth: 320 }}>
        <input value={assetId} onChange={(e) => setAssetId(e.target.value)} placeholder="Asset ID" />
        <input value={startDatetime} onChange={(e) => setStartDatetime(e.target.value)} placeholder="Start datetime" />
        <input value={endDatetime} onChange={(e) => setEndDatetime(e.target.value)} placeholder="End datetime" />
        <button type="submit">Create booking</button>
      </form>
      {message ? <p>{message}</p> : null}
    </div>
  );
}

