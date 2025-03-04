import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import PeopleIcon from "@mui/icons-material/People";
import HomeIcon from "@mui/icons-material/Home"; 
import Grid from "@mui/material/Grid";
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
  Button,
  Switch,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Chip,
  CircularProgress,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import SearchIcon from "@mui/icons-material/Search";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import CloseIcon from "@mui/icons-material/Close";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import AgentForm from "../components/AgentForm.jsx";

// Import API functions
import {
  getAllAgents,
  updateUserById,
  getCurrentUser,
} from "../api/userApi.js";

const drawerWidth = 240;

const Agents = () => {
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [userName, setUserName] = useState("");
  const [userData, setUserData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openAgentForm, setOpenAgentForm] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [expandedAgent, setExpandedAgent] = useState(null);

  // Table control states
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [sortConfig, setSortConfig] = useState({ key: "", direction: "asc" });

  const fetchUserData = useCallback(async () => {
    setLoading(true);
    try {
      const result = await getAllAgents();
      if (result.success && Array.isArray(result.data)) {
        setUserData(result.data);
        setError(null);
      } else {
        setUserData([]);
        setError("Invalid data structure received");
      }
    } catch (error) {
      console.error("Error fetching agent data:", error);
      setError("Failed to fetch agent data");
      setUserData([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUserData();
  }, [fetchUserData]);

  useEffect(() => {
    getCurrentUser(navigate, setUserName);
  }, [navigate]);

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
    return userData.filter((row) =>
      Object.entries(row).some(([key, value]) => {
        if (
          typeof value === "object" ||
          value === null ||
          key === "_id" ||
          key === "__v"
        ) {
          return false;
        }
        return String(value).toLowerCase().includes(searchTerm.toLowerCase());
      })
    );
  }, [userData, searchTerm]);

  const sortedData = useMemo(
    () => sortData(filteredData),
    [filteredData, sortConfig]
  );
  const totalPages = Math.ceil(sortedData.length / rowsPerPage);
  const currentData = useMemo(() => {
    return sortedData.slice(
      (currentPage - 1) * rowsPerPage,
      currentPage * rowsPerPage
    );
  }, [sortedData, currentPage, rowsPerPage]);

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

  const handleEditClick = (user) => {
    setSelectedUser(user);
    setEditMode(true);
    setOpenAgentForm(true);
  };

  const handleToggleStatus = async (user) => {
    try {
      const newStatus = !user.isActive;
      const updatedUser = { ...user, isActive: newStatus };
      const result = await updateUserById(user._id, updatedUser);
      if (result.success) {
        toast.success(
          `Agent ${newStatus ? "activated" : "deactivated"} successfully!`
        );
        fetchUserData();
      } else {
        toast.error(result.message || "Failed to update agent status");
      }
    } catch (error) {
      console.error("Error updating agent status:", error);
      toast.error("Network error. Please try again.");
    }
  };

  const handleCloseAgentForm = () => {
    setOpenAgentForm(false);
    setEditMode(false);
    setSelectedUser(null);
  };

  const handleFormSuccess = () => {
    fetchUserData();
    setOpenAgentForm(false);
    setEditMode(false);
    setSelectedUser(null);
  };

  const handleAccordionExpand = (agentId) => {
    if (expandedAgent === agentId) {
      setExpandedAgent(null);
    } else {
      setExpandedAgent(agentId);
    }
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
        {/* Header */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 3,
          }}
        >
          <Typography
            variant="h4"
            sx={{
              fontFamily: "Poppins, sans-serif",
              fontWeight: 600,
              color: "#2c3e50",
            }}
          >
            Agent Management
          </Typography>
        </Box>

        {/* Search and Rows per page */}
        <Box
          sx={{
            mb: 3,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
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
              }}
              sx={{
                width: "300px",
                "& .MuiOutlinedInput-root": {
                  borderRadius: "8px",
                },
              }}
            />
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Typography variant="body2" color="text.secondary">
                Rows per page:
              </Typography>
              <select
                value={rowsPerPage}
                onChange={(e) => {
                  setRowsPerPage(Number(e.target.value));
                  setCurrentPage(1);
                }}
                style={{
                  padding: "4px 8px",
                  borderRadius: "4px",
                  border: "1px solid #ccc",
                  cursor: "pointer",
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
          <Typography variant="body2" color="text.secondary">
            Showing{" "}
            {Math.min(
              (currentPage - 1) * rowsPerPage + 1,
              filteredData.length
            ) || 0}{" "}
            to {Math.min(currentPage * rowsPerPage, filteredData.length)} of{" "}
            {filteredData.length} entries
          </Typography>
        </Box>

        {/* Table */}
        <TableContainer
          component={Paper}
          sx={{
            boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
            borderRadius: "12px",
            overflow: "hidden",
          }}
        >
          {loading ? (
            <Box sx={{ display: "flex", justifyContent: "center", p: 3 }}>
              <CircularProgress />
            </Box>
          ) : error ? (
            <Box sx={{ p: 3, textAlign: "center", color: "error.main" }}>
              <Typography>{error}</Typography>
              <Button variant="outlined" onClick={fetchUserData} sx={{ mt: 2 }}>
                Retry
              </Button>
            </Box>
          ) : (
            <Table sx={{ minWidth: 650 }}>
              <TableHead>
                <TableRow sx={{ bgcolor: "#f8fafc" }}>
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
                        column.key !== "actions" &&
                        column.key !== "properties" &&
                        column.key !== "staff" &&
                        column.key !== "tenants" &&
                        handleSort(column.key)
                      }
                      sx={{
                        fontWeight: 600,
                        color: "#334155",
                        py: 2,
                        cursor:
                          column.key !== "actions" &&
                          column.key !== "properties" &&
                          column.key !== "staff" &&
                          column.key !== "tenants"
                            ? "pointer"
                            : "default",
                      }}
                    >
                      {column.label}
                      {sortConfig.key === column.key && (
                        <span>
                          {sortConfig.direction === "asc" ? " ↑" : " ↓"}
                        </span>
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {currentData.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} align="center" sx={{ py: 3 }}>
                      <Typography variant="body1" color="text.secondary">
                        No agents found
                      </Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  currentData.map((row) => (
                    <React.Fragment key={row._id}>
                      <TableRow
                        sx={{
                          "&:hover": { backgroundColor: "#f8fafc" },
                        }}
                      >
                        <TableCell>{row.firstName}</TableCell>
                        <TableCell>{row.lastName}</TableCell>
                        <TableCell>{row.email}</TableCell>
                        <TableCell>
                          <Chip
                            label={
                              Array.isArray(row.properties)
                                ? row.properties.length
                                : 0
                            }
                            size="small"
                            color="primary"
                            variant="outlined"
                          />
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={
                              Array.isArray(row.staff) ? row.staff.length : 0
                            }
                            size="small"
                            color="secondary"
                            variant="outlined"
                          />
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={
                              Array.isArray(row.tenants)
                                ? row.tenants.length
                                : 0
                            }
                            size="small"
                            color="success"
                            variant="outlined"
                          />
                        </TableCell>
                        <TableCell>
                          {new Date(row.createdAt).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          <Box sx={{ display: "flex", alignItems: "center" }}>
                            <IconButton
                              color="primary"
                              onClick={() => handleEditClick(row)}
                              size="small"
                              sx={{ mr: 1 }}
                            >
                              <EditIcon fontSize="small" />
                            </IconButton>
                            <Switch
                              checked={row.isActive}
                              onChange={() => handleToggleStatus(row)}
                              color={row.isActive ? "success" : "default"}
                              size="small"
                            />
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
                                        label={
                                          Array.isArray(row.staff)
                                            ? row.staff.length
                                            : 0
                                        }
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
                                        label={
                                          Array.isArray(row.properties)
                                            ? row.properties.length
                                            : 0
                                        }
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
          )}
        </TableContainer>

        {/* Pagination */}
        <Box
          sx={{
            mt: 2,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: 2,
            py: 2,
          }}
        >
          <Button
            variant="outlined"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            sx={{
              minWidth: "100px",
              borderRadius: "8px",
              textTransform: "none",
            }}
          >
            Previous
          </Button>
          <Typography variant="body2" color="text.secondary">
            Page {currentPage} of {Math.max(1, totalPages)}
          </Typography>
          <Button
            variant="outlined"
            disabled={currentPage === totalPages || totalPages === 0}
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, totalPages))
            }
            sx={{
              minWidth: "100px",
              borderRadius: "8px",
              textTransform: "none",
            }}
          >
            Next
          </Button>
        </Box>

        {/* Agent Form Dialog */}
        <Dialog
          open={openAgentForm}
          onClose={handleCloseAgentForm}
          maxWidth="md"
          fullWidth
          sx={{
            "& .MuiDialog-paper": {
              borderRadius: "12px",
              padding: "16px",
            },
          }}
        >
          <DialogTitle
            sx={{
              fontFamily: "Poppins, sans-serif",
              fontWeight: 600,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            {editMode ? "Edit Agent" : "Add New Agent"}
            <IconButton onClick={handleCloseAgentForm}>
              <CloseIcon />
            </IconButton>
          </DialogTitle>
          <DialogContent>
            <AgentForm
              onSuccess={handleFormSuccess}
              onClose={handleCloseAgentForm}
              initialData={editMode ? selectedUser : null}
              editMode={editMode}
            />
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
        />
      </Box>
    </Box>
  );
};

export default Agents;