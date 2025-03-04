import React, { useState, useEffect } from "react";
import { getAllRSLs } from "../api/rslApi";
import { toast } from "react-toastify";
import {
  Box,
  Checkbox,
  FormControl,
  FormControlLabel,
  FormGroup,
  Grid,
  Paper,
  Typography,
  CircularProgress,
  FormLabel,
} from "@mui/material";

const AgentForm = () => {
  const [rslList, setRslList] = useState([]);
  const [rslLoading, setRslLoading] = useState(true);
  const [selectedRslIds, setSelectedRslIds] = useState([]);

  useEffect(() => {
    fetchRSLList();
  }, []);

  const fetchRSLList = async () => {
    setRslLoading(true);
    try {
      const result = await getAllRSLs();
      console.log("API Response:", result); // Log the API response
      if (result.success && Array.isArray(result.data)) {
        setRslList(result.data);
      } else {
        setRslList([]);
        toast.error("Failed to load RSL list");
      }
    } catch (error) {
      console.error("Error fetching RSL list:", error);
      toast.error("Network error while loading RSL list");
      setRslList([]);
    } finally {
      setRslLoading(false);
    }
  };

  const handleRSLChange = (rslId) => {
    setSelectedRslIds((prev) =>
      prev.includes(rslId)
        ? prev.filter((id) => id !== rslId)
        : [...prev, rslId]
    );
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
              Select Real Estate Service Licensees (RSL)
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
                  rslList.map((rsl) => (
                    <Grid item xs={12} sm={6} md={4} key={rsl._id}>
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={selectedRslIds.includes(rsl._id)}
                            onChange={() => handleRSLChange(rsl._id)}
                            name={`rsl-${rsl._id}`}
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
                  ))
                )}
              </Grid>
            </FormGroup>
          </FormControl>
        </Paper>
      )}
    </Box>
  );
};

export default AgentForm;
