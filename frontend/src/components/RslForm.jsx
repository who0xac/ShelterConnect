import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  Box,
  TextField,
  Button,
  Typography,
  Grid,
  Paper,
  IconButton,
} from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import DeleteIcon from "@mui/icons-material/Delete";

// Import RSL API functions
import { createRSL, updateRSLById } from "../api/rslApi.js"; 
const RslForm = ({ onSuccess, onClose, initialData, editMode }) => {
  const navigate = useNavigate();

  // State for form data
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
    website: "",
    logo: null,
  });

  // State for logo preview
  const [logoPreview, setLogoPreview] = useState(null);

  // State for form errors
  const [errors, setErrors] = useState({});

  // Initialize form data if in edit mode
  useEffect(() => {
    if (editMode && initialData) {
      setFormData({
        ...initialData,
        logo: null, // Reset logo since we don't want to show the old one
      });

      // If there's a logo URL in initialData, set it as preview
      if (initialData.logo) {
        setLogoPreview(initialData.logo);
      }
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

  // Handle logo file upload
  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file size (5MB max)
      if (file.size > 5 * 1024 * 1024) {
        setErrors((prev) => ({
          ...prev,
          logo: "File size should not exceed 5MB",
        }));
        return;
      }

      // Validate file type (image only)
      if (!file.type.startsWith("image/")) {
        setErrors((prev) => ({
          ...prev,
          logo: "Please upload an image file",
        }));
        return;
      }

      // Update form data with the new logo file
      setFormData((prev) => ({
        ...prev,
        logo: file,
      }));

      // Create a preview of the logo
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Remove logo from form
  const removeLogo = () => {
    setFormData((prev) => ({
      ...prev,
      logo: null,
    }));
    setLogoPreview(null);
  };

  // Validate form fields
  const validateForm = () => {
    const newErrors = {};

    if (!formData.rslName.trim()) newErrors.rslName = "RSL Name is required";
    if (!formData.firstName.trim())
      newErrors.firstName = "First Name is required";
    if (!formData.lastName.trim()) newErrors.lastName = "Last Name is required";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.email))
      newErrors.email = "Invalid email format";
   if (!formData.phoneNumber.trim()) {
     newErrors.phoneNumber = "Phone Number is required";
   } else if (!/^\d{10}$/.test(formData.phoneNumber)) {
     newErrors.phoneNumber = "Phone Number must be exactly 10 digits";
   }
    if (!formData.addressLine1.trim())
      newErrors.addressLine1 = "Address is required";
    if (!formData.area.trim()) newErrors.area = "Area is required";
    if (!formData.city.trim()) newErrors.city = "City is required";
    if (!formData.postCode.trim()) newErrors.postCode = "Post Code is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0; 
  };

  // Handle form submission (using API functions)
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate form before submission
    if (!validateForm()) {
      return;
    }

    // Prepare form data (including logo if uploaded)
    const formDataToSend = new FormData();
    Object.keys(formData).forEach((key) => {
      if (key === "logo" && !formData[key] && editMode) {
        // Skip logo if it hasn't changed in edit mode
        return;
      }
      formDataToSend.append(key, formData[key]);
    });

    try {
      let result;

      // Use createRSL or updateRSLById based on editMode
      if (editMode) {
        result = await updateRSLById(initialData._id, formDataToSend);
      } else {
        result = await createRSL(formDataToSend);
      }

      // Handle API response
      // In RslForm.jsx, modify the handleSubmit function:
      if (result.success) {
        // Call onSuccess first to update the parent component's state
        if (onSuccess) {
          onSuccess();
        }

        // Use the toast with a callback on close
        toast.success(
          editMode
            ? "RSL updated successfully!"
            : "RSL registered successfully!",
          {
            position: "top-center",
            autoClose: 3000,
            onClose: () => {
              // Only close the dialog after the toast has finished
              if (onClose) {
                onClose();
              }
            },
          }
        );
      } else {
        toast.error(
          result.message || `Failed to ${editMode ? "update" : "register"} RSL`,
          {
            position: "top-center",
          }
        );
      }
    } catch (error) {
      if (error.response) {
        const errorMessage =
          error.response.data.message || error.response.statusText;

        // Check for MongoDB duplicate key error
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
              <Box sx={{ textAlign: "center", mb: 2 }}>
                {logoPreview ? (
                  <Box sx={{ position: "relative", display: "inline-block" }}>
                    <img
                      src={logoPreview}
                      alt="Logo Preview"
                      style={{
                        maxWidth: "200px",
                        maxHeight: "200px",
                        borderRadius: "8px",
                      }}
                    />
                    <IconButton
                      onClick={removeLogo}
                      sx={{
                        position: "absolute",
                        top: -12,
                        right: -12,
                        bgcolor: "background.paper",
                        boxShadow: 1,
                        "&:hover": { bgcolor: "grey.100" },
                      }}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                ) : (
                  <Button
                    component="label"
                    variant="outlined"
                    startIcon={<CloudUploadIcon />}
                    sx={{ p: 2 }}
                  >
                    Upload Logo
                    <input
                      type="file"
                      hidden
                      accept="image/*"
                      onChange={handleLogoChange}
                    />
                  </Button>
                )}
                {errors.logo && (
                  <Typography color="error" variant="body2" sx={{ mt: 1 }}>
                    {errors.logo}
                  </Typography>
                )}
              </Box>
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="RSL Name"
                name="rslName"
                value={formData.rslName}
                onChange={handleInputChange}
                error={!!errors.rslName}
                helperText={errors.rslName}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Website"
                name="website"
                value={formData.website}
                onChange={handleInputChange}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="First Name"
                name="firstName"
                value={formData.firstName}
                onChange={handleInputChange}
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
                label="Phone Number"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleInputChange}
                error={!!errors.phoneNumber}
                helperText={errors.phoneNumber}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Address Line 1"
                name="addressLine1"
                value={formData.addressLine1}
                onChange={handleInputChange}
                error={!!errors.addressLine1}
                helperText={errors.addressLine1}
              />
            </Grid>

            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Area"
                name="area"
                value={formData.area}
                onChange={handleInputChange}
                error={!!errors.area}
                helperText={errors.area}
              />
            </Grid>

            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="City"
                name="city"
                value={formData.city}
                onChange={handleInputChange}
                error={!!errors.city}
                helperText={errors.city}
              />
            </Grid>

            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Post Code"
                name="postCode"
                value={formData.postCode}
                onChange={handleInputChange}
                error={!!errors.postCode}
                helperText={errors.postCode}
              />
            </Grid>

            <Grid item xs={12}>
              <Button
                type="submit"
                variant="contained"
                size="large"
                sx={{
                  bgcolor: "#2ecc71",
                  "&:hover": { bgcolor: "#27ae60" },
                  width: "100%",
                  py: 1.5,
                }}
              >
                {editMode ? "Update RSL" : "Register RSL"}
              </Button>
            </Grid>
          </Grid>
        </form>
      </Paper>
     
    </Box>
  );
};

RslForm.propTypes = {
  onSuccess: PropTypes.func,
  onClose: PropTypes.func,
  initialData: PropTypes.object,
  editMode: PropTypes.bool,
};

export default RslForm;
