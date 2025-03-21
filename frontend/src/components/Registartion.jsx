import React, { useState } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  Container,
  InputAdornment,
  IconButton,
  Stack,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { registerUser } from "../api/userApi.js";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Registration = ({ onBackToLogin }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});

  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));

  const [formData, setFormData] = useState({
    companyName: "",
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    correspondingEmail: "",
    addressLine1: "",
    area: "",
    city: "",
    postCode: "",
    phoneNumber: "",
  });

  const customErrorMessages = {
    companyName: "Please enter your company name.",
    firstName: "Please enter your first name.",
    lastName: "Please enter your last name.",
    email: "Please enter a valid email address.",
    password: "Please enter a password.",
    correspondingEmail: "Please enter your corresponding email.",
    addressLine1: "Please enter your address.",
    area: "Please enter your area.",
    city: "Please enter your city.",
    postCode: "Please enter your post code.",
    phoneNumber: "Please enter your phone number.",
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFieldErrors((prev) => ({ ...prev, [name]: "" }));
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const extractErrorMessage = (error) => {
    let errorMessage = "Failed to register user. Please try again.";
    if (error.response) {
      if (typeof error.response.data === "string") {
        errorMessage = error.response.data;
      } else if (error.response.data?.error?.message) {
        errorMessage = error.response.data.error.message;
      } else if (error.response.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.response.data?.error) {
        errorMessage = error.response.data.error;
      } else if (
        error.response.data?.errors &&
        Array.isArray(error.response.data.errors)
      ) {
        errorMessage = error.response.data.errors[0];
      }
    } else if (error.message) {
      errorMessage = error.message;
    }
    return errorMessage;
  };

  const validateForm = () => {
    const errors = {};
    Object.keys(formData).forEach((field) => {
      if (!formData[field].trim()) {
        errors[field] = customErrorMessages[field] || "This field is required.";
      }
    });
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    if (!validateForm()) {
      toast.error("Please fix the errors in the form.");
      return;
    }

    try {
      const response = await registerUser(formData);
      console.log("User registered successfully:", response);
      toast.success("User registered successfully!");
      setFormData({
        companyName: "",
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        correspondingEmail: "",
        addressLine1: "",
        area: "",
        city: "",
        postCode: "",
        phoneNumber: "",
      });
      setFieldErrors({});

      setTimeout(() => {
        onBackToLogin();
      }, 3000);
    } catch (error) {
      console.error("Error registering user:", error);
      const errorMessage = extractErrorMessage(error);
      setError(errorMessage);
      toast.error(errorMessage);
    }
  };

  const handleTogglePassword = () => {
    setShowPassword((prev) => !prev);
  };

  return (
    <Container maxWidth="md">
      <Box
        sx={{
          height: "70vh",
          overflowY: "auto",
          mt: 4,
          mb: 4,
          pr: 2,
          scrollbarWidth: "thin",
          "&::-webkit-scrollbar": {
            width: "8px",
          },
          "&::-webkit-scrollbar-track": {
            background: "#f1f1f1",
          },
          "&::-webkit-scrollbar-thumb": {
            background: "#888",
            borderRadius: "4px",
          },
          "&::-webkit-scrollbar-thumb:hover": {
            background: "#555",
          },
        }}
      >
        <Box
          component="form"
          onSubmit={handleSubmit}
          noValidate
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 2,
            p: 3,
          }}
        >
          {error && (
            <Typography
              sx={{
                color: "error.main",
                mb: 2,
                textAlign: "center",
                padding: "8px",
                backgroundColor: "rgba(255, 0, 0, 0.1)",
                borderRadius: "4px",
              }}
            >
              {error}
            </Typography>
          )}

          <TextField
            fullWidth
            label="Company Name"
            name="companyName"
            value={formData.companyName}
            onChange={handleChange}
            error={Boolean(fieldErrors.companyName)}
            helperText={fieldErrors.companyName}
          />

          <Stack spacing={2} direction={isSmallScreen ? "column" : "row"}>
            <TextField
              fullWidth
              label="First Name"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              error={Boolean(fieldErrors.firstName)}
              helperText={fieldErrors.firstName}
            />
            <TextField
              fullWidth
              label="Last Name"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              error={Boolean(fieldErrors.lastName)}
              helperText={fieldErrors.lastName}
            />
          </Stack>

          <Stack spacing={2} direction={isSmallScreen ? "column" : "row"}>
            <TextField
              fullWidth
              label="Email"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              error={Boolean(fieldErrors.email)}
              helperText={fieldErrors.email}
            />
            <TextField
              fullWidth
              label="Password"
              name="password"
              type={showPassword ? "text" : "password"}
              value={formData.password}
              onChange={handleChange}
              error={Boolean(fieldErrors.password)}
              helperText={fieldErrors.password}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={handleTogglePassword} edge="end">
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </Stack>

          <TextField
            fullWidth
            label="Corresponding Email"
            type="email"
            name="correspondingEmail"
            value={formData.correspondingEmail}
            onChange={handleChange}
            error={Boolean(fieldErrors.correspondingEmail)}
            helperText={fieldErrors.correspondingEmail}
          />

          <TextField
            fullWidth
            label="Address Line 1"
            name="addressLine1"
            value={formData.addressLine1}
            onChange={handleChange}
            error={Boolean(fieldErrors.addressLine1)}
            helperText={fieldErrors.addressLine1}
          />

          <Stack spacing={2} direction={isSmallScreen ? "column" : "row"}>
            <TextField
              fullWidth
              label="Area"
              name="area"
              value={formData.area}
              onChange={handleChange}
              error={Boolean(fieldErrors.area)}
              helperText={fieldErrors.area}
            />
            <TextField
              fullWidth
              label="City"
              name="city"
              value={formData.city}
              onChange={handleChange}
              error={Boolean(fieldErrors.city)}
              helperText={fieldErrors.city}
            />
          </Stack>

          <Stack spacing={2} direction={isSmallScreen ? "column" : "row"}>
            <TextField
              fullWidth
              label="Post Code"
              name="postCode"
              value={formData.postCode}
              onChange={handleChange}
              error={Boolean(fieldErrors.postCode)}
              helperText={fieldErrors.postCode}
            />
            <TextField
              fullWidth
              label="Phone Number"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleChange}
              error={Boolean(fieldErrors.phoneNumber)}
              helperText={fieldErrors.phoneNumber}
            />
          </Stack>

          <Button
            type="submit"
            variant="contained"
            fullWidth
            sx={{
              mt: 2,
              mb: 2,
              py: 1.5,
              backgroundColor: "#1976d2",
              "&:hover": { backgroundColor: "#1565c0" },
            }}
          >
            Create Account
          </Button>

          <Typography align="center" color="textSecondary">
            Already have an Account?{" "}
            <Button
              onClick={onBackToLogin}
              sx={{
                textTransform: "none",
                color: "#1976d2",
                p: 0,
                minWidth: "auto",
                "&:hover": {
                  background: "none",
                  textDecoration: "underline",
                },
              }}
            >
              Sign in
            </Button>
          </Typography>
        </Box>
      </Box>
      <ToastContainer />
    </Container>
  );
};

export default Registration;
