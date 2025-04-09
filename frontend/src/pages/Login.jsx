import React, { useState, useEffect } from "react";
import { Box, TextField, Button, Typography, IconButton } from "@mui/material";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import VisibilityOffOutlinedIcon from "@mui/icons-material/VisibilityOffOutlined";
import { ToastContainer, toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import Registration from "../components/Registartion";
import { loginUser } from "../api/userApi.js";
import "react-toastify/dist/ReactToastify.css";

const LoginPage = () => {
  const navigate = useNavigate();
  const [showRegistration, setShowRegistration] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    document.body.style.overflow = showRegistration ? "hidden" : "auto";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [showRegistration]);

  const handleLogin = async () => {
    try {
      const data = await loginUser(email, password);
      window.__logoutTimers?.forEach((timer) => clearTimeout(timer));

      localStorage.setItem("token", data.token);
      const expiresAt = Date.now() + 7 * 24 * 60 * 60 * 1000;
      localStorage.setItem("expiresAt", expiresAt);
      toast.success("Login successful! Redirecting to dashboard...");
      setTimeout(() => {
        window.location.href = "/dashboard";
      }, 1000);
    } catch (error) {
      console.log("Error", error);
    toast.error("Kindly complete all required fields.", {
      autoClose: 3000, 
    });
      setError("Invalid email or password. Please try again.");
    }
  };

  const autoLogout = (expiresAt) => {
    const timeout = expiresAt - Date.now();

    if (timeout > 0) {
      const timer = setTimeout(() => {
        localStorage.clear();
        window.location.href = "/"; 
      }, timeout);

      window.__logoutTimers = window.__logoutTimers || [];
      window.__logoutTimers.push(timer);
    }
  };

  useEffect(() => {
    const expiresAt = localStorage.getItem("expiresAt");
    if (expiresAt) {
      autoLogout(parseInt(expiresAt));
    }
  }, []);
  return (
    <Box
      sx={{
        margin: 0,
        padding: 0,
        minHeight: "100vh",
        width: "100vw",
        position: "fixed",
        top: 0,
        left: 0,
        overflow: "hidden",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        "&::before": {
          content: '""',
          position: "absolute",
          top: 0,
          left: 0,
          width: "100vw",
          height: "100vh",
          backgroundImage: 'url("../src/assets/images/resident.jpg")',
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          zIndex: 0,
          filter: "brightness(0.6) saturate(1.2)",
        },
        "&::after": {
          content: '""',
          position: "absolute",
          top: 0,
          left: 0,
          width: "100vw",
          height: "100vh",
          backgroundColor: "rgba(0, 0, 0, 0.4)",
          zIndex: 1,
        },
      }}
    >
      {/* Toast Container */}
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />

      {/* Rest of the code */}
      <Box
        sx={{
          display: "flex",
          width: "100%",
          maxWidth: "900px",
          minHeight: "500px",
          bgcolor: "white",
          borderRadius: "16px",
          overflow: "hidden",
          boxShadow: "0 12px 24px rgba(0, 0, 0, 0.3)",
          zIndex: 2,
          mx: 2,
          mt: 2,
          mb: 4,
          maxHeight: "700px",
          transition: "transform 0.3s ease, box-shadow 0.3s ease",
          "&:hover": {
            transform: "translateY(-5px)",
            boxShadow: "0 16px 32px rgba(0, 0, 0, 0.4)",
          },
        }}
      >
        {/* Left Section */}
        <Box
          sx={{
            flex: 1,
            bgcolor: "#1a237e",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "column",
            p: 4,
          }}
        >
          <Box
            component="img"
            src="../src/assets/icons/shelterconnect-removebg.png"
            alt="ShelterConnect Logo"
            sx={{
              width: "100%",
              maxWidth: "400px",
              height: "auto",
              filter: "invert(1) brightness(2) contrast(2)",
              mb: 2,
              animation: "float 4s ease-in-out infinite",
              "@keyframes float": {
                "0%, 100%": { transform: "translateY(0)" },
                "50%": { transform: "translateY(-10px)" },
              },
            }}
          />
          <Typography
            variant="h5"
            sx={{
              color: "white",
              fontWeight: 600,
              textAlign: "center",
              mt: 2,
            }}
          >
            Welcome Back!
          </Typography>
          <Typography
            variant="body1"
            sx={{
              color: "rgba(255, 255, 255, 0.8)",
              textAlign: "center",
              mt: 1,
            }}
          >
            Sign in to continue to your account.
          </Typography>
        </Box>

        {/* Right Section */}
        <Box
          sx={{
            flex: 1,
            p: 4,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            bgcolor: "background.paper",
          }}
        >
          {showRegistration ? (
            <Box sx={{ margin: 0 }}>
              <Registration onBackToLogin={() => setShowRegistration(false)} />
            </Box>
          ) : (
            <>
              <Box sx={{ mb: 4, textAlign: "center" }}>
                <Typography
                  variant="h4"
                  component="h1"
                  sx={{
                    fontWeight: 800,
                    color: "#1a237e",
                    mb: 2,
                    fontFamily: "'DM Serif Text', sans-serif",
                    letterSpacing: "4px",
                  }}
                >
                  ShelterConnect
                </Typography>
              </Box>

              {error && (
                <Typography
                  sx={{
                    color: "error.main",
                    mb: 2,
                    textAlign: "center",
                    backgroundColor: "rgba(255, 0, 0, 0.1)",
                    padding: "8px",
                    borderRadius: "4px",
                  }}
                >
                  {error}
                </Typography>
              )}

              <TextField
                fullWidth
                label="Email"
                variant="outlined"
                margin="normal"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                sx={{
                  mb: 2,
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "8px",
                    "& fieldset": {
                      borderColor: "#ddd",
                    },
                    "&:hover fieldset": {
                      borderColor: "#1a237e",
                    },
                  },
                }}
              />

              <Box sx={{ position: "relative", mb: 2 }}>
                <TextField
                  fullWidth
                  label="Password"
                  type={showPassword ? "text" : "password"}
                  variant="outlined"
                  margin="normal"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: "8px",
                    },
                  }}
                />
                <IconButton
                  onClick={() => setShowPassword(!showPassword)}
                  sx={{
                    position: "absolute",
                    right: 8,
                    top: "50%",
                    transform: "translateY(-50%)",
                    color: "#666",
                  }}
                >
                  {showPassword ? (
                    <VisibilityOffOutlinedIcon />
                  ) : (
                    <VisibilityOutlinedIcon />
                  )}
                </IconButton>
              </Box>

              <Button
                fullWidth
                variant="contained"
                sx={{
                  mt: 4,
                  mb: 2,
                  bgcolor: "#1a237e",
                  textTransform: "none",
                  py: 1.5,
                  fontSize: "1rem",
                  borderRadius: "8px",
                }}
                onClick={handleLogin}
              >
                Login
              </Button>

              {/* Links for Forgot Password and Registration */}
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  mt: 2,
                }}
              >
                {/* <Typography
                  component="button"
                  onClick={() => navigate("/forgot-password")}
                  sx={{
                    color: "#666",
                    fontSize: "0.9rem",
                    textDecoration: "none",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    mb: 1,
                    "&:hover": {
                      textDecoration: "underline",
                    },
                  }}
                >
                  Forgot Password?
                </Typography> */}
                <Typography
                  component="button"
                  onClick={() => setShowRegistration(true)}
                  sx={{
                    color: "#666",
                    fontSize: "0.9rem",
                    textDecoration: "none",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    "&:hover": {
                      textDecoration: "underline",
                    },
                  }}
                >
                  Get New Managing Agent Account?
                </Typography>
              </Box>
            </>
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default LoginPage;
