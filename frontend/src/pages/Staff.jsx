import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Alert, Snackbar } from "@mui/material";
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
  Tooltip,
  Card,
  CardContent,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import SearchIcon from "@mui/icons-material/Search";
import CloseIcon from "@mui/icons-material/Close";
import SkipPreviousIcon from "@mui/icons-material/SkipPrevious";
import SkipNextIcon from "@mui/icons-material/SkipNext";
import PersonIcon from "@mui/icons-material/Person";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import StaffForm from "../components/StaffForm";
import { getAllStaff, deleteStaffById } from "../api/staffApi.js";
import { getCurrentUser } from "../api/userApi.js";

const drawerWidth = 240;

const Staff = () => {
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [userName, setUserName] = useState("");
  const [staffData, setStaffData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openStaffForm, setOpenStaffForm] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [sortConfig, setSortConfig] = useState({ key: "", direction: "asc" });

  useEffect(() => {
    fetchStaffData();
  }, []);

  useEffect(() => {
    getCurrentUser(navigate, setUserName);
  }, []);

  const fetchStaffData = async () => {
    setLoading(true);
    try {
      const result = await getAllStaff();

      if (result.success && Array.isArray(result.data)) {
        setStaffData(result.data);
      } else {
        setStaffData([]);
        setError("Invalid data structure received");
      }
    } catch (error) {
      console.error("Error fetching staff data:", error);
      setError("Failed to fetch staff data");
      setStaffData([]);
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

  const filteredData = staffData.filter((row) =>
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

  const handleEditClick = (staff) => {
    setSelectedStaff(staff);
    setEditMode(true);
    setOpenStaffForm(true);
  };

  const handleDeleteClick = (staff) => {
    setSelectedStaff(staff);
    setOpenDeleteDialog(true);
  };

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success", 

  });
 const handleDeleteConfirm = async () => {
   try {
     const result = await deleteStaffById(selectedStaff._id);

     if (result.success) {
       setSnackbar({
         open: true,
         message: "Staff member deleted successfully!",
         severity: "success",
       });
       fetchStaffData();
     } else {
       setSnackbar({
         open: true,
         message: result.message || "Failed to delete staff member",
         severity: "error",
       });
     }
   } catch (error) {
     console.error("Error deleting staff:", error);
     setSnackbar({
       open: true,
       message: "Network error. Please try again.",
       severity: "error",
     });
   }
   setOpenDeleteDialog(false);
   setSelectedStaff(null);
 };

  const handleOpenStaffForm = () => {
    setEditMode(false);
    setSelectedStaff(null);
    setOpenStaffForm(true);
  };

  const handleCloseStaffForm = () => {
    setOpenStaffForm(false);
    setEditMode(false);
    setSelectedStaff(null);
  };

  const handleFormSuccess = () => {
    fetchStaffData();
    setOpenStaffForm(false);
    setEditMode(false);
    setSelectedStaff(null);
  };

  // Get gender specific color
  const getGenderColor = (gender) => {
    return gender === "Male"
      ? "#1976d2"
      : gender === "Female"
      ? "#e91e63"
      : "#9c27b0";
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
                Staff Management
              </Typography>
            </Box>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={handleOpenStaffForm}
              sx={{
                bgcolor: "white",
                color: "#1a237e",
                "&:hover": { bgcolor: "rgba(255, 255, 255, 0.9)" },
                fontWeight: "600",
                px: 3,
                py: 1.5,
                borderRadius: "12px",
                boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
                textTransform: "none",
                transition: "all 0.3s ease",
                letterSpacing: "0.5px",
              }}
            >
              Add New Staff
            </Button>
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
                placeholder="Search Staff..."
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
                    { key: "jobTitle", label: "Job Title" },
                    { key: "firstName", label: "First Name" },
                    { key: "lastName", label: "Last Name" },
                    { key: "email", label: "Email" },
                    { key: "phone", label: "Phone" },
                    { key: "gender", label: "Gender" },
                    { key: "createdAt", label: "Created At" },
                    { key: "correspondingEmail", label: "Corresponding Email" },
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
                    <TableCell colSpan={9} align="center" sx={{ py: 6 }}>
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
                          Loading staff data...
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
                      colSpan={9}
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
                    <TableCell colSpan={9} align="center" sx={{ py: 6 }}>
                      <Box
                        sx={{
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                          gap: 2,
                        }}
                      >
                        <PersonIcon sx={{ fontSize: 48, color: "#bdbdbd" }} />
                        <Typography
                          color="text.secondary"
                          sx={{ fontFamily: "Poppins, sans-serif" }}
                        >
                          No staff data available
                        </Typography>
                      </Box>
                    </TableCell>
                  </TableRow>
                ) : (
                  currentData.map((row) => (
                    <TableRow
                      key={row._id}
                      sx={{
                        "&:hover": { bgcolor: "#f9fafc" },
                        transition: "background-color 0.2s ease",
                        borderLeft: "4px solid transparent",
                        ":hover": {
                          borderLeft: `4px solid ${getGenderColor(row.gender)}`,
                          bgcolor: "#f5f7fa",
                        },
                      }}
                    >
                      <TableCell
                        sx={{ py: 2.5, fontFamily: "Poppins, sans-serif" }}
                      >
                        <Chip
                          label={row.jobTitle}
                          size="small"
                          color="primary"
                          sx={{
                            borderRadius: "6px",
                            fontSize: "0.75rem",
                            fontWeight: 500,
                            fontFamily: "Poppins, sans-serif",
                            bgcolor: "rgba(63, 81, 181, 0.1)",
                            color: "#3f51b5",
                            border: "none",
                          }}
                        />
                      </TableCell>
                      <TableCell
                        sx={{
                          py: 2.5,
                          fontFamily: "Poppins, sans-serif",
                        }}
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
                        {row.phone}
                      </TableCell>
                      <TableCell
                        sx={{ py: 2.5, fontFamily: "Poppins, sans-serif" }}
                      >
                        <Chip
                          label={row.gender}
                          size="small"
                          sx={{
                            borderRadius: "6px",
                            fontSize: "0.75rem",
                            fontWeight: 500,
                            fontFamily: "Poppins, sans-serif",
                            bgcolor: `${getGenderColor(row.gender)}15`,
                            color: getGenderColor(row.gender),
                            border: "none",
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
                      <TableCell
                        sx={{
                          py: 2.5,
                          fontFamily: "Poppins, sans-serif",
                          color: "#1976d2",
                        }}
                      >
                        {row.correspondingEmail}
                      </TableCell>
                      <TableCell sx={{ py: 2.5 }}>
                        <Box sx={{ display: "flex" }}>
                          <Tooltip title="Edit Staff Member">
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
                          <Tooltip title="Delete Staff Member">
                            <IconButton
                              color="error"
                              onClick={() => handleDeleteClick(row)}
                              sx={{
                                "&:hover": {
                                  bgcolor: "rgba(211, 47, 47, 0.1)",
                                  transform: "translateY(-2px)",
                                },
                                transition: "all 0.2s",
                                boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
                              }}
                              size="small"
                            >
                              <DeleteIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        </Box>
                      </TableCell>
                    </TableRow>
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
        {/* Delete Confirmation Dialog */}
        <Dialog
          open={openDeleteDialog}
          onClose={() => setOpenDeleteDialog(false)}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
          sx={{
            "& .MuiDialog-paper": {
              borderRadius: "16px",
              padding: "16px",
              boxShadow: "0 8px 24px rgba(0,0,0,0.15)",
            },
          }}
        >
          <DialogTitle
            id="alert-dialog-title"
            sx={{
              fontWeight: 700,
              color: "#d32f2f",
              display: "flex",
              alignItems: "center",
              gap: 1.5,
              fontFamily: "Poppins, sans-serif",
              borderBottom: "1px solid #f0f0f0",
              pb: 2,
            }}
          >
            <DeleteIcon color="error" /> Confirm Delete
          </DialogTitle>
          <DialogContent sx={{ mt: 2, pt: 2 }}>
            <DialogContentText
              id="alert-dialog-description"
              sx={{
                color: "#37474f",
                fontWeight: 500,
                fontFamily: "Poppins, sans-serif",
              }}
            >
              Are you sure you want to delete {selectedStaff?.firstName}{" "}
              {selectedStaff?.lastName}? This action cannot be undone.
            </DialogContentText>
          </DialogContent>
          <DialogActions sx={{ p: 2, pt: 0 }}>
            <Button
              onClick={() => setOpenDeleteDialog(false)}
              color="primary"
              variant="outlined"
              sx={{
                borderRadius: "10px",
                textTransform: "none",
                fontFamily: "Poppins, sans-serif",
                fontWeight: 600,
                px: 3,
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleDeleteConfirm}
              color="error"
              variant="contained"
              autoFocus
              sx={{
                borderRadius: "10px",
                boxShadow: "none",
                "&:hover": {
                  boxShadow: "0 4px 8px rgba(211, 47, 47, 0.3)",
                  backgroundColor: "#c62828",
                },
                textTransform: "none",
                fontFamily: "Poppins, sans-serif",
                fontWeight: 600,
                px: 3,
                transition: "all 0.2s ease",
              }}
            >
              Delete
            </Button>
          </DialogActions>
        </Dialog>
        {/* Staff Form Dialog */}
        <Dialog
          open={openStaffForm}
          onClose={handleCloseStaffForm}
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
            {editMode ? "Edit Staff Member" : "Add New Staff Member"}
            <IconButton
              onClick={handleCloseStaffForm}
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
            <StaffForm
              onSuccess={handleFormSuccess}
              onClose={handleCloseStaffForm}
              initialData={editMode ? selectedStaff : null}
              editMode={editMode}
            />
          </DialogContent>
        </Dialog>
       
        <Snackbar
          open={snackbar.open}
          autoHideDuration={2000}
          onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
        >
          <Alert
            onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
            severity={snackbar.severity}
            variant="filled"
            sx={{ width: "100%" }}
          >
            {snackbar.message}
          </Alert>
        </Snackbar>
        ;
        <ToastContainer
          position="top-center"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          style={{
            fontFamily: "Poppins, sans-serif",
            zIndex: 9999999,
          }}
          toastStyle={{
            background: "white",
            color: "#333",
            boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
            borderRadius: "8px",
            padding: "12px 16px",
            fontSize: "14px",
          }}
        />
      </Box>
    </Box>
  );
};

export default Staff;
