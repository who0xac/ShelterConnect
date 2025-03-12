import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  CssBaseline,
  Chip,
  Tooltip,
  Card,
  CardContent,
  Switch,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Grid,
  Button,
} from "@mui/material";
import CircularProgress from "@mui/material/CircularProgress";
import SkipPreviousIcon from "@mui/icons-material/SkipPrevious";
import SkipNextIcon from "@mui/icons-material/SkipNext";
import EditIcon from "@mui/icons-material/Edit";
import SearchIcon from "@mui/icons-material/Search";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import CloseIcon from "@mui/icons-material/Close";
import PeopleIcon from "@mui/icons-material/People";
import HomeIcon from "@mui/icons-material/Home";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import AgentForm from "../components/AgentForm";
import { getCurrentUser } from "../api/userApi";
import { getAllAgents, updateUserById } from "../api/userApi.js";
import { jwtDecode } from "jwt-decode";

const drawerWidth = 240;

const Agents = () => {
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [userName, setUserName] = useState("");
  const [agentsData, setAgentsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openAgentForm, setOpenAgentForm] = useState(false);
  const [selectedAgent, setSelectedAgent] = useState({ _id: null });
  const [editMode, setEditMode] = useState(false);
  const [expandedAgent, setExpandedAgent] = useState(null);
  const [userId, setUserId] = useState(null);

  // Table control states
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [sortConfig, setSortConfig] = useState({ key: "", direction: "asc" });

  useEffect(() => {
    fetchAgentsData();
  }, []);
  useEffect(() => {
    const fetchUserId = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          console.error("No token found");
          navigate("/");
          return;
        }
        const decoded = jwtDecode(token);
        const id = decoded.id; // Extract userId from the decoded token
        setUserId(id); // Set userId in state
      } catch (error) {
        console.error("Error fetching user ID:", error);
        toast.error("Failed to fetch user ID");
      }
    };

    fetchUserId();
  }, [navigate]);

  useEffect(() => {
    getCurrentUser(navigate, setUserName);
  }, [navigate]);

  const fetchAgentsData = useCallback(async () => {
    setLoading(true);
    try {
      const result = await getAllAgents();
      if (result.success && Array.isArray(result.data)) {
        setAgentsData(result.data);
        setError(null);
      } else {
        setAgentsData([]);
        setError("Invalid data structure received");
      }
    } catch (error) {
      console.error("Error fetching agent data:", error);
      setError("Failed to fetch agent data");
      setAgentsData([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  const sortData = (data) => {
    if (!sortConfig.key) return data;
    return [...data].sort((a, b) => {
      const aValue = a[sortConfig.key];
      const bValue = b[sortConfig.key];
      if (aValue < bValue) return sortConfig.direction === "asc" ? -1 : 1;
      if (aValue > bValue) return sortConfig.direction === "asc" ? 1 : -1;
      return 0;
    });
  };

  const filteredData = useMemo(() => {
    return agentsData.filter((row) =>
      Object.values(row).some((value) =>
        String(value).toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }, [agentsData, searchTerm]);

  const sortedData = useMemo(
    () => sortData(filteredData),
    [filteredData, sortConfig]
  );
  const totalPages = Math.ceil(sortedData.length / rowsPerPage);
  const currentData = sortedData.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  const handleDrawerToggle = () => setMobileOpen(!mobileOpen);
  const handleSidebarToggle = () => setSidebarOpen(!sidebarOpen);

  const handleLogout = () => {
    try {
      localStorage.removeItem("token");
      navigate("/");
    } catch (error) {
      console.error("Error during logout:", error);
      toast.error("Error during logout. Please try again.");
    }
  };
  const handleEditClick = (agent) => {
    if (!agent || !agent._id) {
      toast.error("Invalid agent data");
      return;
    }
    setSelectedAgent(agent);
    setEditMode(true);
    setOpenAgentForm(true);
  };

    const handleCloseAgentForm = () => {
    setOpenAgentForm(false);
    setEditMode(false);
    setSelectedAgent({ _id: null });
  };

  const handleFormSuccess = () => {
    fetchAgentsData();
    setOpenAgentForm(false);
    setEditMode(false);
    setSelectedAgent(null);
  };

  const handleAccordionExpand = (agentId) => {
    if (expandedAgent === agentId) {
      setExpandedAgent(null);
    } else {
      setExpandedAgent(agentId);
    }
  };

  return (
    <Box
      sx={{ display: "flex", backgroundColor: "#f4f6f9", minHeight: "100vh" }}
    >
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

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { sm: `calc(100% - ${sidebarOpen ? drawerWidth : 80}px)` },
          transition: "width 0.3s",
          mt: 8,
        }}
      >
        {/* Header Card */}
        <Card
          elevation={3}
          sx={{
            mb: 4,
            borderRadius: "16px",
            background: "linear-gradient(135deg, #1a237e 0%, #3f51b5 100%)",
            boxShadow: "0 8px 16px rgba(26, 35, 126, 0.2)",
            overflow: "hidden",
          }}
        >
          <CardContent
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              p: 4,
            }}
          >
            <Box>
              <Typography
                variant="h4"
                sx={{
                  fontFamily: "Poppins, sans-serif",
                  fontWeight: 700,
                  color: "white",
                  letterSpacing: "0.5px",
                  mb: 1,
                }}
              >
                Agent Management
              </Typography>
            </Box>
          </CardContent>
        </Card>

        {/* Search and Rows per page */}
        <Card
          elevation={2}
          sx={{
            mb: 3,
            borderRadius: "16px",
            overflow: "hidden",
          }}
        >
          <CardContent
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              p: 2,
              "&:last-child": { pb: 2 },
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <TextField
                placeholder="Search Agents..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
                size="small"
                InputProps={{
                  startAdornment: (
                    <SearchIcon sx={{ color: "text.secondary", mr: 1 }} />
                  ),
                  sx: {
                    borderRadius: "12px",
                    fontFamily: "Poppins, sans-serif",
                  },
                }}
                sx={{
                  width: "300px",
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "12px",
                    backgroundColor: "#f1f3f4",
                    transition: "all 0.3s ease",
                    "&:hover": {
                      backgroundColor: "#e8eaed",
                    },
                    "&.Mui-focused": {
                      backgroundColor: "white",
                      boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
                    },
                  },
                }}
              />
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ fontFamily: "Poppins, sans-serif" }}
                >
                  Rows per page:
                </Typography>
                <select
                  value={rowsPerPage}
                  onChange={(e) => {
                    setRowsPerPage(Number(e.target.value));
                    setCurrentPage(1);
                  }}
                  style={{
                    padding: "8px 12px",
                    borderRadius: "10px",
                    border: "1px solid #e0e0e0",
                    cursor: "pointer",
                    backgroundColor: "#f1f3f4",
                    fontFamily: "Poppins, sans-serif",
                    fontSize: "14px",
                  }}
                >
                  {[5, 10, 25, 50].map((size) => (
                    <option key={size} value={size}>
                      {size}
                    </option>
                  ))}
                </select>
              </Box>
            </Box>
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ fontFamily: "Poppins, sans-serif" }}
            >
              Showing{" "}
              {Math.min(
                (currentPage - 1) * rowsPerPage + 1,
                filteredData.length
              )}{" "}
              to {Math.min(currentPage * rowsPerPage, filteredData.length)} of{" "}
              {filteredData.length} entries
            </Typography>
          </CardContent>
        </Card>

        {/* Table */}
        <Card
          elevation={3}
          sx={{
            borderRadius: "16px",
            overflow: "hidden",
            backgroundColor: "white",
            boxShadow: "0 6px 18px rgba(0,0,0,0.1)",
            transition: "box-shadow 0.3s ease",
            "&:hover": {
              boxShadow: "0 8px 24px rgba(0,0,0,0.15)",
            },
          }}
        >
          <TableContainer>
            <Table sx={{ minWidth: 650 }}>
              <TableHead>
                <TableRow sx={{ bgcolor: "#f5f7fa" }}>
                  {[
                    { key: "firstName", label: "First Name" },
                    { key: "lastName", label: "Last Name" },
                    { key: "email", label: "Email" },
                    { key: "properties", label: "Properties" },
                    { key: "staff", label: "Staff" },
                    { key: "tenants", label: "Tenants" },
                    { key: "createdAt", label: "Created At" },
                    { key: "actions", label: "Actions" },
                  ].map((column) => (
                    <TableCell
                      key={column.key}
                      onClick={() =>
                        column.key !== "actions" && handleSort(column.key)
                      }
                      sx={{
                        fontFamily: "Poppins, sans-serif",
                        fontWeight: 600,
                        color: "#37474f",
                        fontSize: "0.875rem",
                        py: 2.5,
                        cursor:
                          column.key !== "actions" ? "pointer" : "default",
                        "&:hover":
                          column.key !== "actions"
                            ? { bgcolor: "rgba(0, 0, 0, 0.04)" }
                            : {},
                        transition: "background-color 0.2s ease",
                        borderBottom: "2px solid #e0e0e0",
                      }}
                    >
                      <Box sx={{ display: "flex", alignItems: "center" }}>
                        {column.label}
                        {sortConfig.key === column.key && (
                          <Typography
                            component="span"
                            sx={{ ml: 1, fontSize: "0.75rem" }}
                          >
                            {sortConfig.direction === "asc" ? "↑" : "↓"}
                          </Typography>
                        )}
                      </Box>
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={8} align="center" sx={{ py: 6 }}>
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                          flexDirection: "column",
                          gap: 2,
                        }}
                      >
                        <div
                          className="loading-spinner"
                          style={{
                            width: "40px",
                            height: "40px",
                            border: "4px solid rgba(63, 81, 181, 0.2)",
                            borderRadius: "50%",
                            borderTop: "4px solid #3f51b5",
                            animation: "spin 1s linear infinite",
                          }}
                        ></div>
                        <Typography
                          color="primary"
                          sx={{ fontFamily: "Poppins, sans-serif" }}
                        >
                          Loading agents data...
                        </Typography>
                        <style>{`
                          @keyframes spin {
                            0% { transform: rotate(0deg); }
                            100% { transform: rotate(360deg); }
                          }
                        `}</style>
                      </Box>
                    </TableCell>
                  </TableRow>
                ) : error ? (
                  <TableRow>
                    <TableCell
                      colSpan={8}
                      align="center"
                      sx={{
                        py: 4,
                        color: "error.main",
                        fontFamily: "Poppins, sans-serif",
                      }}
                    >
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          gap: 1,
                        }}
                      >
                        <CloseIcon color="error" />
                        {error}
                      </Box>
                    </TableCell>
                  </TableRow>
                ) : currentData.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} align="center" sx={{ py: 6 }}>
                      <Box
                        sx={{
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                          gap: 2,
                        }}
                      >
                        <PeopleIcon sx={{ fontSize: 48, color: "#bdbdbd" }} />
                        <Typography
                          color="text.secondary"
                          sx={{ fontFamily: "Poppins, sans-serif" }}
                        >
                          No agent data available
                        </Typography>
                      </Box>
                    </TableCell>
                  </TableRow>
                ) : (
                  currentData.map((row) => (
                    <React.Fragment key={row._id}>
                      <TableRow
                        sx={{
                          "&:hover": { bgcolor: "#f9fafc" },
                          transition: "background-color 0.2s ease",
                          borderLeft: "4px solid transparent",
                          ":hover": {
                            borderLeft: "4px solid #3f51b5",
                            bgcolor: "#f5f7fa",
                          },
                        }}
                      >
                        <TableCell
                          sx={{ py: 2.5, fontFamily: "Poppins, sans-serif" }}
                        >
                          {row.firstName}
                        </TableCell>
                        <TableCell
                          sx={{ py: 2.5, fontFamily: "Poppins, sans-serif" }}
                        >
                          {row.lastName}
                        </TableCell>
                        <TableCell
                          sx={{
                            py: 2.5,
                            fontFamily: "Poppins, sans-serif",
                            color: "#1976d2",
                          }}
                        >
                          {row.email}
                        </TableCell>
                        <TableCell
                          sx={{ py: 2.5, fontFamily: "Poppins, sans-serif" }}
                        >
                          <Chip
                            label={row.properties?.length || 0}
                            size="small"
                            color="primary"
                            sx={{
                              borderRadius: "6px",
                              fontSize: "0.75rem",
                              fontWeight: 500,
                              bgcolor: "rgba(63, 81, 181, 0.1)",
                              color: "#3f51b5",
                            }}
                          />
                        </TableCell>
                        <TableCell
                          sx={{ py: 2.5, fontFamily: "Poppins, sans-serif" }}
                        >
                          <Chip
                            label={row.staff?.length || 0}
                            size="small"
                            color="secondary"
                            sx={{
                              borderRadius: "6px",
                              fontSize: "0.75rem",
                              fontWeight: 500,
                              bgcolor: "rgba(233, 30, 99, 0.1)",
                              color: "#e91e63",
                            }}
                          />
                        </TableCell>
                        <TableCell
                          sx={{ py: 2.5, fontFamily: "Poppins, sans-serif" }}
                        >
                          <Chip
                            label={row.tenants?.length || 0}
                            size="small"
                            color="success"
                            sx={{
                              borderRadius: "6px",
                              fontSize: "0.75rem",
                              fontWeight: 500,
                              bgcolor: "rgba(76, 175, 80, 0.1)",
                              color: "#4caf50",
                            }}
                          />
                        </TableCell>
                        <TableCell
                          sx={{ py: 2.5, fontFamily: "Poppins, sans-serif" }}
                        >
                          {new Date(row.createdAt).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          })}
                        </TableCell>
                        <TableCell sx={{ py: 2.5 }}>
                          <Box sx={{ display: "flex", alignItems: "center" }}>
                            <Tooltip title="Edit Agent">
                              <IconButton
                                color="primary"
                                onClick={() => handleEditClick(row)}
                                sx={{
                                  "&:hover": {
                                    bgcolor: "rgba(25, 118, 210, 0.1)",
                                    transform: "translateY(-2px)",
                                  },
                                  transition: "all 0.2s",
                                  mr: 1,
                                  boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
                                }}
                                size="small"
                              >
                                <EditIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                          
                          </Box>
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell style={{ padding: 0 }} colSpan={8}>
                          <Accordion
                            expanded={expandedAgent === row._id}
                            onChange={() => handleAccordionExpand(row._id)}
                            sx={{
                              boxShadow: "none",
                              "&:before": { display: "none" },
                              bgcolor: "#f9fafb",
                            }}
                          >
                            <AccordionSummary
                              expandIcon={<ExpandMoreIcon />}
                              sx={{ bgcolor: "#f9fafb" }}
                            >
                              <Typography>View Associated Details</Typography>
                            </AccordionSummary>
                            <AccordionDetails>
                              {/* Staff List */}
                              <Grid container spacing={2} sx={{ mb: 3 }}>
                                <Grid item xs={12}>
                                  <Box
                                    sx={{
                                      display: "flex",
                                      alignItems: "center",
                                      gap: 1,
                                      bgcolor: "#f0f4f8",
                                      p: 2,
                                      borderRadius: "8px",
                                    }}
                                  >
                                    <PeopleIcon
                                      fontSize="small"
                                      color="primary"
                                    />
                                    <Typography
                                      variant="subtitle1"
                                      sx={{ fontWeight: 600, color: "#334155" }}
                                    >
                                      Staff (
                                      <Chip
                                        label={row.staff?.length || 0}
                                        size="small"
                                        color="primary"
                                        variant="outlined"
                                      />
                                      )
                                    </Typography>
                                  </Box>
                                  {!row.staff || row.staff.length === 0 ? (
                                    <Typography
                                      variant="body2"
                                      color="text.secondary"
                                      sx={{ mt: 1, ml: 4 }}
                                    >
                                      No staff members found
                                    </Typography>
                                  ) : (
                                    <TableContainer
                                      component={Paper}
                                      sx={{
                                        mt: 1,
                                        boxShadow: "none",
                                        border: "1px solid #e2e8f0",
                                      }}
                                    >
                                      <Table size="small">
                                        <TableHead>
                                          <TableRow>
                                            <TableCell>Name</TableCell>
                                            <TableCell>Email</TableCell>
                                            <TableCell>Job Title</TableCell>
                                          </TableRow>
                                        </TableHead>
                                        <TableBody>
                                          {row.staff.map((staff) => (
                                            <TableRow key={staff._id}>
                                              <TableCell>{`${staff.firstName} ${staff.lastName}`}</TableCell>
                                              <TableCell>
                                                {staff.email}
                                              </TableCell>
                                              <TableCell>
                                                {staff.jobTitle || "N/A"}
                                              </TableCell>
                                            </TableRow>
                                          ))}
                                        </TableBody>
                                      </Table>
                                    </TableContainer>
                                  )}
                                </Grid>
                              </Grid>

                              {/* Properties List */}
                              <Grid container spacing={2} sx={{ mb: 3 }}>
                                <Grid item xs={12}>
                                  <Box
                                    sx={{
                                      display: "flex",
                                      alignItems: "center",
                                      gap: 1,
                                      bgcolor: "#f0f4f8",
                                      p: 2,
                                      borderRadius: "8px",
                                    }}
                                  >
                                    <HomeIcon
                                      fontSize="small"
                                      color="secondary"
                                    />
                                    <Typography
                                      variant="subtitle1"
                                      sx={{ fontWeight: 600, color: "#334155" }}
                                    >
                                      Properties (
                                      <Chip
                                        label={row.properties?.length || 0}
                                        size="small"
                                        color="secondary"
                                        variant="outlined"
                                      />
                                      )
                                    </Typography>
                                  </Box>
                                  {!row.properties ||
                                  row.properties.length === 0 ? (
                                    <Typography
                                      variant="body2"
                                      color="text.secondary"
                                      sx={{ mt: 1, ml: 4 }}
                                    >
                                      No properties found
                                    </Typography>
                                  ) : (
                                    <TableContainer
                                      component={Paper}
                                      sx={{
                                        mt: 1,
                                        boxShadow: "none",
                                        border: "1px solid #e2e8f0",
                                      }}
                                    >
                                      <Table size="small">
                                        <TableHead>
                                          <TableRow>
                                            <TableCell>Address</TableCell>
                                            <TableCell>Rent</TableCell>
                                          </TableRow>
                                        </TableHead>
                                        <TableBody>
                                          {row.properties.map((property) => (
                                            <TableRow key={property._id}>
                                              <TableCell>
                                                {property.address || "N/A"}
                                              </TableCell>
                                              <TableCell>
                                                £
                                                {property.totalEligibleRent ||
                                                  0}
                                                /month
                                              </TableCell>
                                            </TableRow>
                                          ))}
                                        </TableBody>
                                      </Table>
                                    </TableContainer>
                                  )}
                                </Grid>
                              </Grid>
                            </AccordionDetails>
                          </Accordion>
                        </TableCell>
                      </TableRow>
                    </React.Fragment>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Card>

        {/* Pagination */}
        <Card
          elevation={2}
          sx={{
            mt: 3,
            borderRadius: "16px",
            overflow: "hidden",
          }}
        >
          <CardContent
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              gap: 2,
              py: 2,
              "&:last-child": { pb: 2 },
            }}
          >
            <Button
              variant="outlined"
              startIcon={<SkipPreviousIcon />}
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              sx={{
                minWidth: "130px",
                borderRadius: "10px",
                textTransform: "none",
                fontWeight: 600,
                fontFamily: "Poppins, sans-serif",
                border: "1px solid #e0e0e0",
                color: currentPage === 1 ? "#bdbdbd" : "#3f51b5",
                "&:hover": {
                  borderColor: "#3f51b5",
                  backgroundColor: "rgba(63, 81, 181, 0.04)",
                },
                transition: "all 0.2s ease",
              }}
            >
              Previous
            </Button>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
                px: 2,
                py: 1,
                borderRadius: "8px",
                backgroundColor: "#f5f7fa",
                minWidth: "120px",
                justifyContent: "center",
              }}
            >
              <Typography
                variant="body2"
                sx={{ fontFamily: "Poppins, sans-serif", fontWeight: 500 }}
              >
                Page{" "}
                <span style={{ fontWeight: 700, color: "#3f51b5" }}>
                  {currentPage}
                </span>{" "}
                of {totalPages}
              </Typography>
            </Box>
            <Button
              variant="outlined"
              endIcon={<SkipNextIcon />}
              disabled={currentPage === totalPages || totalPages === 0}
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
              sx={{
                minWidth: "130px",
                borderRadius: "10px",
                textTransform: "none",
                fontWeight: 600,
                fontFamily: "Poppins, sans-serif",
                border: "1px solid #e0e0e0",
                color:
                  currentPage === totalPages || totalPages === 0
                    ? "#bdbdbd"
                    : "#3f51b5",
                "&:hover": {
                  borderColor: "#3f51b5",
                  backgroundColor: "rgba(63, 81, 181, 0.04)",
                },
                transition: "all 0.2s ease",
              }}
            >
              Next
            </Button>
          </CardContent>
        </Card>
        {/* Agent Form Dialog */}
        <Dialog
          open={openAgentForm}
          onClose={handleCloseAgentForm}
          maxWidth="md"
          fullWidth
          sx={{
            "& .MuiDialog-paper": {
              borderRadius: "16px",
              padding: "16px",
              backgroundColor: "#f8f9fa",
              boxShadow: "0 10px 30px rgba(0,0,0,0.2)",
            },
          }}
        >
          <DialogTitle
            sx={{
              fontFamily: "Poppins, sans-serif",
              fontWeight: 700,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              color: "#1a237e",
              borderBottom: "1px solid #e0e0e0",
              pb: 2,
              "& .MuiTypography-root": {
                fontSize: "1.5rem",
              },
            }}
          >
            Edit Agent
            <IconButton
              onClick={handleCloseAgentForm}
              sx={{
                color: "#757575",
                "&:hover": {
                  backgroundColor: "rgba(0,0,0,0.05)",
                  transform: "rotate(90deg)",
                },
                transition: "all 0.3s ease",
              }}
            >
              <CloseIcon />
            </IconButton>
          </DialogTitle>
          <DialogContent sx={{ mt: 2 }}>
            {selectedAgent?._id ? (
              <AgentForm
                onSuccess={handleFormSuccess}
                onClose={handleCloseAgentForm}
                initialData={editMode ? selectedAgent : null}
                editMode={editMode}
                userId={selectedAgent._id}
              />
            ) : (
              <Box sx={{ textAlign: "center", py: 4 }}>
                <CircularProgress />
                <Typography sx={{ mt: 2 }}>Loading agent data...</Typography>
              </Box>
            )}
          </DialogContent>
        </Dialog>

        <ToastContainer
          position="top-center"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          style={{
            fontFamily: "Poppins, sans-serif",
            zIndex: 9999,
          }}
        />
      </Box>
    </Box>
  );
};

export default Agents;