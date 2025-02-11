import React from "react";
import { Box, Typography, Card, CardContent } from "@mui/material";

const MainContent = ({ sidebarOpen, drawerWidth }) => {
  return (
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
        This is your dashboard where you can manage properties, tenants, and
        more.
      </Typography>
      <Box sx={{ mt: 4, display: "flex", gap: 3, flexWrap: "wrap" }}>
        <Card sx={{ minWidth: 275, bgcolor: "#f5f5f5" }}>
          <CardContent>
            <Typography variant="h5" component="div">
              120
            </Typography>
            <Typography sx={{ color: "#666" }}>Active Tenants</Typography>
          </CardContent>
        </Card>
        <Card sx={{ minWidth: 275, bgcolor: "#f5f5f5" }}>
          <CardContent>
            <Typography variant="h5" component="div">
              56
            </Typography>
            <Typography sx={{ color: "#666" }}>Properties</Typography>
          </CardContent>
        </Card>
        <Card sx={{ minWidth: 275, bgcolor: "#f5f5f5" }}>
          <CardContent>
            <Typography variant="h5" component="div">
              24
            </Typography>
            <Typography sx={{ color: "#666" }}>Active Agents</Typography>
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
};

export default MainContent;