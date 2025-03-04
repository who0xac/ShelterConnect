import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from './pages/Login.jsx';
import DashboardPage from "./pages/Dashboard.jsx";
import ProtectedRoute from "./pages/ProtectedRoute.jsx";
import RegisteredRSL from "./pages/RegisteredRSL.jsx"; 
import Staff from "./pages/Staff.jsx";
import Properties from "./pages/Properties.jsx";
import Tenants from "./pages/Tenant.jsx";
import Agents from "./pages/Agents.jsx";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/registered-rsl" element={<RegisteredRSL />} />
          <Route path="/staff" element={<Staff />} />
          <Route path="/properties" element={<Properties />} />
          <Route path="/tenants" element={<Tenants />} />
          <Route path="/agents" element={<Agents />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
