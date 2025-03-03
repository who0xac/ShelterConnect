import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Box, CssBaseline } from "@mui/material";
import Header from "../components/Header.jsx";
import Sidebar from "../components/Sidebar.jsx";
import MainContent from "../components/MainContent.jsx";
import { getCurrentUser } from "../api/userApi.js";

const drawerWidth = 240;

const Dashboard = () => {
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [userName, setUserName] = useState("");


  useEffect(() => {
    getCurrentUser(navigate, setUserName);
  }, []);


  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleSidebarToggle = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <Header
        sidebarOpen={sidebarOpen}
        drawerWidth={drawerWidth}
        handleDrawerToggle={handleDrawerToggle}
        userName={userName}
      />
      <Sidebar
        sidebarOpen={sidebarOpen}
        drawerWidth={drawerWidth}
        mobileOpen={mobileOpen}
        handleDrawerToggle={handleDrawerToggle}
        handleSidebarToggle={handleSidebarToggle}
        handleLogout={handleLogout}
        navigate={navigate}
      />
      <MainContent sidebarOpen={sidebarOpen} drawerWidth={drawerWidth} />
    </Box>
  );
};

export default Dashboard;
