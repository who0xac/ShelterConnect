import React from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Box,
  Avatar,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";

const Header = ({ sidebarOpen, drawerWidth, handleDrawerToggle, userName }) => {
  return (
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
        />
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
  );
};

export default Header;
