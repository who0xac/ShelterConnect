import React, { useEffect, useState, useRef } from "react";
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
  Tab,
  Tabs,
  Button,
  Tooltip,
} from "@mui/material";
import {
  People as PeopleIcon,
  HomeWork as PropertyIcon,
  BusinessCenter as AgentIcon,
  Group as StaffIcon,
  Assessment as ReportIcon,
  PieChart as ChartIcon,
  DownloadSharp as DownloadIcon,
} from "@mui/icons-material";
import { jwtDecode } from "jwt-decode";
import { getAllAgents } from "../api/userApi.js";
import { getAllProperties } from "../api/propertyApi.js";
import { getAllRSLs } from "../api/rslApi.js";
import { getAllStaff } from "../api/staffApi.js";
import { getAllTenants } from "../api/tenantApi.js";
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

const MainContent = ({ sidebarOpen, drawerWidth }) => {
  const theme = useTheme();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [activeTab, setActiveTab] = useState(0);
  const [data, setData] = useState({
    tenants: 0,
    properties: 0,
    nonActiveTenants: 0,
    staff: 0,
    agents: 0,
    rsls: 0,
  });
  const [visualizationData, setVisualizationData] = useState({
    propertyTypes: [],
    cityDistribution: [],
    sharedStatus: [],
    ethnicOrigin: [],
    criminalRecord: [],
    criminalRecordTypes: [],
    drugUse: [],
    furnishingStatus: [],
    financialMetrics: [],
  });
  const COLORS = [
    "#3f51b5",
    "#00acc1",
    "#ff9800",
    "#f44336",
    "#4caf50",
    "#9c27b0",
  ];
  const analyticsRef = useRef();

  // -------------------------------------------------------------------
  // Enhanced PDF Generation: Improved header/footer styling & meta info
  // -------------------------------------------------------------------
  const handleDownloadPDF = async () => {
    try {
      const element = analyticsRef.current;
      const canvas = await html2canvas(element, { scale: 3 });
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      const pageWidth = pdf.internal.pageSize.getWidth();

      // Header (username removed)
      pdf.setFont("helvetica", "bold");
      pdf.setFontSize(18);
      pdf.text("Detailed Analytics Report", pageWidth / 2, 15, {
        align: "center",
      });
      pdf.setLineWidth(0.5);
      pdf.line(10, 20, pageWidth - 10, 20);
      pdf.setFontSize(12);
      pdf.setFont("helvetica", "normal");
      pdf.text("Report generated", 10, 28);

      // Add image (with margins)
      const margin = 10;
      const imgWidth = pageWidth - margin * 2;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      pdf.addImage(imgData, "PNG", margin, 35, imgWidth, imgHeight);

      // Footer: Add page number at the bottom center
      pdf.setFontSize(10);
      pdf.text(
        "Page 1",
        pageWidth / 2,
        pdf.internal.pageSize.getHeight() - 10,
        { align: "center" }
      );

      pdf.save("detailed_analytics_report.pdf");
    } catch (error) {
      console.error("Error generating PDF:", error);
    }
  };

  // ----------------------------------------------------
  // Data fetching and processing functions (unchanged)
  // ----------------------------------------------------
  // Updated function: Remove any username handling from the token
  const getUserRoleFromToken = () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("No token found");
        return null;
      }
      const decoded = jwtDecode(token);
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

  const processVisualizationData = (propertyData, tenantData) => {
    const propertyTypes = [
      {
        name: "Shared Accommodations",
        value: propertyData.filter((p) => p.sharedWithOther).length,
      },
      { name: "Bedsits", value: propertyData.filter((p) => p.bedsit).length },
      {
        name: "Self-Contained Flats",
        value: propertyData.filter((p) => p.selfContainedFlat).length,
      },
    ];
    const cityDistribution = Object.entries(
      propertyData.reduce((acc, p) => {
        const city = p.city || "Unknown";
        acc[city] = (acc[city] || 0) + 1;
        return acc;
      }, {})
    ).map(([city, count]) => ({ city, count }));
    const sharedStatus = [
      {
        name: "Shared Properties",
        value: propertyData.filter((p) => p.sharedWithOther).length,
      },
      {
        name: "Non-Shared Properties",
        value:
          propertyData.length -
          propertyData.filter((p) => p.sharedWithOther).length,
      },
    ];
    const furnishingStatus = [
      {
        name: "Unfurnished",
        value: propertyData.filter((p) => p.unfurnished).length,
      },
      {
        name: "Part-Furnished",
        value: propertyData.filter((p) => p.partFurnished).length,
      },
      {
        name: "Fully Furnished",
        value: propertyData.filter((p) => p.fullyFurnished).length,
      },
    ];
    const financialMetrics = Object.entries(
      propertyData.reduce((acc, p) => {
        const city = p.city || "Unknown";
        if (!acc[city]) {
          acc[city] = {
            basicRent: 0,
            serviceCharges: 0,
            eligibleRent: 0,
            count: 0,
          };
        }
        acc[city].basicRent += p.basicRent;
        acc[city].serviceCharges += p.totalServiceCharges;
        acc[city].eligibleRent += p.totalEligibleRent;
        acc[city].count++;
        return acc;
      }, {})
    ).map(([city, data]) => ({
      city,
      basicRent: data.basicRent / data.count,
      serviceCharges: data.serviceCharges / data.count,
      eligibleRent: data.eligibleRent / data.count,
    }));
    const ethnicOrigin = Object.entries(
      tenantData.reduce((acc, t) => {
        const origin = t.ethnicOrigin || "Unknown";
        acc[origin] = (acc[origin] || 0) + 1;
        return acc;
      }, {})
    ).map(([ethnicity, count]) => ({ ethnicity, count }));
    const criminalRecord = [
      {
        name: "Has Criminal Record",
        value: tenantData.filter((t) => t.criminalRecords).length,
      },
      {
        name: "No Criminal Record",
        value:
          tenantData.length -
          tenantData.filter((t) => t.criminalRecords).length,
      },
    ];
    const criminalRecordTypes = Object.entries(
      tenantData
        .filter((t) => t.criminalRecords)
        .reduce((acc, t) => {
          const type = t.offenceDetails?.nature || "Other";
          acc[type] = (acc[type] || 0) + 1;
          return acc;
        }, {})
    ).map(([type, count]) => ({ type, count }));
    const drugUse = [
      {
        name: "Drug Use History",
        value: tenantData.filter((t) => t.drugUse).length,
      },
      {
        name: "No Drug Use History",
        value: tenantData.length - tenantData.filter((t) => t.drugUse).length,
      },
    ];
    return {
      propertyTypes,
      cityDistribution,
      sharedStatus,
      ethnicOrigin,
      criminalRecord,
      criminalRecordTypes,
      drugUse,
      furnishingStatus,
      financialMetrics,
    };
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
      const visualizationResults = processVisualizationData(
        propertyData,
        tenantData
      );
      setVisualizationData(visualizationResults);
    } catch (error) {
      console.error("Fatal error:", error);
      setError("Unable to load dashboard data. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ------------------------------------------------------------------
  // Role based content for dashboard header and cards with enhanced styles
  // ------------------------------------------------------------------
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
      transition: "transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
      "&:hover": {
        transform: "translateY(-5px)",
        boxShadow: theme.shadows[6],
        borderColor: alpha(theme.palette[color].main, 0.4),
      },
    });
    const commonCards = [
      {
        label: "Tenants",
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
          title: "Welcome Admin",
          subtitle: "Organization Overview Dashboard",
          cards: [
            ...commonCards,
            {
              label: "Managing Agents",
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
              label: "Staff Members",
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
          title: "Welcome Managing Agent",
          subtitle: "Property Management Dashboard",
          cards: [
            ...commonCards,
            {
              label: "Staff Members",
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
          title: "Welcome Staff",
          subtitle: "Daily Operations Dashboard",
          cards: [...commonCards],
          cardStyles,
        };
      default:
        return {
          title: "Welcome Guest",
          subtitle: "Please sign in to view your dashboard",
          cards: [],
          cardStyles,
        };
    }
  };

  const { title, subtitle, cards } = getRoleBasedContent();

  // ------------------------------------------------------------------
  // Render visualization cards using the processed data with enhanced styling
  // ------------------------------------------------------------------
  const renderVisualizationCards = () => {
    const visualizationCardStyle = {
      minHeight: 320,
      boxShadow: theme.shadows[3],
      borderRadius: "16px",
      p: 2,
      mb: 3,
      background: theme.palette.background.paper,
      border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
      transition: "transform 0.3s, box-shadow 0.3s",
      "&:hover": {
        transform: "translateY(-5px)",
        boxShadow: theme.shadows[6],
      },
    };

    return [
      // 1. Property Type Distribution
      <Grid item xs={12} md={6} key="property-type">
        <Card sx={visualizationCardStyle}>
          <Typography
            variant="h6"
            sx={{ mb: 2, fontWeight: 600, color: theme.palette.primary.main }}
          >
            Property Type Distribution
          </Typography>
          <Typography
            variant="body2"
            sx={{ mb: 2, color: theme.palette.text.secondary }}
          >
            Breakdown of property types for clarity
          </Typography>
          <Box sx={{ height: 220 }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={visualizationData.propertyTypes}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  dataKey="value"
                  labelLine={false}
                  label={({ name, percent }) =>
                    `${name} ${(percent * 100).toFixed(0)}%`
                  }
                >
                  {visualizationData.propertyTypes.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <RechartsTooltip />
              </PieChart>
            </ResponsiveContainer>
          </Box>
        </Card>
      </Grid>,
      // 2. Geographical Distribution
      <Grid item xs={12} md={6} key="geo-distribution">
        <Card sx={visualizationCardStyle}>
          <Typography
            variant="h6"
            sx={{ mb: 2, fontWeight: 600, color: theme.palette.primary.main }}
          >
            Geographical Distribution by City
          </Typography>
          <Typography
            variant="body2"
            sx={{ mb: 2, color: theme.palette.text.secondary }}
          >
            Properties concentration by city
          </Typography>
          <Box sx={{ height: 220 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={visualizationData.cityDistribution}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="city" />
                <YAxis />
                <RechartsTooltip />
                <Bar
                  dataKey="count"
                  fill={theme.palette.primary.main}
                  name="Properties"
                />
              </BarChart>
            </ResponsiveContainer>
          </Box>
        </Card>
      </Grid>,
      // 3. Shared vs Non-Shared Properties
      <Grid item xs={12} md={6} key="shared-status">
        <Card sx={visualizationCardStyle}>
          <Typography
            variant="h6"
            sx={{ mb: 2, fontWeight: 600, color: theme.palette.primary.main }}
          >
            Shared vs Non-Shared
          </Typography>
          <Typography
            variant="body2"
            sx={{ mb: 2, color: theme.palette.text.secondary }}
          >
            Proportion of shared living spaces
          </Typography>
          <Box sx={{ height: 220 }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={visualizationData.sharedStatus}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  dataKey="value"
                  labelLine={false}
                  label={({ name, percent }) =>
                    `${name} ${(percent * 100).toFixed(0)}%`
                  }
                >
                  {visualizationData.sharedStatus.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <RechartsTooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </Box>
        </Card>
      </Grid>,
      // 4. Tenant Demographics: Ethnic Origin
      <Grid item xs={12} md={6} key="ethnic-origin">
        <Card sx={visualizationCardStyle}>
          <Typography
            variant="h6"
            sx={{ mb: 2, fontWeight: 600, color: theme.palette.primary.main }}
          >
            Tenant Demographics: Ethnic Origin
          </Typography>
          <Typography
            variant="body2"
            sx={{ mb: 2, color: theme.palette.text.secondary }}
          >
            Tenant diversity insights
          </Typography>
          <Box sx={{ height: 220 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={visualizationData.ethnicOrigin}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="ethnicity" />
                <YAxis />
                <RechartsTooltip />
                <Bar
                  dataKey="count"
                  fill={theme.palette.info.main}
                  name="Tenants"
                />
              </BarChart>
            </ResponsiveContainer>
          </Box>
        </Card>
      </Grid>,
      // 5. Criminal Records
      <Grid item xs={12} md={6} key="criminal-records">
        <Card sx={visualizationCardStyle}>
          <Typography
            variant="h6"
            sx={{ mb: 2, fontWeight: 600, color: theme.palette.primary.main }}
          >
            Criminal Records
          </Typography>
          <Typography
            variant="body2"
            sx={{ mb: 2, color: theme.palette.text.secondary }}
          >
            Tenants with criminal records
          </Typography>
          <Box sx={{ height: 220 }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={visualizationData.criminalRecord}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  dataKey="value"
                  labelLine={false}
                  label={({ name, percent }) =>
                    `${name} ${(percent * 100).toFixed(0)}%`
                  }
                >
                  {visualizationData.criminalRecord.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={
                        index === 0
                          ? theme.palette.error.main
                          : theme.palette.success.main
                      }
                    />
                  ))}
                </Pie>
                <RechartsTooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </Box>
        </Card>
      </Grid>,
      // 6. Drug Use
      <Grid item xs={12} md={6} key="drug-use">
        <Card sx={visualizationCardStyle}>
          <Typography
            variant="h6"
            sx={{ mb: 2, fontWeight: 600, color: theme.palette.primary.main }}
          >
            Drug Use History
          </Typography>
          <Typography
            variant="body2"
            sx={{ mb: 2, color: theme.palette.text.secondary }}
          >
            Support services overview
          </Typography>
          <Box sx={{ height: 220 }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={visualizationData.drugUse}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  dataKey="value"
                  labelLine={false}
                  label={({ name, percent }) =>
                    `${name} ${(percent * 100).toFixed(0)}%`
                  }
                >
                  {visualizationData.drugUse.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={
                        index === 0
                          ? theme.palette.warning.main
                          : theme.palette.success.light
                      }
                    />
                  ))}
                </Pie>
                <RechartsTooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </Box>
        </Card>
      </Grid>,
      // 7. Furnishing Status
      <Grid item xs={12} md={6} key="furnishing-status">
        <Card sx={visualizationCardStyle}>
          <Typography
            variant="h6"
            sx={{ mb: 2, fontWeight: 600, color: theme.palette.primary.main }}
          >
            Furnishing Status
          </Typography>
          <Typography
            variant="body2"
            sx={{ mb: 2, color: theme.palette.text.secondary }}
          >
            Furnishings distribution across properties
          </Typography>
          <Box sx={{ height: 220 }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={visualizationData.furnishingStatus}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  dataKey="value"
                  labelLine={false}
                  label={({ name, percent }) =>
                    `${name} ${(percent * 100).toFixed(0)}%`
                  }
                >
                  {visualizationData.furnishingStatus.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <RechartsTooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </Box>
        </Card>
      </Grid>,
      // 8. Financial Metrics Comparison
      <Grid item xs={12} md={6} key="financial-metrics">
        <Card sx={visualizationCardStyle}>
          <Typography
            variant="h6"
            sx={{ mb: 2, fontWeight: 600, color: theme.palette.primary.main }}
          >
            Financial Metrics Comparison
          </Typography>
          <Typography
            variant="body2"
            sx={{ mb: 2, color: theme.palette.text.secondary }}
          >
            Basic Rent, Service Charges & Eligible Rent
          </Typography>
          <Box sx={{ height: 220 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={visualizationData.financialMetrics}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="city" />
                <YAxis />
                <RechartsTooltip />
                <Legend />
                <Bar
                  dataKey="basicRent"
                  fill={theme.palette.primary.main}
                  name="Basic Rent"
                />
                <Bar
                  dataKey="serviceCharges"
                  fill={theme.palette.secondary.main}
                  name="Service Charges"
                />
                <Bar
                  dataKey="eligibleRent"
                  fill={theme.palette.success.main}
                  name="Eligible Rent"
                />
              </BarChart>
            </ResponsiveContainer>
          </Box>
        </Card>
      </Grid>,
    ];
  };

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  // ------------------------------------------------------------------
  // Render Component with Enhanced Layout & Styling
  // ------------------------------------------------------------------
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
            "& .MuiAlert-icon": { color: theme.palette.error.main },
          }}
        >
          {error}
        </Alert>
      )}
      <Tabs
        value={activeTab}
        onChange={handleTabChange}
        centered
        sx={{
          mb: 4,
          borderBottom: 1,
          borderColor: "divider",
          "& .MuiTabs-indicator": {
            backgroundColor: theme.palette.primary.main,
            height: 3,
          },
          "& .MuiTab-root": {
            textTransform: "none",
            fontWeight: 500,
            fontSize: "1rem",
            color: theme.palette.text.secondary,
            "&.Mui-selected": {
              color: theme.palette.primary.main,
              fontWeight: 600,
            },
          },
        }}
      >
        <Tab label="Overview" />
        <Tab label="Detailed Analytics" />
      </Tabs>
      {activeTab === 0 && (
        <Grid container spacing={4} sx={{ px: { xs: 0, sm: 4 } }}>
          {cards.map((card, index) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
              <Card
                sx={{
                  minWidth: 250,
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  background: `linear-gradient(135deg, ${alpha(
                    theme.palette[card.color].main,
                    0.1
                  )} 0%, ${alpha(theme.palette[card.color].main, 0.05)} 100%)`,
                  border: `1px solid ${alpha(
                    theme.palette[card.color].main,
                    0.2
                  )}`,
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
      )}
      {activeTab === 1 && (
        <Box>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 3,
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <ChartIcon color="primary" />
              <Typography
                variant="h5"
                sx={{ fontWeight: 600, color: theme.palette.text.primary }}
              >
                Detailed Analytics
              </Typography>
            </Box>
            <Tooltip title="Download Detailed Analytics Report as PDF" arrow>
              <Button
                variant="contained"
                startIcon={<DownloadIcon />}
                onClick={handleDownloadPDF}
                sx={{ textTransform: "none" }}
              >
                Download PDF
              </Button>
            </Tooltip>
          </Box>
          <Box ref={analyticsRef}>
            <Grid container spacing={3}>
              {renderVisualizationCards()}
            </Grid>
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default MainContent;
