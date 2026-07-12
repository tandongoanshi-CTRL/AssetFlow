import React from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { RequireAuth } from '../state/auth/RequireAuth';

import LoginPage from '../pages/auth/LoginPage';
import SignupPage from '../pages/auth/SignupPage';
import AllocationsPage from '../pages/allocations/AllocationsPage';
import TransfersPage from '../pages/transfers/TransfersPage';
import BookingsPage from '../pages/bookings/BookingsPage';
import MaintenancePage from '../pages/maintenance/MaintenancePage';
import AuditsPage from '../pages/audits/AuditsPage';
import AdminUsersPage from '../pages/admin/AdminUsersPage';

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/allocations" replace />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />

      <Route
        path="/allocations"
        element={
          <RequireAuth>
            <AllocationsPage />
          </RequireAuth>
        }
      />
      <Route
        path="/transfers"
        element={
          <RequireAuth>
            <TransfersPage />
          </RequireAuth>
        }
      />
      <Route
        path="/bookings"
        element={
          <RequireAuth>
            <BookingsPage />
          </RequireAuth>
        }
      />
      <Route
        path="/maintenance"
        element={
          <RequireAuth>
            <MaintenancePage />
          </RequireAuth>
        }
      />
      <Route
        path="/audits"
        element={
          <RequireAuth>
            <AuditsPage />
          </RequireAuth>
        }
      />
      <Route
        path="/admin/users"
        element={
          <RequireAuth>
            <AdminUsersPage />
          </RequireAuth>
        }
      />

      <Route path="*" element={<Navigate to="/allocations" replace />} />
    </Routes>
  );
}

