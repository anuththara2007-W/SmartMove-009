import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import PassengerView from './pages/PassengerView';
import AdminDashboard from './pages/AdminDashboard';
import ReportsView from './pages/ReportsView';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<PassengerView />} />
          <Route path="admin" element={<AdminDashboard />} />
          <Route path="reports" element={<ReportsView />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
