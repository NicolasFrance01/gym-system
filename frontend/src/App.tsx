import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import KioskView from './KioskView';
import AdminDashboard from './AdminDashboard';
import UserApp from './UserApp';
import TotemPlan from './TotemPlan';

function App() {
  const isWeb = !window.location.hostname.includes('localhost') && !window.location.hostname.includes('127.0.0.1') && window.location.protocol !== 'file:';

  return (
    <Router>
      <Routes>
        {/* Kiosk View - Default entry point for physical access */}
        <Route path="/" element={isWeb ? <Navigate to="/app" /> : <KioskView />} />

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
