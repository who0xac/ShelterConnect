import React, { useState, useEffect } from "react";
import { getAllRSLs } from "../api/rslApi";
import { toast } from "react-toastify";
import { getUserRSLs, updateUserRSLs } from "../api/userApi";
import {
  Checkbox,
  FormControl,
  FormControlLabel,
  FormGroup,
  Grid,
  Paper,
  Typography,
  CircularProgress,
  FormLabel,
  Button,
  Box,
} from "@mui/material";
import SaveIcon from "@mui/icons-material/Save";

const AgentForm = ({ userId, onSuccess }) => {
  const [rslList, setRslList] = useState([]);
  const [rslLoading, setRslLoading] = useState(true);
  const [selectedRslIds, setSelectedRslIds] = useState([]);
  const [updateLoading, setUpdateLoading] = useState(false);

  useEffect(() => {
    if (!userId) return;

    const fetchData = async () => {
      setRslLoading(true);
      try {
        const [rslListResult, userRSLResult] = await Promise.all([
          getAllRSLs(),
          getUserRSLs(userId),
        ]);

        // Set the full RSL list
        if (rslListResult.success && Array.isArray(rslListResult.data)) {
          setRslList(rslListResult.data);
        } else {
          setRslList([]);
          toast.error(rslListResult.message || "Failed to load RSL list");
        }

        // Check if the userRSLResult contains the expected data
        if (userRSLResult.data && userRSLResult.data.rsls) {
          const userRSLIds = userRSLResult.data.rsls.map((rsl) =>
            String(rsl._id).trim()
          );
          setSelectedRslIds(userRSLIds);
        } else {
          toast.error(userRSLResult.message || "Failed to load user RSLs");
        }
      } catch (error) {
        toast.error("Error loading data");
      } finally {
        setRslLoading(false);
      }
    };

    fetchData();
  }, [userId]);

  const handleRSLChange = (rslId) => {
    const rslIdStr = String(rslId).trim();
    setSelectedRslIds((prev) =>
      prev.includes(rslIdStr)
        ? prev.filter((id) => id !== rslIdStr)
        : [...prev, rslIdStr]
    );
  };

  const handleUpdate = async () => {
    if (!userId) {
      toast.error("User ID is missing or invalid");
      return;
    }
    if (selectedRslIds.length === 0) {
      toast.warn("Please select at least one RSL before updating");
      return;
    }

    setUpdateLoading(true);
    try {
      const response = await updateUserRSLs(userId, selectedRslIds);
      if (response && response.success) {
        toast.success(
          response.message || "RSL selections updated successfully!"
        );
        onSuccess();
      } else {
        toast.error(response?.message || "Failed to update RSL selections");
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Network error during update"
      );
    } finally {
      setUpdateLoading(false);
    }
  };

  return (
    <Box sx={{ mt: 2 }}>
      {rslLoading ? (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "200px",
          }}
        >
          <CircularProgress />
        </Box>
      ) : (
        <Paper
          elevation={1}
          sx={{
            p: 2,
            maxHeight: "300px",
            overflowY: "auto",
            bgcolor: "#fafafa",
            borderRadius: "8px",
          }}
        >
          <FormControl component="fieldset" sx={{ width: "100%" }}>
            <FormLabel component="legend" sx={{ mb: 2 }}>
              Registered Social Landlords (RSL)
            </FormLabel>
            <FormGroup>
              <Grid container spacing={2}>
                {rslList.length === 0 ? (
                  <Grid item xs={12}>
                    <Typography color="textSecondary">
                      No RSL data available
                    </Typography>
                  </Grid>
                ) : (
                  rslList.map((rsl) => {
                    const rslIdStr = String(rsl._id).trim();
                    const isChecked = selectedRslIds.includes(rslIdStr);
                    return (
                      <Grid item xs={12} sm={6} md={4} key={rslIdStr}>
                        <FormControlLabel
                          control={
                            <Checkbox
                              checked={isChecked}
                              onChange={() => handleRSLChange(rsl._id)}
                              name={`rsl-${rslIdStr}`}
                              color="primary"
                            />
                          }
                          label={
                            <Box>
                              <Typography
                                variant="body2"
                                sx={{ fontWeight: 500 }}
                              >
                                {rsl.rslName || "Unnamed RSL"}
                              </Typography>
                              <Typography
                                variant="caption"
                                sx={{ color: "text.secondary" }}
                              >
                                {rsl.area || "Location not available"}
                              </Typography>
                            </Box>
                          }
                          sx={{
                            border: "1px solid #e0e0e0",
                            borderRadius: "4px",
                            p: 1,
                            width: "100%",
                            m: 0,
                          }}
                        />
                      </Grid>
                    );
                  })
                )}
              </Grid>
            </FormGroup>
          </FormControl>
          <Box sx={{ mt: 3, display: "flex", justifyContent: "flex-end" }}>
            <Button
              variant="contained"
              color="primary"
              onClick={handleUpdate}
              disabled={updateLoading || selectedRslIds.length === 0}
              startIcon={
                updateLoading ? <CircularProgress size={20} /> : <SaveIcon />
              }
            >
              {updateLoading ? "Updating..." : "Update Selections"}
            </Button>
          </Box>
        </Paper>
      )}
    </Box>
  );
};

export default AgentForm;
