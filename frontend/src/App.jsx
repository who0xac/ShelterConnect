import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login.jsx";
import DashboardPage from "./pages/Dashboard.jsx";
import ProtectedRoute from "./pages/ProtectedRoute.jsx";
import RegisteredRSL from "./pages/RegisteredRSL.jsx";
import Staff from "./pages/Staff.jsx";
import Properties from "./pages/Properties.jsx";
import Tenants from "./pages/Tenant.jsx";
import Agents from "./pages/Agents.jsx";
import NotFoundPage from "./pages/404.jsx";
import UnauthorizedPage from "./components/UnauthorizedPage.jsx";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/unauthorized" element={<UnauthorizedPage />} />
        {/* Authenticated but no role requirement */}
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<DashboardPage />} />
        </Route>

        {/* Routes requiring specific roles */}
        <Route element={<ProtectedRoute requiredRole={5} />}>
          <Route path="/registered-rsl" element={<RegisteredRSL />} />
        </Route>

        <Route element={<ProtectedRoute requiredRole={6} />}>
          <Route path="/staff" element={<Staff />} />
        </Route>

        <Route element={<ProtectedRoute requiredRole={3} />}>
          <Route path="/properties" element={<Properties />} />
        </Route>

        <Route element={<ProtectedRoute requiredRole={2} />}>
          <Route path="/tenants" element={<Tenants />} />
        </Route>

        <Route element={<ProtectedRoute requiredRole={4} />}>
          <Route path="/agents" element={<Agents />} />
        </Route>

        {/* Catch-all 404 */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
