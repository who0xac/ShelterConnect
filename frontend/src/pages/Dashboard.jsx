import React from "react";
import {
  Box,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";

const DashboardPage = () => {
  const [openLogoutDialog, setOpenLogoutDialog] = React.useState(false);

  const handleLogoutConfirmation = () => {
    setOpenLogoutDialog(true);
  };

  const handleCloseLogoutDialog = () => {
    setOpenLogoutDialog(false);
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        bgcolor: "#f5f5f5",
        p: 4,
      }}
    >
      <Typography variant="h4" sx={{ mb: 3, fontWeight: 600 }}>
        Welcome, User
      </Typography>

      <Grid container spacing={4} sx={{ width: "100%", maxWidth: 1200 }}>
        {/* Profile Summary Card */}
        <Grid item xs={12} sm={6} md={4}>
          <Card
            sx={{
              maxWidth: 345,
              height: "100%",
              boxShadow: 3,
              "&:hover": { boxShadow: 6 },
            }}
          >
            <CardContent>
              <Typography variant="h5" component="div" sx={{ mb: 2 }}>
                Profile Summary
              </Typography>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  mb: 2,
                }}
              >
                <img
                  src="https://via.placeholder.com/100"
                  alt="Profile"
                  style={{
                    width: 100,
                    height: 100,
                    borderRadius: "50%",
                    objectFit: "cover",
                  }}
                />
              </Box>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                Name: John Doe
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                Email: john.doe@example.com
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Activity Summary Card */}
        <Grid item xs={12} sm={6} md={4}>
          <Card
            sx={{
              maxWidth: 345,
              height: "100%",
              boxShadow: 3,
              "&:hover": { boxShadow: 6 },
            }}
          >
            <CardContent>
              <Typography variant="h5" component="div" sx={{ mb: 2 }}>
                Activity Summary
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                Total Activities: 15
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                Last Activity: 2 days ago
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Notifications Card */}
        <Grid item xs={12} sm={6} md={4}>
          <Card
            sx={{
              maxWidth: 345,
              height: "100%",
              boxShadow: 3,
              "&:hover": { boxShadow: 6 },
            }}
          >
            <CardContent>
              <Typography variant="h5" component="div" sx={{ mb: 2 }}>
                Notifications
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                You have 5 unread notifications.
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Logout Button */}
      <Box sx={{ mt: 4 }}>
        <Button
          variant="contained"
          color="secondary"
          onClick={handleLogoutConfirmation}
        >
          Logout
        </Button>
      </Box>

      {/* Logout Confirmation Dialog */}
      <Dialog open={openLogoutDialog} onClose={handleCloseLogoutDialog}>
        <DialogTitle>Confirm Logout</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to logout?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseLogoutDialog}>Cancel</Button>
          <Button
            onClick={() => (window.location.href = "/")}
            color="secondary"
          >
            Logout
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default DashboardPage;
