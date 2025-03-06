import React from "react";
import { Box, Typography, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";

const NotFoundPage = () => {
  const navigate = useNavigate();

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
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          width: "100%",
          maxWidth: "500px",
          bgcolor: "white",
          borderRadius: "16px",
          overflow: "hidden",
          boxShadow: "0 12px 24px rgba(0, 0, 0, 0.3)",
          zIndex: 2,
          p: 4,
          textAlign: "center",
          transition: "transform 0.3s ease, box-shadow 0.3s ease",
          "&:hover": {
            transform: "translateY(-5px)",
            boxShadow: "0 16px 32px rgba(0, 0, 0, 0.4)",
          },
        }}
      >
        <Typography
          variant="h1"
          sx={{
            fontSize: "8rem",
            fontWeight: "bold",
            color: "#1a237e",
            mb: 2,
          }}
        >
          404
        </Typography>
        <Typography
          variant="h4"
          sx={{
            color: "#1a237e",
            mb: 2,
            fontWeight: 600,
          }}
        >
          Page Not Found
        </Typography>
        <Typography
          variant="body1"
          sx={{
            color: "text.secondary",
            mb: 3,
            maxWidth: "350px",
          }}
        >
          Oops! The page you are looking for does not exist or has been moved.
        </Typography>
        <Button
          variant="contained"
          onClick={() => navigate("/")}
          sx={{
            bgcolor: "#1a237e",
            color: "white",
            textTransform: "none",
            py: 1.5,
            px: 4,
            borderRadius: "8px",
            "&:hover": {
              bgcolor: "#0d1380",
            },
          }}
        >
          Back to Login
        </Button>
      </Box>
    </Box>
  );
};

export default NotFoundPage;
