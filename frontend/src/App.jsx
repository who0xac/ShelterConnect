import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from './pages/Login.jsx';
import DashboardPage from "./pages/Dashboard.jsx";
import ProtectedRoute from "./pages/ProtectedRoute.jsx";
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<DashboardPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
