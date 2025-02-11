import React from "react";
import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
  IconButton,
  Divider,
  Button,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import DashboardIcon from "@mui/icons-material/Dashboard";
import FamilyRestroomIcon from "@mui/icons-material/FamilyRestroom";
import ApartmentIcon from "@mui/icons-material/Apartment";
import BadgeIcon from "@mui/icons-material/Badge";
import GroupWorkIcon from "@mui/icons-material/GroupWork";
import SettingsIcon from "@mui/icons-material/Settings";
import SupervisorAccountIcon from "@mui/icons-material/SupervisorAccount";
import LogoutIcon from "@mui/icons-material/Logout";
import MenuOpenIcon from "@mui/icons-material/MenuOpen";

const navigationItems = [
  { text: "Dashboard", icon: <DashboardIcon />, path: "/dashboard" },
  { text: "Tenants", icon: <FamilyRestroomIcon />, path: "/tenants" },
  { text: "Properties", icon: <ApartmentIcon />, path: "/properties" },
  { text: "Agents", icon: <BadgeIcon />, path: "/agents" },
  { text: "Registered RSL", icon: <GroupWorkIcon />, path: "/registered-rsl" },
  { text: "Staff", icon: <SupervisorAccountIcon />, path: "/staff" },
  { text: "Settings", icon: <SettingsIcon />, path: "/settings" },
];

const Sidebar = ({
  sidebarOpen,
  drawerWidth,
  mobileOpen,
  handleDrawerToggle,
  handleSidebarToggle,
  handleLogout,
  navigate,
}) => {
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
            fontSize: sidebarOpen ? "1.1rem" : "1rem",
            transition: "font-size 0.3s",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          ShelterConnect
        </Typography>
        <IconButton onClick={handleSidebarToggle} sx={{ color: "white" }}>
          {sidebarOpen ? <MenuOpenIcon /> : <MenuIcon />}
        </IconButton>
      </Toolbar>
      <Divider sx={{ bgcolor: "rgba(255, 255, 255, 0.2)" }} />
      <List sx={{ flexGrow: 1 }}>
        {navigationItems.map((item, index) => (
          <ListItem key={index} disablePadding>
            <ListItemButton
              onClick={() => navigate(item.path)}
              sx={{
                minHeight: 48,
                justifyContent: sidebarOpen ? "initial" : "center",
                px: 2.5,
                "&:hover": {
                  bgcolor: "rgba(255, 255, 255, 0.1)",
                },
              }}
            >
              <ListItemIcon
                sx={{
                  minWidth: 0,
                  mr: sidebarOpen ? 3 : "auto",
                  justifyContent: "center",
                  color: "white",
                }}
              >
                {item.icon}
              </ListItemIcon>
              <ListItemText
                primary={item.text}
                sx={{
                  opacity: sidebarOpen ? 1 : 0,
                  transition: "opacity 0.3s",
                }}
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      <Divider sx={{ bgcolor: "rgba(255, 255, 255, 0.2)" }} />
      <Box sx={{ pb: 2, width: "100%" }}>
        <Button
          startIcon={<LogoutIcon />}
          fullWidth
          onClick={handleLogout}
          sx={{
            color: "white",
            justifyContent: sidebarOpen ? "flex-start" : "center",
            px: 2,
            py: 1,
            "&:hover": { bgcolor: "rgba(255, 255, 255, 0.1)" },
          }}
        >
          {sidebarOpen && "Logout"}
        </Button>
      </Box>
    </Box>
  );

  return (
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
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: "block", sm: "none" },
          "& .MuiDrawer-paper": { width: drawerWidth },
        }}
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
  );
};

export default Sidebar;