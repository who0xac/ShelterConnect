import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  Box,
  Typography,
  Button,
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
  DialogContentText,
  DialogActions,
  TextField,
  CssBaseline,
  Chip,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import SearchIcon from "@mui/icons-material/Search";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import TenantForm from "../components/TenantForm.jsx";
import CloseIcon from "@mui/icons-material/Close";

// Import API functions
import { getAllTenants, deleteTenantById } from "../api/tenantApi.js";
import { getCurrentUser } from "../api/userApi.js";

const drawerWidth = 240;

const Tenants = () => {
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [userName, setUserName] = useState("");
  const [tenantsData, setTenantsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openTenantForm, setOpenTenantForm] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [selectedTenant, setSelectedTenant] = useState(null);
  const [editMode, setEditMode] = useState(false);

  // Table control states
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [sortConfig, setSortConfig] = useState({ key: "", direction: "asc" });

  useEffect(() => {
    fetchTenantsData();
  }, []);

  useEffect(() => {
    getCurrentUser(navigate, setUserName);
  }, []);

  const fetchTenantsData = async () => {
    setLoading(true);
    try {
      const result = await getAllTenants();

      if (result.success && Array.isArray(result.data)) {
        setTenantsData(result.data);
      } else {
        setTenantsData([]);
        setError("Invalid data structure received");
      }
    } catch (error) {
      console.error("Error fetching tenants data:", error);
      setError("Failed to fetch tenants data");
      setTenantsData([]);
    } finally {
      setLoading(false);
    }
  };

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

  const filteredData = tenantsData.filter((row) =>
    Object.values(row).some((value) =>
      String(value).toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const sortedData = sortData(filteredData);
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

  const handleEditClick = (tenant) => {
    setSelectedTenant(tenant);
    setEditMode(true);
    setOpenTenantForm(true);
  };

  const handleDeleteClick = (tenant) => {
    setSelectedTenant(tenant);
    setOpenDeleteDialog(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      const result = await deleteTenantById(selectedTenant._id);

      if (result.success) {
        toast.success("Tenant deleted successfully!");
        fetchTenantsData();
      } else {
        toast.error(result.message || "Failed to delete tenant");
      }
    } catch (error) {
      toast.error("Network error. Please try again.");
    }
    setOpenDeleteDialog(false);
    setSelectedTenant(null);
  };

  const handleOpenTenantForm = () => {
    setEditMode(false);
    setSelectedTenant(null);
    setOpenTenantForm(true);
  };

  const handleCloseTenantForm = () => {
    setOpenTenantForm(false);
    setEditMode(false);
    setSelectedTenant(null);
  };

  const handleFormSuccess = () => {
    fetchTenantsData();
    setOpenTenantForm(false);
    setEditMode(false);
    setSelectedTenant(null);
  };

  // Helper function to safely render user data
  const renderAddedBy = (addedBy) => {
    if (!addedBy) return "N/A";
    if (typeof addedBy === "string") return addedBy;
    if (typeof addedBy === "object") {
      // Return the name if available, otherwise email or any identifier that makes sense
      return addedBy.firstName && addedBy.lastName
        ? `${addedBy.firstName} ${addedBy.lastName}`
        : addedBy.email || addedBy._id || "Unknown";
    }
    return "Unknown";
  };

  // Format date as MM/DD/YYYY
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return "Invalid Date";

      const month = date.getMonth() + 1;
      const day = date.getDate();
      const year = date.getFullYear();

      return `${month}/${day}/${year}`;
    } catch (error) {
      return "Invalid Date";
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
            Tenant Management
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleOpenTenantForm}
            sx={{
              bgcolor: "#2ecc71",
              "&:hover": { bgcolor: "#27ae60" },
              fontWeight: "600",
              px: 3,
              py: 1,
              borderRadius: "8px",
              boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
              textTransform: "none",
            }}
          >
            Add New Tenant
          </Button>
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
              placeholder="Search Tenants..."
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
            {Math.min((currentPage - 1) * rowsPerPage + 1, filteredData.length)}{" "}
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
          <Table sx={{ minWidth: 650 }}>
            <TableHead>
              <TableRow sx={{ bgcolor: "#f8fafc" }}>
                {[
                  { key: "property", label: "Property" },
                  { key: "firstName", label: "First Name" },
                  { key: "middleName", label: "Middle Name" },
                  { key: "lastName", label: "Last Name" },
                  { key: "room", label: "Room" },
                  { key: "dateOfBirth", label: "Date of Birth" },
                  { key: "signInDate", label: "Sign In Date" },
                  { key: "signOutDate", label: "Sign Out Date" },
                  { key: "addedBy", label: "Added By" },
                  { key: "createdAt", label: "Created At" },
                  { key: "status", label: "Status" },
                  { key: "actions", label: "Actions" },
                ].map((column) => (
                  <TableCell
                    key={column.key}
                    onClick={() =>
                      column.key !== "actions" &&
                      column.key !== "status" &&
                      handleSort(column.key)
                    }
                    sx={{
                      fontWeight: 600,
                      color: "#334155",
                      py: 2,
                      cursor:
                        column.key !== "actions" && column.key !== "status"
                          ? "pointer"
                          : "default",
                      "&:hover":
                        column.key !== "actions" && column.key !== "status"
                          ? { bgcolor: "rgba(0, 0, 0, 0.04)" }
                          : {},
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
                  <TableCell colSpan={12} align="center" sx={{ py: 4 }}>
                    <Typography color="primary">Loading...</Typography>
                  </TableCell>
                </TableRow>
              ) : error ? (
                <TableRow>
                  <TableCell
                    colSpan={12}
                    align="center"
                    sx={{ py: 4, color: "error.main" }}
                  >
                    {error}
                  </TableCell>
                </TableRow>
              ) : currentData.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={12} align="center" sx={{ py: 4 }}>
                    <Typography color="text.secondary">
                      No tenants data available
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                currentData.map((row) => (
                  <TableRow
                    key={row._id}
                    sx={{
                      "&:hover": { bgcolor: "#f8fafc" },
                      transition: "background-color 0.2s ease",
                    }}
                  >
                    <TableCell sx={{ py: 2 }}>
                      {row.property ? row.property.address : "N/A"}
                    </TableCell>
                    <TableCell sx={{ py: 2 }}>
                      {row.personalDetails.firstName}
                    </TableCell>
                    <TableCell sx={{ py: 2 }}>
                      {row.personalDetails.middleName}
                    </TableCell>
                    <TableCell sx={{ py: 2 }}>
                      {row.personalDetails.lastName}
                    </TableCell>
                    <TableCell sx={{ py: 2 }}>{row.roomNumber}</TableCell>
                    <TableCell sx={{ py: 2 }}>
                      {formatDate(row.personalDetails.dateOfBirth)}
                    </TableCell>
                    <TableCell sx={{ py: 2 }}>
                      {formatDate(row.signInDate)}
                    </TableCell>
                    <TableCell sx={{ py: 2 }}>
                      {formatDate(row.signOutDate)}
                    </TableCell>
                    <TableCell sx={{ py: 2 }}>
                      {renderAddedBy(row.addedBy)}
                    </TableCell>
                    <TableCell sx={{ py: 2 }}>
                      {formatDate(row.createdAt)}
                    </TableCell>
                    <TableCell sx={{ py: 2 }}>
                      <Chip
                        label={row.status === 1 ? "Yes" : "No"}
                        size="small"
                        color={row.status === 1 ? "success" : "error"}
                        sx={{
                          fontWeight: 500,
                          minWidth: "80px",
                        }}
                      />
                    </TableCell>

                    <TableCell sx={{ py: 2 }}>
                      <IconButton
                        color="primary"
                        onClick={() => handleEditClick(row)}
                        sx={{
                          "&:hover": { bgcolor: "rgba(25, 118, 210, 0.04)" },
                          transition: "background-color 0.2s",
                        }}
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        color="error"
                        onClick={() => handleDeleteClick(row)}
                        sx={{
                          "&:hover": { bgcolor: "rgba(211, 47, 47, 0.04)" },
                          transition: "background-color 0.2s",
                        }}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
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
            Page {currentPage} of {totalPages}
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

        {/* Delete Confirmation Dialog */}
        <Dialog
          open={openDeleteDialog}
          onClose={() => setOpenDeleteDialog(false)}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">Confirm Delete</DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              Are you sure you want to delete tenant{" "}
              {selectedTenant
                ? `${selectedTenant.firstName} ${selectedTenant.lastName}`
                : ""}
              ? This action cannot be undone.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenDeleteDialog(false)} color="primary">
              Cancel
            </Button>
            <Button onClick={handleDeleteConfirm} color="error" autoFocus>
              Delete
            </Button>
          </DialogActions>
        </Dialog>

        {/* Tenant Form Dialog */}
        <Dialog
          open={openTenantForm}
          onClose={handleCloseTenantForm}
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
            {editMode ? "Edit Tenant" : "Add New Tenant"}
            <IconButton onClick={handleCloseTenantForm}>
              <CloseIcon />
            </IconButton>
          </DialogTitle>
          <DialogContent>
            <TenantForm
              onSuccess={handleFormSuccess}
              onClose={handleCloseTenantForm}
              initialData={editMode ? selectedTenant : null}
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

export default Tenants;  