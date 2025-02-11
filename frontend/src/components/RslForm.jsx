import React, { useState } from "react";
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

const RslForm = ({ onSuccess, onClose }) => {
  const navigate = useNavigate();

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
  const [logoPreview, setLogoPreview] = useState(null);
  const [errors, setErrors] = useState({});

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setErrors((prev) => ({
          ...prev,
          logo: "File size should not exceed 5MB",
        }));
        return;
      }

      if (!file.type.startsWith("image/")) {
        setErrors((prev) => ({
          ...prev,
          logo: "Please upload an image file",
        }));
        return;
      }

      setFormData((prev) => ({
        ...prev,
        logo: file,
      }));

      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeLogo = () => {
    setFormData((prev) => ({
      ...prev,
      logo: null,
    }));
    setLogoPreview(null);
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.rslName.trim()) newErrors.rslName = "RSL Name is required";
    if (!formData.firstName.trim())
      newErrors.firstName = "First Name is required";
    if (!formData.lastName.trim()) newErrors.lastName = "Last Name is required";
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Invalid email format";
    }
    if (!formData.phoneNumber.trim()) {
      newErrors.phoneNumber = "Phone Number is required";
    } else if (!/^\d{3}-\d{3}-\d{4}$/.test(formData.phoneNumber)) {
      newErrors.phoneNumber = "Phone format: 555-555-5555";
    }
    if (!formData.addressLine1.trim())
      newErrors.addressLine1 = "Address is required";
    if (!formData.area.trim()) newErrors.area = "Area is required";
    if (!formData.city.trim()) newErrors.city = "City is required";
    if (!formData.postCode.trim()) newErrors.postCode = "Post Code is required";
    if (formData.website && !/^https?:\/\/\S+\.\S+/.test(formData.website)) {
      newErrors.website = "Invalid website URL";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    const formDataToSend = new FormData();
    Object.keys(formData).forEach((key) => {
      formDataToSend.append(key, formData[key]);
    });

    try {
      const response = await fetch("http://localhost:3000/rsl", {
        method: "POST",
        body: formDataToSend,
      });

      const result = await response.json();

      if (result.success) {
        toast.success("RSL registered successfully!", {
          position: "top-center",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });

        // Call onSuccess prop to refresh parent component's data if provided
        if (onSuccess) {
          onSuccess();
        }

        // Automatically close the form after 2 seconds
        setTimeout(() => {
          if (onClose) {
            onClose(); 
          }
        }, 2000);

      } else {
        toast.error(result.message || "Failed to register RSL", {
          position: "top-center",
        });
      }
    } catch (error) {
      toast.error("Network error. Please try again.", {
        position: "top-center",
      });
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
                error={!!errors.website}
                helperText={errors.website}
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
                helperText={errors.phoneNumber || "Phone format: 555-555-5555"}
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
                Register RSL
              </Button>
            </Grid>
          </Grid>
        </form>
      </Paper>
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
  );
};

RslForm.propTypes = {
  onSuccess: PropTypes.func,
  onClose: PropTypes.func,
};

export default RslForm;
