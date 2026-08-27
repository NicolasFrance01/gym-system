import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import KioskView from './KioskView';
import AdminDashboard from './AdminDashboard';
import UserApp from './UserApp';
import TotemPlan from './TotemPlan';

function App() {
  const isVercel = window.location.hostname.includes('vercel');

  return (
    <Router>
      <Routes>
        {/* Kiosk View - Default entry point for physical access */}
        <Route path="/" element={isVercel ? <Navigate to="/app" /> : <KioskView />} />

        {/* Admin Dashboard - The Brain (Back-End/SaaS) */}
        <Route path="/admin" element={<AdminDashboard />} />

        {/* User App - The Heart (Front-End) */}
        <Route path="/app" element={<UserApp />} />

        {/* Totem de Plan - Kiosk for members to log training */}
        <Route path="/totem-plan" element={<TotemPlan />} />
      </Routes>
    </Router>
  );
}

export default App;
