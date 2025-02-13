import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from './pages/Login.jsx';
import DashboardPage from "./pages/Dashboard.jsx";
import ProtectedRoute from "./pages/ProtectedRoute.jsx";
import RegisteredRSL from "./pages/RegisteredRSL.jsx"; 
// import Staff from "./pages/Staff.jsx";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/registered-rsl" element={<RegisteredRSL />} />
          {/* <Route path="/staff" element={<Staff />} /> */}
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
