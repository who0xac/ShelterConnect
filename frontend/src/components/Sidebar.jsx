import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
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
  Tooltip,
  ThemeProvider,
  createTheme,
} from "@mui/material";
import { useAuth } from "../context/AuthContext.jsx"; 
import roles from "../context/role.js"; 

import {
  Menu as MenuIcon,
  Dashboard as DashboardIcon,
  FamilyRestroom as FamilyRestroomIcon,
  Apartment as ApartmentIcon,
  Badge as BadgeIcon,
  GroupWork as GroupWorkIcon,
  Settings as SettingsIcon,
  SupervisorAccount as SupervisorAccountIcon,
  Logout as LogoutIcon,
  MenuOpen as MenuOpenIcon,
  ArrowRight as ArrowRightIcon,
} from "@mui/icons-material";

// Custom theme for sidebar
const sidebarTheme = createTheme({
  palette: {
    primary: {
      main: "#1a237e",
      contrastText: "#ffffff",
    },
    secondary: {
      main: "#3f51b5",
    },
  },
  components: {
    MuiListItemButton: {
      styleOverrides: {
        root: {
          "&.Mui-selected": {
            backgroundColor: "rgba(255, 255, 255, 0.15)",
            borderLeft: "4px solid #4caf50",
          },
          "&.Mui-selected:hover": {
            backgroundColor: "rgba(255, 255, 255, 0.2)",
          },
        },
      },
    },
  },
});

const navigationItems = [
  { text: "Dashboard", icon: <DashboardIcon />, path: "/dashboard", key: 1 },
  { text: "Tenants", icon: <FamilyRestroomIcon />, path: "/tenants", key: 2 },
  { text: "Properties", icon: <ApartmentIcon />, path: "/properties", key: 3 },
  { text: "Agents", icon: <BadgeIcon />, path: "/agents", key: 4 },
  {
    text: "Registered RSL",
    icon: <GroupWorkIcon />,
    path: "/registered-rsl",
    key: 5,
  },
  { text: "Staff", icon: <SupervisorAccountIcon />, path: "/staff", key: 6 },
  // { text: "Settings", icon: <SettingsIcon />, path: "/settings" },
];

const Sidebar = ({
  sidebarOpen,
  drawerWidth,
  mobileOpen,
  handleDrawerToggle,
  handleSidebarToggle,
  handleLogout,
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const currentPath = location.pathname;
  const { user } = useAuth();

  // Get allowed pages for the user's role
  const allowedPages = roles[user?.role] || [];

  const drawer = (
    <ThemeProvider theme={sidebarTheme}>
      <Box
        sx={{
          width: sidebarOpen ? drawerWidth : 80,
          bgcolor: "primary.main",
          background: `
            linear-gradient(195deg,
              rgba(26, 35, 126, 1) 0%,
              rgba(48, 63, 159, 1) 100%)
          `,
          color: "primary.contrastText",
          height: "100vh",
          transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
          overflowX: "hidden",
          display: "flex",
          flexDirection: "column",
          boxShadow: sidebarOpen ? 3 : 0,
        }}
      >
        {/* Header Section */}
        <Toolbar
          sx={{
            display: "flex",
            justifyContent: "space-between",
            px: 2,
            minHeight: "64px !important",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Typography
              variant="h6"
              sx={{
                fontFamily: "'Poppins', sans-serif",
                fontWeight: 700,
                fontSize: sidebarOpen ? "1.25rem" : 0,
                transition: "font-size 0.3s, opacity 0.3s",
                whiteSpace: "nowrap",
              }}
            >
              ShelterConnect
            </Typography>
          </Box>
          <IconButton
            onClick={handleSidebarToggle}
            sx={{
              color: "inherit",
              transform: sidebarOpen ? "rotate(0deg)" : "rotate(180deg)",
              transition: "transform 0.3s",
            }}
          >
            {sidebarOpen ? <MenuOpenIcon /> : <ArrowRightIcon />}
          </IconButton>
        </Toolbar>
        <Divider sx={{ bgcolor: "rgba(255, 255, 255, 0.2)", mb: 1 }} />
        {/* Navigation Items */}
        <List sx={{ flexGrow: 1, px: 1 }}>
          {navigationItems.map((item) => {
            // Check if current role has access to this navigation item
            const isAllowed = allowedPages.includes(item.key);

            // Return null for unauthorized items (won't render anything)
            if (!isAllowed) return null;

            return (
              <Tooltip
                key={item.text}
                title={!sidebarOpen ? item.text : ""}
                placement="right"
              >
                <ListItem disablePadding>
                  <ListItemButton
                    selected={currentPath === item.path}
                    onClick={() => navigate(item.path)}
                    sx={{
                      minHeight: 48,
                      justifyContent: sidebarOpen ? "initial" : "center",
                      px: 2.5,
                      borderRadius: "8px",
                      my: 0.5,
                      transition: "all 0.2s ease",
                      "&:hover": {
                        bgcolor: "rgba(255, 255, 255, 0.1)",
                        transform: "translateX(4px)",
                      },
                    }}
                  >
                    <ListItemIcon
                      sx={{
                        minWidth: 0,
                        mr: sidebarOpen ? 2 : "auto",
                        justifyContent: "center",
                        color:
                          currentPath === item.path ? "#4caf50" : "inherit",
                      }}
                    >
                      {item.icon}
                    </ListItemIcon>
                    <ListItemText
                      primary={item.text}
                      sx={{
                        opacity: sidebarOpen ? 1 : 0,
                        transition: "opacity 0.2s",
                        "& span": {
                          fontWeight: currentPath === item.path ? 600 : 400,
                        },
                      }}
                    />
                  </ListItemButton>
                </ListItem>
              </Tooltip>
            );
          })}
        </List>
        {/* Footer Section */}
        <Divider sx={{ bgcolor: "rgba(255, 255, 255, 0.2)", mt: "auto" }} />
        <Box sx={{ p: 2 }}>
          <Button
            fullWidth
            onClick={handleLogout}
            startIcon={<LogoutIcon />}
            sx={{
              color: "inherit",
              justifyContent: sidebarOpen ? "flex-start" : "center",
              px: 2,
              py: 1.5,
              borderRadius: "8px",
              "&:hover": {
                bgcolor: "rgba(255, 255, 255, 0.1)",
                color: "#ef5350",
              },
            }}
          >
            {sidebarOpen && (
              <Typography variant="body2" sx={{ fontWeight: 500, ml: 1 }}>
                Logout
              </Typography>
            )}
          </Button>
        </Box>
      </Box>
    </ThemeProvider>
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
      {/* Mobile Drawer */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: "block", sm: "none" },
          "& .MuiDrawer-paper": {
            width: drawerWidth,
            bgcolor: "primary.main",
          },
        }}
      >
        {drawer}
      </Drawer>

      {/* Desktop Drawer */}
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: "none", sm: "block" },
          "& .MuiDrawer-paper": {
            width: sidebarOpen ? drawerWidth : 80,
            transition: "width 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
            overflowX: "hidden",
            bgcolor: "primary.main",
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
