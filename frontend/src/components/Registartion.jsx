import React, { useState } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  Container,
  InputAdornment,
  IconButton,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";

const Registration = ({ onBackToLogin }) => {
  const [showPassword, setShowPassword] = useState(false);
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

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log("Form submitted:", formData);
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
        <TextField
          required
          fullWidth
          label="Company name"
          name="companyName"
          value={formData.companyName}
          onChange={handleChange}
        />

        <Box sx={{ display: "flex", gap: 2 }}>
          <TextField
            required
            fullWidth
            label="First name"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
          />
          <TextField
            required
            fullWidth
            label="Last name"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
          />
        </Box>

        <Box sx={{ display: "flex", gap: 2 }}>
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
        </Box>

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

        <Box sx={{ display: "flex", gap: 2 }}>
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
        </Box>

        <Box sx={{ display: "flex", gap: 2 }}>
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
        </Box>

        <Button
          type="submit"
          variant="contained"
          fullWidth
          sx={{
            mt: 2,
            mb: 2,
            py: 1.5,
            backgroundColor: "#1976d2",
            "&:hover": {
              backgroundColor: "#1565c0",
            },
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
    </Container>
  );
};

export default Registration;
