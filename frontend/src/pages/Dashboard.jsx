import React, { useState } from "react";
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
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import HomeIcon from "@mui/icons-material/Home";
import PeopleIcon from "@mui/icons-material/People";
import SettingsIcon from "@mui/icons-material/Settings";
import LogoutIcon from "@mui/icons-material/Logout";

const drawerWidth = 240;

const Dashboard = () => {
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleLogout = () => {
    localStorage.removeItem("token"); // Clear token
    navigate("/"); // Redirect to login
  };

  const drawer = (
    <Box
      sx={{
        width: drawerWidth,
        bgcolor: "#1a237e",
        color: "white",
        height: "100vh",
      }}
    >
      <Toolbar>
        <Typography variant="h6" sx={{ fontWeight: "bold", mx: "auto" }}>
          SHELTERCONNECT
        </Typography>
      </Toolbar>
      <Divider sx={{ bgcolor: "white" }} />
      <List>
        {[
          { text: "Home", icon: <HomeIcon /> },
          { text: "Users", icon: <PeopleIcon /> },
          { text: "Settings", icon: <SettingsIcon /> },
        ].map((item, index) => (
          <ListItem key={index} disablePadding>
            <ListItemButton>
              <ListItemIcon sx={{ color: "white" }}>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      <Box sx={{ position: "absolute", bottom: 20, width: "100%" }}>
        <Button
          startIcon={<LogoutIcon />}
          fullWidth
          onClick={handleLogout}
          sx={{
            color: "white",
            justifyContent: "flex-start",
            pl: 2,
            "&:hover": { bgcolor: "rgba(255, 255, 255, 0.2)" },
          }}
        >
          Logout
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
          bgcolor: "#1a237e",
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: "none" } }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap>
            Dashboard
          </Typography>
        </Toolbar>
      </AppBar>

      {/* Sidebar (Drawer) */}
      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
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
            "& .MuiDrawer-paper": { width: drawerWidth },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>

      {/* Main Content */}
      <Box component="main" sx={{ flexGrow: 1, p: 3, mt: 8 }}>
        <Typography variant="h4">Welcome to the Dashboard</Typography>
        <Typography variant="body1" sx={{ mt: 2 }}>
          This is your dashboard where you can manage users, settings, and more.
        </Typography>
      </Box>
    </Box>
  );
};

export default Dashboard;
