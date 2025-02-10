import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  CssBaseline,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Divider,
  Button,
  Avatar,
  Card,
  CardContent,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import HomeIcon from "@mui/icons-material/Home";
import PeopleIcon from "@mui/icons-material/People";
import SettingsIcon from "@mui/icons-material/Settings";
import LogoutIcon from "@mui/icons-material/Logout";
import MenuOpenIcon from "@mui/icons-material/MenuOpen";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";

const drawerWidth = 240;

const Dashboard = () => {
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [userName, setUserName] = useState("");

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      // Replace with actual API call
      const response = await fetch("http://localhost:3000/users");
      const data = await response.json();
      setUserName(data.name || "User");
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

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

  const drawer = (
    <Box
      sx={{
        width: sidebarOpen ? drawerWidth : 80,
        bgcolor: "#1a237e",
        color: "white",
        height: "100vh",
        transition: "width 0.3s",
        overflowX: "hidden",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Toolbar sx={{ display: "flex", justifyContent: "space-between", px: 2 }}>
        <Typography
          variant="h6"
          sx={{
            fontFamily: "Poppins, sans-serif",
            fontWeight: 700,
            fontSize: sidebarOpen ? "1.5rem" : "1rem",
            transition: "font-size 0.3s",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          Dashboard
        </Typography>
        <IconButton onClick={handleSidebarToggle} sx={{ color: "white" }}>
          {sidebarOpen ? <MenuOpenIcon /> : <MenuIcon />}
        </IconButton>
      </Toolbar>
      <Divider sx={{ bgcolor: "white" }} />
      <List sx={{ flexGrow: 1 }}>
        {[
          { text: "Home", icon: <HomeIcon /> },
          { text: "Users", icon: <PeopleIcon /> },
          { text: "Settings", icon: <SettingsIcon /> },
        ].map((item, index) => (
          <ListItem key={index} disablePadding>
            <ListItemButton>
              <ListItemIcon sx={{ color: "white" }}>{item.icon}</ListItemIcon>
              {sidebarOpen && <ListItemText primary={item.text} />}
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      <Box sx={{ pb: 2, width: "100%" }}>
        <Button
          startIcon={<LogoutIcon />}
          fullWidth
          onClick={handleLogout}
          sx={{
            color: "white",
            justifyContent: "flex-start",
            pl: sidebarOpen ? 2 : 0,
            "&:hover": { bgcolor: "rgba(255, 255, 255, 0.2)" },
          }}
        >
          {sidebarOpen && "Logout"}
        </Button>
      </Box>
    </Box>
  );

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      {/* Header */}
      <AppBar
        position="fixed"
        sx={{
          bgcolor: "#ffffff",
          color: "#1a237e",
          width: { sm: `calc(100% - ${sidebarOpen ? drawerWidth : 80}px)` },
          ml: { sm: `${sidebarOpen ? drawerWidth : 80}px` },
          transition: "width 0.3s, margin-left 0.3s",
          boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
        }}
      >
        <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
          <IconButton
            color="inherit"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: "none" } }}
          >
            <MenuIcon />
          </IconButton>
          <Typography
            variant="h6"
            noWrap
            sx={{ fontFamily: "Poppins, sans-serif", fontWeight: 600 }}
          >
            ShelterConnect
          </Typography>
          {/* User Profile */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Typography
              variant="body1"
              sx={{ fontFamily: "Poppins, sans-serif", fontWeight: 500 }}
            >
              Hi, {userName}
            </Typography>
            <Avatar sx={{ bgcolor: "#1a237e" }}>
              <AccountCircleIcon />
            </Avatar>
          </Box>
        </Toolbar>
      </AppBar>
      {/* Sidebar (Drawer) */}
      <Box
        component="nav"
        sx={{
          width: { sm: sidebarOpen ? drawerWidth : 80 },
          flexShrink: { sm: 0 },
          transition: "width 0.3s",
        }}
      >
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          sx={{ "& .MuiDrawer-paper": { width: drawerWidth } }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: "none", sm: "block" },
            "& .MuiDrawer-paper": {
              width: sidebarOpen ? drawerWidth : 80,
              transition: "width 0.3s",
              overflowX: "hidden",
            },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>
      {/* Main Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          mt: 8,
          width: { sm: `calc(100% - ${sidebarOpen ? drawerWidth : 80}px)` },
          transition: "width 0.3s",
        }}
      >
        <Typography
          variant="h4"
          sx={{ fontFamily: "Poppins, sans-serif", fontWeight: 600 }}
        >
          Welcome to the Dashboard
        </Typography>
        <Typography
          variant="body1"
          sx={{ mt: 2, fontFamily: "Poppins, sans-serif", color: "#666" }}
        >
          This is your dashboard where you can manage users, settings, and more.
        </Typography>
        {/* Additional Dashboard Cards */}
        <Box sx={{ mt: 4, display: "flex", gap: 3 }}>
          <Card sx={{ minWidth: 275, bgcolor: "#f5f5f5" }}>
            <CardContent>
              <Typography variant="h5" component="div">
                120
              </Typography>
              <Typography sx={{ color: "#666" }}>Active Users</Typography>
            </CardContent>
          </Card>
          <Card sx={{ minWidth: 275, bgcolor: "#f5f5f5" }}>
            <CardContent>
              <Typography variant="h5" component="div">
                56
              </Typography>
              <Typography sx={{ color: "#666" }}>Pending Requests</Typography>
            </CardContent>
          </Card>
        </Box>
      </Box>
    </Box>
  );
};

export default Dashboard;
