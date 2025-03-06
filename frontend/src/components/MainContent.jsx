import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Alert,
  Skeleton,
  Grid,
  useTheme,
  alpha,
} from "@mui/material";
import {
  People as PeopleIcon,
  HomeWork as PropertyIcon,
  BusinessCenter as AgentIcon,
  Group as StaffIcon,
  Assessment as ReportIcon,
} from "@mui/icons-material";
import { jwtDecode } from "jwt-decode";
import { getAllAgents } from "../api/userApi.js";
import { getAllProperties } from "../api/propertyApi.js";
import { getAllRSLs } from "../api/rslApi.js";
import { getAllStaff } from "../api/staffApi.js";
import { getAllTenants } from "../api/tenantApi.js";

const MainContent = ({ sidebarOpen, drawerWidth }) => {
  const theme = useTheme();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [userName, setUserName] = useState("");
  const [data, setData] = useState({
    tenants: 0,
    properties: 0,
    staff: 0,
    agents: 0,
    rsls: 0,
  });

  const getUserRoleFromToken = () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("No token found");
        return null;
      }
      const decoded = jwtDecode(token);
      setUserName(decoded.name || "");
      return decoded.role || null;
    } catch (error) {
      console.error("Error decoding token:", error);
      return null;
    }
  };

  const processApiResponse = (response, entityName) => {
    if (!response) return [];
    if (response.success && Array.isArray(response.data)) return response.data;
    if (Array.isArray(response)) return response;
    if (response.data) {
      if (Array.isArray(response.data)) return response.data;
      console.warn(`${entityName} data format unexpected:`, response.data);
      return [];
    }
    console.warn(`Unexpected ${entityName} response:`, response);
    return [];
  };

  const fetchAllData = async () => {
    setLoading(true);
    setError(null);

    try {
      const role = getUserRoleFromToken();
      setUserRole(role);
      if (!role) {
        setError("Unable to determine user role. Please login again.");
        setLoading(false);
        return;
      }

      let tenantData = [],
        propertyData = [],
        staffData = [],
        rslData = [],
        agentData = [];

      try {
        const tenantResponse = await getAllTenants();
        tenantData = processApiResponse(tenantResponse, "tenant");
      } catch (e) {
        console.error("Error fetching tenants:", e);
        setError((prev) => prev || "Failed to load tenant data.");
      }

      try {
        const propertyResponse = await getAllProperties();
        propertyData = processApiResponse(propertyResponse, "property");
      } catch (e) {
        console.error("Error fetching properties:", e);
        setError((prev) => prev || "Failed to load property data.");
      }

      if (role <= 2) {
        try {
          const staffResponse = await getAllStaff();
          staffData = processApiResponse(staffResponse, "staff");
        } catch (e) {
          console.error("Error fetching staff:", e);
          setError((prev) => prev || "Failed to load staff data.");
        }
      }

      if (role === 1) {
        try {
          const rslResponse = await getAllRSLs();
          rslData = processApiResponse(rslResponse, "rsl");
        } catch (e) {
          console.error("Error fetching RSLs:", e);
          setError((prev) => prev || "Failed to load RSL data.");
        }
      }

      if (role === 1) {
        try {
          const agentResponse = await getAllAgents();
          agentData = processApiResponse(agentResponse, "agent");
        } catch (e) {
          console.error("Error fetching agents:", e);
          if (staffData.length > 0) {
            agentData = staffData.filter((user) => user.role === 2);
          }
        }
      }

      setData({
        tenants: tenantData.length,
        properties: propertyData.length,
        staff: staffData.length,
        rsls: rslData.length,
        agents: agentData.length,
      });
    } catch (error) {
      console.error("Fatal error:", error);
      setError("Unable to load dashboard data. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  const getRoleBasedContent = () => {
    const cardStyles = (color) => ({
      minWidth: 275,
      background: `linear-gradient(135deg, ${alpha(
        theme.palette[color].main,
        0.1
      )} 0%, ${alpha(theme.palette[color].main, 0.05)} 100%)`,
      border: `1px solid ${alpha(theme.palette[color].main, 0.2)}`,
      boxShadow: theme.shadows[2],
      borderRadius: "16px",
      transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
      "&:hover": {
        transform: "translateY(-5px)",
        boxShadow: theme.shadows[6],
        borderColor: alpha(theme.palette[color].main, 0.4),
      },
    });

    const commonCards = [
      {
        label: "Active Tenants",
        value: data.tenants,
        icon: (
          <PeopleIcon
            fontSize="large"
            sx={{ color: theme.palette.primary.main }}
          />
        ),
        color: "primary",
      },
      {
        label: "Properties",
        value: data.properties,
        icon: (
          <PropertyIcon
            fontSize="large"
            sx={{ color: theme.palette.secondary.main }}
          />
        ),
        color: "secondary",
      },
    ];

    switch (userRole) {
      case 1:
        return {
          title: `Welcome Admin ${userName}`,
          subtitle: "Organization Overview Dashboard",
          cards: [
            ...commonCards,
            {
              label: "Active Managing Agents",
              value: data.agents,
              icon: (
                <AgentIcon
                  fontSize="large"
                  sx={{ color: theme.palette.success.main }}
                />
              ),
              color: "success",
            },
            {
              label: "Active Staff Members",
              value: data.staff,
              icon: (
                <StaffIcon
                  fontSize="large"
                  sx={{ color: theme.palette.warning.main }}
                />
              ),
              color: "warning",
            },
            {
              label: "Registered Social Landlords",
              value: data.rsls,
              icon: (
                <ReportIcon
                  fontSize="large"
                  sx={{ color: theme.palette.info.main }}
                />
              ),
              color: "info",
            },
          ],
          cardStyles,
        };
      case 2:
        return {
          title: `Welcome Managing Agent ${userName}`,
          subtitle: "Property Management Dashboard",
          cards: [
            ...commonCards,
            {
              label: "Active Staff Members",
              value: data.staff,
              icon: (
                <StaffIcon
                  fontSize="large"
                  sx={{ color: theme.palette.warning.main }}
                />
              ),
              color: "warning",
            },
          ],
          cardStyles,
        };
      case 3:
        return {
          title: `Welcome Staff ${userName}`,
          subtitle: "Daily Operations Dashboard",
          cards: [...commonCards],
          cardStyles,
        };
      default:
        return {
          title: `Welcome ${userName || "Guest"}`,
          subtitle: "Please sign in to view your dashboard",
          cards: [],
          cardStyles,
        };
    }
  };

  const { title, subtitle, cards, cardStyles } = getRoleBasedContent();

  return (
    <Box
      component="main"
      sx={{
        flexGrow: 1,
        p: 4,
        mt: 8,
        width: { sm: `calc(100% - ${sidebarOpen ? drawerWidth : 80}px)` },
        transition: "width 0.3s",
        background: "#f8f9fa",
        minHeight: "calc(100vh - 64px)",
      }}
    >
      <Box sx={{ mb: 4, textAlign: "center" }}>
        <Typography
          variant="h4"
          sx={{
            fontFamily: "Inter, sans-serif",
            fontWeight: 600,
            color: theme.palette.text.primary,
            mb: 1,
          }}
        >
          {title}
        </Typography>
        <Typography
          variant="subtitle1"
          sx={{
            color: theme.palette.text.secondary,
            fontSize: "1.1rem",
            fontWeight: 400,
            maxWidth: "600px",
            mx: "auto",
            lineHeight: 1.6,
          }}
        >
          {subtitle}
        </Typography>
      </Box>

      {error && (
        <Alert
          severity="error"
          sx={{
            mb: 4,
            borderRadius: 3,
            border: `1px solid ${theme.palette.error.main}`,
            background: alpha(theme.palette.error.main, 0.1),
            width: "fit-content",
            mx: "auto",
            "& .MuiAlert-icon": {
              color: theme.palette.error.main,
            },
          }}
        >
          {error}
        </Alert>
      )}

     <Grid container spacing={4} sx={{ px: { xs: 0, sm: 4 } }}>
  {cards.map((card, index) => (
    <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
      <Card
        sx={{
          minWidth: 250, // Set a minimum width for the card
          height: "100%", // Ensure all cards have the same height
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: `linear-gradient(135deg, ${alpha(
            theme.palette[card.color].main,
            0.1
          )} 0%, ${alpha(theme.palette[card.color].main, 0.05)} 100%)`,
          border: `1px solid ${alpha(theme.palette[card.color].main, 0.2)}`,
          boxShadow: theme.shadows[2],
          borderRadius: "16px",
          transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
          "&:hover": {
            transform: "translateY(-5px)",
            boxShadow: theme.shadows[6],
            borderColor: alpha(theme.palette[card.color].main, 0.4),
          },
        }}
      >
        <CardContent>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              mb: 2,
              gap: 2,
            }}
          >
            <Box
              sx={{
                p: 2,
                bgcolor: alpha(theme.palette[card.color].main, 0.1),
                borderRadius: "12px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {card.icon}
            </Box>
            {loading ? (
              <Box sx={{ flexGrow: 1 }}>
                <Skeleton
                  variant="rounded"
                  width="100%"
                  height={40}
                  sx={{ borderRadius: 2 }}
                />
                <Skeleton
                  variant="text"
                  width="60%"
                  sx={{ fontSize: "1rem", mt: 1 }}
                />
              </Box>
            ) : (
              <Box>
                <Typography
                  variant="h3"
                  component="div"
                  sx={{
                    fontWeight: 700,
                    color: theme.palette[card.color].dark,
                    fontSize: { xs: "1.5rem", sm: "2rem" },
                  }}
                >
                  {card.value}
                </Typography>
              </Box>
            )}
          </Box>
          <Typography
            variant="h6"
            sx={{
              color: theme.palette.text.secondary,
              fontWeight: 500,
              pl: 1,
              fontSize: { xs: "1rem", sm: "1.1rem" },
            }}
          >
            {card.label}
          </Typography>
        </CardContent>
      </Card>
    </Grid>
  ))}
</Grid>
    </Box>
  );
};

export default MainContent;