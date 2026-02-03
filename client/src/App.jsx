import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import DashboardPage from './pages/DashboardPage';
import MembersPage from './pages/MembersPage';
import MemberProfilePage from './pages/MemberProfilePage';
import PaymentsPage from './pages/PaymentsPage';
import PlansPage from './pages/PlansPage';
import CheckInPage from './pages/CheckInPage';
import LoginPage from './pages/LoginPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route element={<Layout />}>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/members" element={<MembersPage />} />
          <Route path="/members/:id" element={<MemberProfilePage />} />
          <Route path="/payments" element={<PaymentsPage />} />
          <Route path="/plans" element={<PlansPage />} />
          <Route path="/checkin" element={<CheckInPage />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
