import { BrowserRouter, Routes, Route } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import Home from './pages/Home';
import Login from './pages/Login';
import CitizenDashboard from './pages/CitizenDashboard';
import AdminDashboard from './pages/AdminDashboard';
import OfficialDashboard from './pages/OfficialDashboard';
import ReportIssue from './pages/ReportIssue';
import MapView from './pages/MapView';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Home />} />
          <Route path="login" element={<Login />} />
          <Route path="citizen" element={<CitizenDashboard />} />
          <Route path="admin" element={<AdminDashboard />} />
          <Route path="official" element={<OfficialDashboard />} />
          <Route path="report" element={<ReportIssue />} />
          <Route path="map" element={<MapView />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;