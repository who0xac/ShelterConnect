import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from './pages/Login.jsx';
// import DashboardPage from "./pages/Dashboard.jsx";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login/>} />
        {/* <Route path="/ds" element={<DashboardPage />} /> */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
