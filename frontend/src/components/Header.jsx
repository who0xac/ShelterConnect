import React from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  Avatar,
  Menu,
  MenuItem,
} from "@mui/material";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";

const Header = ({ userName }) => {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const isMenuOpen = Boolean(anchorEl);

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const renderMenu = (
    <Menu
      anchorEl={anchorEl}
      anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      transformOrigin={{ vertical: "top", horizontal: "right" }}
      open={isMenuOpen}
      onClose={handleMenuClose}
      PaperProps={{
        sx: {
          mt: 1.5,
          width: 220,
          borderRadius: "12px",
          boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.15)",
          overflow: "visible",
          "&:before": {
            content: '""',
            display: "block",
            position: "absolute",
            top: 0,
            right: 14,
            width: 10,
            height: 10,
            bgcolor: "background.paper",
            transform: "translateY(-50%) rotate(45deg)",
            zIndex: 0,
          },
        },
      }}
    >
      {/* User Info */}
      <MenuItem disabled sx={{ opacity: 0.8, py: 1.5 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <AccountCircleIcon fontSize="small" />
          <Typography variant="body2">{userName}</Typography>
        </Box>
      </MenuItem>
    </Menu>
  );

  return (
    <AppBar
      position="fixed"
      sx={{
        bgcolor: "background.paper",
        color: "text.primary",
        boxShadow: "0px 2px 10px rgba(0, 0, 0, 0.1)",
        backdropFilter: "blur(8px)",
        WebkitBackdropFilter: "blur(8px)",
        borderBottom: "1px solid rgba(0, 0, 0, 0.05)",
      }}
    >
      <Toolbar
        sx={{
          display: "flex",
          justifyContent: "flex-end",
          alignItems: "center",
          px: 3,
        }}
      >
        {/* User Profile */}
        <Box
          onClick={handleProfileMenuOpen}
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
            cursor: "pointer",
            borderRadius: "20px",
            p: 0.5,
            transition: "background 0.2s",
            "&:hover": {
              bgcolor: "action.hover",
            },
          }}
        >
          <Avatar
            sx={{
              bgcolor: "primary.main",
              width: 36,
              height: 36,
              transition: "transform 0.2s",
              "&:hover": {
                transform: "scale(1.1)",
              },
            }}
          >
            <AccountCircleIcon />
          </Avatar>
          <Typography
            variant="body1"
            sx={{
              fontFamily: "Inter, sans-serif",
              fontWeight: 500,
              display: { xs: "none", sm: "block" },
              color: "text.primary",
            }}
          >
            Hi, {userName}
          </Typography>
        </Box>
      </Toolbar>

      {renderMenu}
    </AppBar>
  );
};

export default Header;
