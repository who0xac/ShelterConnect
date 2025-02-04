import { BrowserRouter, Routes, Route } from "react-router-dom";
import Registration from "./components/Registartion.jsx";
import Login from './pages/Login.jsx'


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login/>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
