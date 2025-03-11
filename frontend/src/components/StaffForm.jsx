import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  TextField,
  Button,
  Typography,
  Grid,
  Paper,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  FormControlLabel,
  Checkbox,
  Box,
} from "@mui/material";

// Import Staff API functions
import { createStaff, updateStaffById } from "../api/staffApi.js";

// Permission labels
const PERMISSION_LABELS = [
  "Add Property",
  "Edit Property",
  "Delete Property",
  "Add Tenant",
  "Edit Tenant",
  "Delete Tenant",
  "SignOut Tenant",
];

const StaffForm = ({ onSuccess, onClose, initialData, editMode }) => {
  const navigate = useNavigate();

  // State for form data
  const [formData, setFormData] = useState({
    jobTitle: "",
    firstName: "",
    lastName: "",
    phone: "",
    gender: "Male",
    username: "",
    email: "",
    correspondingEmail: "",
    password: "",
    role: 3,
    isDeleted: false,
    status: 1,
    checkboxValues: Array(9).fill(false),
  });

  // State for form errors
  const [errors, setErrors] = useState({});

  const { checkboxValues, ...restData } = formData;
  const staffData = {
    ...restData,
    permissions: checkboxValues,
  };

  // Initialize form data if in edit mode
  useEffect(() => {
    if (editMode && initialData) {
      setFormData({
        ...initialData,
        password: "",
        checkboxValues: initialData.permissions || Array(9).fill(false),
      });
    }
  }, [editMode, initialData]);

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error for the field if it exists
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  // Handle checkbox changes
  const handleCheckboxChange = (index) => {
    setFormData((prev) => {
      const updatedCheckboxValues = [...prev.checkboxValues];
      updatedCheckboxValues[index] = !updatedCheckboxValues[index];
      return { ...prev, checkboxValues: updatedCheckboxValues };
    });
  };

  // Validate form fields
  const validateForm = () => {
    const newErrors = {};

    if (!formData.jobTitle.trim()) newErrors.jobTitle = "Job Title is required";
    if (!formData.firstName.trim())
      newErrors.firstName = "First Name is required";
    if (!formData.lastName.trim()) newErrors.lastName = "Last Name is required";
    if (!formData.phone.trim()) newErrors.phone = "Phone is required";
    else if (!/^\d{10}$/.test(formData.phone)) {
      newErrors.phone = "Phone must be exactly 10 digits";
    }
    if (!formData.username.trim()) newErrors.username = "Username is required";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Invalid email format";
    }
    if (!formData.password.trim() && !editMode)
      newErrors.password = "Password is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      let result;
      if (editMode) {
        result = await updateStaffById(initialData._id, formData);
      } else {
        result = await createStaff(formData);
      }

      if (result.success) {
        toast.success(
          editMode
            ? "Staff updated successfully!"
            : "Staff registered successfully!",
          {
            position: "top-center",
            autoClose: 2000,
          }
        );

        if (onSuccess) {
          onSuccess();
        }

        setTimeout(() => {
          if (onClose) {
            onClose();
          }
        }, 2000);
      } else {
        toast.error(
          result.message ||
            `Failed to ${editMode ? "update" : "register"} staff`,
          {
            position: "top-center",
          }
        );
      }
    } catch (error) {
      if (error.response) {
        const errorMessage =
          error.response.data.message || error.response.statusText;

        if (errorMessage.includes("E11000")) {
          toast.error("Duplicate entry detected. This record already exists.", {
            position: "top-center",
          });
        } else {
          toast.error(`Error: ${errorMessage}`, {
            position: "top-center",
          });
        }
      } else if (error.request) {
        toast.error("No response from server. Please try again.", {
          position: "top-center",
        });
      } else {
        toast.error(`Request error: ${error.message}`, {
          position: "top-center",
        });
      }
    }
  };

  return (
    <Box component="main" sx={{ flexGrow: 1, p: 3, mt: 2 }}>
      <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Job Title"
                name="jobTitle"
                value={formData.jobTitle}
                onChange={handleInputChange}
                error={!!errors.jobTitle}
                helperText={errors.jobTitle}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="First Name"
                name="firstName"
                value={formData.firstName}
                onChange={handleInputChange} // Fixed: Changed from sehandleInputChange to handleInputChange
                error={!!errors.firstName}
                helperText={errors.firstName}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Last Name"
                name="lastName"
                value={formData.lastName}
                onChange={handleInputChange}
                error={!!errors.lastName}
                helperText={errors.lastName}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Phone"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                error={!!errors.phone}
                helperText={errors.phone}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Gender</InputLabel>
                <Select
                  name="gender"
                  value={formData.gender}
                  onChange={handleInputChange}
                  label="Gender"
                >
                  <MenuItem value="Male">Male</MenuItem>
                  <MenuItem value="Female">Female</MenuItem>
                  <MenuItem value="Other">Other</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Username"
                name="username"
                value={formData.username}
                onChange={handleInputChange}
                error={!!errors.username}
                helperText={errors.username}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                error={!!errors.email}
                helperText={errors.email}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Corresponding Email"
                name="correspondingEmail"
                value={formData.correspondingEmail}
                InputProps={{
                  readOnly: true,
                }}
                sx={{
                  "& .MuiInputBase-input.Mui-readOnly": {
                    backgroundColor: "#f5f5f5",
                    cursor: "not-allowed",
                  },
                }}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleInputChange}
                error={!!errors.password}
                helperText={errors.password}
              />
            </Grid>

            {/* Permissions Section */}
            <Grid item xs={12}>
              <Typography variant="h6" sx={{ mb: 2 }}>
                Permissions:
              </Typography>
              <Grid container spacing={2}>
                {PERMISSION_LABELS.map((label, index) => (
                  <Grid item xs={12} sm={6} md={4} key={index}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={formData.checkboxValues[index]}
                          onChange={() => handleCheckboxChange(index)}
                          name={`permission-${index}`}
                        />
                      }
                      label={label}
                    />
                  </Grid>
                ))}
              </Grid>
            </Grid>

            <Grid item xs={12} sx={{ textAlign: "center" }}>
              <Button
                variant="contained"
                color="primary"
                type="submit"
                sx={{ width: "100%", mt: 2 }}
              >
                {editMode ? "Update Staff" : "Register Staff"}
              </Button>
            </Grid>
          </Grid>
        </form>
      </Paper>
      <ToastContainer />
    </Box>
  );
};

StaffForm.propTypes = {
  onSuccess: PropTypes.func,
  onClose: PropTypes.func,
  initialData: PropTypes.shape({
    _id: PropTypes.string,
    permissions: PropTypes.arrayOf(PropTypes.bool),
  }),
  editMode: PropTypes.bool,
};

export default StaffForm;
