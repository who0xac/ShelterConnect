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

  const handleChange = (event) => {
    const { name, value } = event.target;
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
      } else if (error.response.data?.errors && Array.isArray(error.response.data.errors)) {
        errorMessage = error.response.data.errors[0];
      }
    } else if (error.message) {
      errorMessage = error.message;
    }
    
    return errorMessage;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError(""); 
    
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
    <Container maxWidth="sm">
      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 2,
          mt: 4,
          mb: 4,
        }}
      >
        {/* Error Display */}
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

        {/* Form Fields */}
        <TextField
          required
          fullWidth
          label="Company Name"
          name="companyName"
          value={formData.companyName}
          onChange={handleChange}
        />

        <Stack spacing={2} direction={isSmallScreen ? "column" : "row"}>
          <TextField
            required
            fullWidth
            label="First Name"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
          />
          <TextField
            required
            fullWidth
            label="Last Name"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
          />
        </Stack>

        <Stack spacing={2} direction={isSmallScreen ? "column" : "row"}>
          <TextField
            required
            fullWidth
            label="Email"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
          />
          <TextField
            required
            fullWidth
            label="Password"
            name="password"
            type={showPassword ? "text" : "password"}
            value={formData.password}
            onChange={handleChange}
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
          required
          fullWidth
          label="Corresponding Email"
          type="email"
          name="correspondingEmail"
          value={formData.correspondingEmail}
          onChange={handleChange}
        />

        <TextField
          required
          fullWidth
          label="Address Line 1"
          name="addressLine1"
          value={formData.addressLine1}
          onChange={handleChange}
        />

        <Stack spacing={2} direction={isSmallScreen ? "column" : "row"}>
          <TextField
            required
            fullWidth
            label="Area"
            name="area"
            value={formData.area}
            onChange={handleChange}
          />
          <TextField
            required
            fullWidth
            label="City"
            name="city"
            value={formData.city}
            onChange={handleChange}
          />
        </Stack>

        <Stack spacing={2} direction={isSmallScreen ? "column" : "row"}>
          <TextField
            required
            fullWidth
            label="Post Code"
            name="postCode"
            value={formData.postCode}
            onChange={handleChange}
          />
          <TextField
            required
            fullWidth
            label="Phone Number"
            name="phoneNumber"
            value={formData.phoneNumber}
            onChange={handleChange}
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
      
      {/* ToastContainer for showing notifications */}
      <ToastContainer />
    </Container>
  );
};

export default Registration;
