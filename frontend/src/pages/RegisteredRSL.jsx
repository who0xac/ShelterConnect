import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
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
  DialogActions,
  TextField,
  Grid,
  CssBaseline,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import SearchIcon from "@mui/icons-material/Search";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import RslForm from "../components/RslForm";
import CloseIcon from "@mui/icons-material/Close";


const drawerWidth = 240;

const RegisteredRSL = () => {
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [userName, setUserName] = useState("");
  const [rslData, setRslData] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [editData, setEditData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Table control states
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [sortConfig, setSortConfig] = useState({ key: "", direction: "asc" });

  const [formData, setFormData] = useState({
    rslName: "",
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    addressLine1: "",
    area: "",
    city: "",
    postCode: "",
    logo: "",
  });

  useEffect(() => {
    fetchUserData();
    fetchRSLData();
  }, []);

  const fetchUserData = async () => {
    try {
      const response = await fetch("http://localhost:3000/users");
      const data = await response.json();
      setUserName(data.name || "User");
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  const fetchRSLData = async () => {
    setLoading(true);
    try {
      const response = await fetch("http://localhost:3000/rsl");
      const result = await response.json();

      // Check if the response has the expected structure
      if (result.success && Array.isArray(result.data)) {
        setRslData(result.data);
      } else {
        setRslData([]);
        setError("Invalid data structure received");
      }
    } catch (error) {
      console.error("Error fetching RSL data:", error);
      setError("Failed to fetch RSL data");
      setRslData([]);
    } finally {
      setLoading(false);
    }
  };

  // Table control functions
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

  // Filter data based on search term
  const filteredData = rslData.filter((row) =>
    Object.values(row).some((value) =>
      String(value).toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  // Sort and paginate data
  const sortedData = sortData(filteredData);
  const totalPages = Math.ceil(sortedData.length / rowsPerPage);
  const currentData = sortedData.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  const [openRslForm, setOpenRslForm] = useState(false);


  const handleDrawerToggle = () => setMobileOpen(!mobileOpen);
  const handleSidebarToggle = () => setSidebarOpen(!sidebarOpen);
  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  const handleOpenRslForm = () => setOpenRslForm(true);
  const handleCloseRslForm = () => setOpenRslForm(false);
  const handleFormSuccess = () => {
    fetchRSLData(); // Refresh the table data
    handleCloseRslForm();
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
            RSL
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleOpenRslForm} // Add this onClick handler
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
            Register New RSL
          </Button>
          {/* Add this Dialog component just before the closing Box tag */}
          {/* RSL Registration Dialog */}
          <Dialog
            open={openRslForm}
            onClose={handleCloseRslForm}
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
              Register New RSL
              <IconButton onClick={handleCloseRslForm}>
                <CloseIcon />
              </IconButton>
            </DialogTitle>
            <DialogContent>
              <RslForm
                onSuccess={() => {
                  handleFormSuccess();
                  // Show success message if needed
                }}
                onClose={handleCloseRslForm}
              />
            </DialogContent>
          </Dialog>
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
              placeholder="Search RSL..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1); // Reset to first page on search
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
                  { key: "rslName", label: "RSL Name" },
                  { key: "firstName", label: "First Name" },
                  { key: "lastName", label: "Last Name" },
                  { key: "email", label: "Email" },
                  { key: "phoneNumber", label: "Phone" },
                  { key: "addressLine1", label: "Address" },
                  { key: "area", label: "Area" },
                  { key: "city", label: "City" },
                  { key: "postCode", label: "Post Code" },
                  { key: "createdAt", label: "Created At" },
                  { key: "actions", label: "Actions" },
                ].map((column) => (
                  <TableCell
                    key={column.key}
                    onClick={() =>
                      column.key !== "actions" && handleSort(column.key)
                    }
                    sx={{
                      fontWeight: 600,
                      color: "#334155",
                      py: 2,
                      cursor: column.key !== "actions" ? "pointer" : "default",
                      "&:hover":
                        column.key !== "actions"
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
                  <TableCell colSpan={11} align="center" sx={{ py: 4 }}>
                    <Typography color="primary">Loading...</Typography>
                  </TableCell>
                </TableRow>
              ) : error ? (
                <TableRow>
                  <TableCell
                    colSpan={11}
                    align="center"
                    sx={{ py: 4, color: "error.main" }}
                  >
                    {error}
                  </TableCell>
                </TableRow>
              ) : currentData.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={11} align="center" sx={{ py: 4 }}>
                    <Typography color="text.secondary">
                      No RSL data available
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
                    <TableCell sx={{ py: 2 }}>{row.rslName}</TableCell>
                    <TableCell sx={{ py: 2 }}>{row.firstName}</TableCell>
                    <TableCell sx={{ py: 2 }}>{row.lastName}</TableCell>
                    <TableCell sx={{ py: 2 }}>{row.email}</TableCell>
                    <TableCell sx={{ py: 2 }}>{row.phoneNumber}</TableCell>
                    <TableCell sx={{ py: 2 }}>{row.addressLine1}</TableCell>
                    <TableCell sx={{ py: 2 }}>{row.area}</TableCell>
                    <TableCell sx={{ py: 2 }}>{row.city}</TableCell>
                    <TableCell sx={{ py: 2 }}>{row.postCode}</TableCell>
                    <TableCell sx={{ py: 2 }}>
                      {new Date(row.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell sx={{ py: 2 }}>
                      <IconButton
                        color="primary"
                        sx={{
                          "&:hover": { bgcolor: "rgba(25, 118, 210, 0.04)" },
                          transition: "background-color 0.2s",
                        }}
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        color="error"
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
            disabled={currentPage === totalPages}
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
      </Box>
    </Box>
  );
};

export default RegisteredRSL;
