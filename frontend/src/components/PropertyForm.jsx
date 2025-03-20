import React, { useState, useEffect } from "react";
import {
  Box,
  Grid,
  TextField,
  Button,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  CircularProgress,
  Checkbox,
  Typography,
  MenuItem,
  Divider,
} from "@mui/material";
import { toast } from "react-toastify";
import { createProperty, updatePropertyById } from "../api/propertyApi";
import { getRSLNames } from "../api/rslApi";

const PropertyForm = ({ onSuccess, onClose, initialData, editMode }) => {
  const [loading, setLoading] = useState(false);
  const [rslOptions, setRslOptions] = useState([]);
  const [showOtherInfo, setShowOtherInfo] = useState(false);
  const [formData, setFormData] = useState({
    responsibleForCouncilTax: "RSL/Housing provider",
    rslTypeGroup: null,
    address: "",
    noOfBedrooms: "",
    area: "",
    city: "",
    postCode: "",
    basicRent: "",
    totalServiceCharges: "",
    totalEligibleRent: "",
    weeklyIneligibleCharge: "",
    sharedWithOther: false,
    bedsit: false,
    selfContainedFlat: false,
    quantityOfFloors: 1,
    unfurnished: false,
    partFurnished: false,
    fullyFurnished: false,
    centralHeating: false,
    garden: false,
    garageParkingSpace: false,
    accommodationLocation: "",
    accommodationFloor: "",
    totalLivingRooms: 0,
    livingRoomsYourUse: 0,
    livingRoomsCommunal: 0,
    totalBedsitRooms: 0,
    bedsitYourUse: 0,
    bedsitCommunal: 0,
    totalBedrooms: 0,
    bedroomsYourUse: 0,
    bedroomsCommunal: 0,
    totalBathrooms: 0,
    bathroomsYourUse: 0,
    bathroomsCommunal: 0,
    totalToilets: 0,
    toiletsYourUse: 0,
    toiletsCommunal: 0,
    totalKitchens: 0,
    kitchensYourUse: 0,
    kitchensCommunal: 0,
    totalOtherRooms: 0,
    otherRoomsYourUse: 0,
    otherRoomsCommunal: 0,
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const loadRSLs = async () => {
      try {
        const rslData = await getRSLNames();
        setRslOptions(rslData);
      } catch (error) {
        console.error("Error loading RSLs:", error);
      }
    };

    loadRSLs();

    if (initialData && editMode) {
      setFormData({
        ...initialData,
        rslTypeGroup: initialData.rslTypeGroup?.id || initialData.rslTypeGroup,
      });
    }
  }, [initialData, editMode]);

  useEffect(() => {
    if (formData.basicRent && formData.totalServiceCharges) {
      const basicRent = parseFloat(formData.basicRent) || 0;
      const serviceCharges = parseFloat(formData.totalServiceCharges) || 0;
      const eligibleRent = basicRent + serviceCharges;

      setFormData((prev) => ({
        ...prev,
        totalEligibleRent: eligibleRent.toFixed(2),
      }));
    }
  }, [formData.basicRent, formData.totalServiceCharges]);

  const validate = () => {
    const newErrors = {};

    // Basic Details
    if (!formData.rslTypeGroup) newErrors.rslTypeGroup = "RSL is required";
    if (!formData.responsibleForCouncilTax)
      newErrors.responsibleForCouncilTax =
        "Council tax responsibility is required";
    if (!formData.address.trim()) newErrors.address = "Address is required";
    if (!formData.area.trim()) newErrors.area = "Area is required";
    if (!formData.city.trim()) newErrors.city = "City is required";
    if (!formData.postCode.trim()) {
      newErrors.postCode = "Postcode is required";
    } else if (!/^[A-Z]{1,2}\d[A-Z\d]? ?\d[A-Z]{2}$/i.test(formData.postCode)) {
      newErrors.postCode = "Invalid UK postcode format";
    }
    if (!formData.noOfBedrooms)
      newErrors.noOfBedrooms = "Number of bedrooms is required";

    // Financial Details
    if (!formData.basicRent) newErrors.basicRent = "Basic rent is required";
    if (!formData.totalServiceCharges)
      newErrors.totalServiceCharges = "Service charges are required";
    if (!formData.weeklyIneligibleCharge)
      newErrors.weeklyIneligibleCharge = "Weekly ineligible charge is required";

    // Other Information
    if (showOtherInfo) {
      if (!formData.quantityOfFloors)
        newErrors.quantityOfFloors = "Number of floors is required";
      if (
        !(
          formData.unfurnished ||
          formData.partFurnished ||
          formData.fullyFurnished
        )
      ) {
        newErrors.furnishing =
          "At least one furnishing option must be selected";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    // Clear error for the current field
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleRadioChange = (name, value) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value === "yes",
    }));

    // Clear error for the current field
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) {
      toast.error("Please correct the errors in the form");
      return;
    }

    setLoading(true);
    try {
      const submissionData = {
        ...formData,
        rslTypeGroup: formData.rslTypeGroup,
      };

      if (editMode) {
        const result = await updatePropertyById(
          initialData._id,
          submissionData
        );
        if (result.success) toast.success("Property updated successfully!");
      } else {
        const result = await createProperty(submissionData);
        if (result.success) toast.success("Property added successfully!");
      }
      onSuccess();
    } catch (error) {
      toast.error(error.response?.data?.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  // Reusable Radio Group Component
  const renderRadioGroup = (name, label, value, onChange) => (
    <FormControl fullWidth error={!!errors[name]}>
      <FormLabel>{label}</FormLabel>
      <RadioGroup row value={value} onChange={onChange}>
        <FormControlLabel value="yes" control={<Radio />} label="Yes" />
        <FormControlLabel value="no" control={<Radio />} label="No" />
      </RadioGroup>
      {errors[name] && (
        <Typography color="error" variant="caption">
          {errors[name]}
        </Typography>
      )}
    </FormControl>
  );

  return (
    <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 2 }}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Typography variant="h6">Property Details</Typography>
          <Divider sx={{ mb: 2 }} />
        </Grid>

        {/* Basic Property Details */}
        <Grid item xs={12}>
          <FormControl
            fullWidth
            required
            error={!!errors.responsibleForCouncilTax}
          >
            <FormLabel>Who is responsible for Council Tax?</FormLabel>
            <RadioGroup
              name="responsibleForCouncilTax"
              value={formData.responsibleForCouncilTax}
              onChange={handleChange}
              row
            >
              <FormControlLabel
                value="RSL/Housing provider"
                control={<Radio />}
                label="RSL/Housing provider"
              />
              <FormControlLabel
                value="Tenant"
                control={<Radio />}
                label="Tenant"
              />
            </RadioGroup>
            {errors.responsibleForCouncilTax && (
              <Typography color="error" variant="caption">
                {errors.responsibleForCouncilTax}
              </Typography>
            )}
          </FormControl>
        </Grid>

        <Grid item xs={12}>
          <TextField
            select
            fullWidth
            label="RSL Type"
            name="rslTypeGroup"
            value={formData.rslTypeGroup || ""}
            onChange={(e) => {
              setFormData((prev) => ({
                ...prev,
                rslTypeGroup: e.target.value,
              }));
            }}
            error={!!errors.rslTypeGroup}
            helperText={errors.rslTypeGroup}
            required
          >
            {Array.isArray(rslOptions) &&
              rslOptions.map((rsl) => (
                <MenuItem key={rsl._id || rsl.id} value={rsl._id || rsl.id}>
                  {rsl.rslName || rsl.name}
                </MenuItem>
              ))}
          </TextField>
        </Grid>

        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Address"
            name="address"
            value={formData.address}
            onChange={handleChange}
            error={!!errors.address}
            helperText={errors.address}
            required
          />
        </Grid>

        <Grid item xs={12} md={4}>
          <TextField
            fullWidth
            label="Area"
            name="area"
            value={formData.area}
            onChange={handleChange}
            error={!!errors.area}
            helperText={errors.area}
            required
          />
        </Grid>

        <Grid item xs={12} md={4}>
          <TextField
            fullWidth
            label="City"
            name="city"
            value={formData.city}
            onChange={handleChange}
            error={!!errors.city}
            helperText={errors.city}
            required
          />
        </Grid>

        <Grid item xs={12} md={4}>
          <TextField
            fullWidth
            label="Postcode"
            name="postCode"
            value={formData.postCode}
            onChange={handleChange}
            error={!!errors.postCode}
            helperText={errors.postCode || "Format: EC1A 1BB"}
            required
          />
        </Grid>

        {/* Radio Groups */}
        <Grid item xs={12} md={4}>
          {renderRadioGroup(
            "bedsit",
            "Bedsit",
            formData.bedsit ? "yes" : "no",
            (e) => handleRadioChange("bedsit", e.target.value)
          )}
        </Grid>

        <Grid item xs={12} md={4}>
          {renderRadioGroup(
            "selfContainedFlat",
            "Self-contained Flat",
            formData.selfContainedFlat ? "yes" : "no",
            (e) => handleRadioChange("selfContainedFlat", e.target.value)
          )}
        </Grid>

        <Grid item xs={12} md={4}>
          {renderRadioGroup(
            "sharedWithOther",
            "Shared with Others",
            formData.sharedWithOther ? "yes" : "no",
            (e) => handleRadioChange("sharedWithOther", e.target.value)
          )}
        </Grid>

        {/* Number of Bedrooms */}
        <Grid item xs={12} md={3}>
          <TextField
            fullWidth
            label="Number of Bedrooms"
            name="noOfBedrooms"
            type="number"
            inputProps={{ min: 0 }}
            value={formData.noOfBedrooms}
            onChange={handleChange}
            error={!!errors.noOfBedrooms}
            helperText={errors.noOfBedrooms}
            required
          />
        </Grid>

        {/* Financial Details */}
        <Grid item xs={12}>
          <Typography variant="h6" sx={{ mt: 2 }}>
            Financial Details
          </Typography>
          <Divider sx={{ mb: 2 }} />
        </Grid>

        <Grid item xs={12} md={3}>
          <TextField
            fullWidth
            label="Basic Rent"
            name="basicRent"
            type="number"
            inputProps={{ min: 0, step: "0.01" }}
            value={formData.basicRent}
            onChange={handleChange}
            error={!!errors.basicRent}
            helperText={errors.basicRent}
            required
          />
        </Grid>

        <Grid item xs={12} md={3}>
          <TextField
            fullWidth
            label="Service Charges"
            name="totalServiceCharges"
            type="number"
            inputProps={{ min: 0, step: "0.01" }}
            value={formData.totalServiceCharges}
            onChange={handleChange}
            error={!!errors.totalServiceCharges}
            helperText={errors.totalServiceCharges}
            required
          />
        </Grid>

        <Grid item xs={12} md={3}>
          <TextField
            fullWidth
            label="Eligible Rent"
            name="totalEligibleRent"
            type="number"
            inputProps={{ min: 0, step: "0.01", readOnly: true }}
            value={formData.totalEligibleRent}
            InputProps={{ readOnly: true }}
          />
        </Grid>

        <Grid item xs={12} md={3}>
          <TextField
            fullWidth
            label="Weekly Ineligible Charge"
            name="weeklyIneligibleCharge"
            type="number"
            inputProps={{ min: 0, step: "0.01" }}
            value={formData.weeklyIneligibleCharge}
            onChange={handleChange}
            error={!!errors.weeklyIneligibleCharge}
            helperText={errors.weeklyIneligibleCharge}
            required
          />
        </Grid>

        {/* Other Information Checkbox */}
        <Grid item xs={12}>
          <FormControlLabel
            control={
              <Checkbox
                checked={showOtherInfo}
                onChange={(e) => setShowOtherInfo(e.target.checked)}
              />
            }
            label="Other Information"
          />
        </Grid>

        {showOtherInfo && (
          <>
            {/* Property Features */}
            <Grid item xs={12}>
              <Typography variant="h6" sx={{ mt: 2 }}>
                Property Features
              </Typography>
              <Divider sx={{ mb: 2 }} />
            </Grid>

            <Grid item xs={12} md={3}>
              <TextField
                fullWidth
                label="Number of Floors"
                name="quantityOfFloors"
                type="number"
                inputProps={{ min: 1 }}
                value={formData.quantityOfFloors}
                onChange={handleChange}
                error={!!errors.quantityOfFloors}
                helperText={errors.quantityOfFloors}
                required
              />
            </Grid>

            <Grid item xs={12} md={3}>
              <TextField
                fullWidth
                label="Accommodation Location"
                name="accommodationLocation"
                value={formData.accommodationLocation}
                onChange={handleChange}
              />
            </Grid>

            <Grid item xs={12} md={3}>
              <TextField
                fullWidth
                label="Accommodation Floor"
                name="accommodationFloor"
                value={formData.accommodationFloor}
                onChange={handleChange}
              />
            </Grid>

            <Grid item xs={12}>
              <FormControl error={!!errors.furnishing} component="fieldset">
                <Typography variant="subtitle1">Furnishing</Typography>
                {errors.furnishing && (
                  <Typography color="error" variant="caption">
                    {errors.furnishing}
                  </Typography>
                )}
                <Grid container>
                  <Grid item xs={4}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={formData.unfurnished}
                          onChange={handleChange}
                          name="unfurnished"
                        />
                      }
                      label="Unfurnished"
                    />
                  </Grid>
                  <Grid item xs={4}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={formData.partFurnished}
                          onChange={handleChange}
                          name="partFurnished"
                        />
                      }
                      label="Part Furnished"
                    />
                  </Grid>
                  <Grid item xs={4}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={formData.fullyFurnished}
                          onChange={handleChange}
                          name="fullyFurnished"
                        />
                      }
                      label="Fully Furnished"
                    />
                  </Grid>
                </Grid>
              </FormControl>
            </Grid>

            <Grid item xs={12}>
              <Typography variant="subtitle1">Amenities</Typography>
              <Grid container>
                <Grid item xs={4}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={formData.centralHeating}
                        onChange={handleChange}
                        name="centralHeating"
                      />
                    }
                    label="Central Heating"
                  />
                </Grid>
                <Grid item xs={4}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={formData.garden}
                        onChange={handleChange}
                        name="garden"
                      />
                    }
                    label="Garden"
                  />
                </Grid>
                <Grid item xs={4}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={formData.garageParkingSpace}
                        onChange={handleChange}
                        name="garageParkingSpace"
                      />
                    }
                    label="Garage/Parking Space"
                  />
                </Grid>
              </Grid>
            </Grid>

            {/* Room Details Section */}
            <Grid item xs={12}>
              <Typography variant="h6" sx={{ mt: 2 }}>
                Room Details
              </Typography>
              <Divider sx={{ mb: 2 }} />
            </Grid>

            {/* Living Rooms */}
            <Grid item xs={12}>
              <Typography variant="subtitle1">Living Rooms</Typography>
            </Grid>
            <Grid item xs={4}>
              <TextField
                fullWidth
                label="Total Living Rooms"
                name="totalLivingRooms"
                type="number"
                inputProps={{ min: 0 }}
                value={formData.totalLivingRooms}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={4}>
              <TextField
                fullWidth
                label="Your Use"
                name="livingRoomsYourUse"
                type="number"
                inputProps={{ min: 0 }}
                value={formData.livingRoomsYourUse}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={4}>
              <TextField
                fullWidth
                label="Communal"
                name="livingRoomsCommunal"
                type="number"
                inputProps={{ min: 0 }}
                value={formData.livingRoomsCommunal}
                onChange={handleChange}
              />
            </Grid>

            {/* Bedsit Rooms */}
            <Grid item xs={12}>
              <Typography variant="subtitle1">Bedsit Rooms</Typography>
            </Grid>
            <Grid item xs={4}>
              <TextField
                fullWidth
                label="Total Bedsit Rooms"
                name="totalBedsitRooms"
                type="number"
                inputProps={{ min: 0 }}
                value={formData.totalBedsitRooms}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={4}>
              <TextField
                fullWidth
                label="Your Use"
                name="bedsitYourUse"
                type="number"
                inputProps={{ min: 0 }}
                value={formData.bedsitYourUse}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={4}>
              <TextField
                fullWidth
                label="Communal"
                name="bedsitCommunal"
                type="number"
                inputProps={{ min: 0 }}
                value={formData.bedsitCommunal}
                onChange={handleChange}
              />
            </Grid>

            {/* Bedrooms */}
            <Grid item xs={12}>
              <Typography variant="subtitle1">Bedrooms</Typography>
            </Grid>
            <Grid item xs={4}>
              <TextField
                fullWidth
                label="Total Bedrooms"
                name="totalBedrooms"
                type="number"
                inputProps={{ min: 0 }}
                value={formData.totalBedrooms}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={4}>
              <TextField
                fullWidth
                label="Your Use"
                name="bedroomsYourUse"
                type="number"
                inputProps={{ min: 0 }}
                value={formData.bedroomsYourUse}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={4}>
              <TextField
                fullWidth
                label="Communal"
                name="bedroomsCommunal"
                type="number"
                inputProps={{ min: 0 }}
                value={formData.bedroomsCommunal}
                onChange={handleChange}
              />
            </Grid>

            {/* Bathrooms */}
            <Grid item xs={12}>
              <Typography variant="subtitle1">Bathrooms</Typography>
            </Grid>
            <Grid item xs={4}>
              <TextField
                fullWidth
                label="Total Bathrooms"
                name="totalBathrooms"
                type="number"
                inputProps={{ min: 0 }}
                value={formData.totalBathrooms}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={4}>
              <TextField
                fullWidth
                label="Your Use"
                name="bathroomsYourUse"
                type="number"
                inputProps={{ min: 0 }}
                value={formData.bathroomsYourUse}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={4}>
              <TextField
                fullWidth
                label="Communal"
                name="bathroomsCommunal"
                type="number"
                inputProps={{ min: 0 }}
                value={formData.bathroomsCommunal}
                onChange={handleChange}
              />
            </Grid>

            {/* Toilets */}
            <Grid item xs={12}>
              <Typography variant="subtitle1">Toilets</Typography>
            </Grid>
            <Grid item xs={4}>
              <TextField
                fullWidth
                label="Total Toilets"
                name="totalToilets"
                type="number"
                inputProps={{ min: 0 }}
                value={formData.totalToilets}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={4}>
              <TextField
                fullWidth
                label="Your Use"
                name="toiletsYourUse"
                type="number"
                inputProps={{ min: 0 }}
                value={formData.toiletsYourUse}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={4}>
              <TextField
                fullWidth
                label="Communal"
                name="toiletsCommunal"
                type="number"
                inputProps={{ min: 0 }}
                value={formData.toiletsCommunal}
                onChange={handleChange}
              />
            </Grid>

            {/* Kitchens */}
            <Grid item xs={12}>
              <Typography variant="subtitle1">Kitchens</Typography>
            </Grid>
            <Grid item xs={4}>
              <TextField
                fullWidth
                label="Total Kitchens"
                name="totalKitchens"
                type="number"
                inputProps={{ min: 0 }}
                value={formData.totalKitchens}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={4}>
              <TextField
                fullWidth
                label="Your Use"
                name="kitchensYourUse"
                type="number"
                inputProps={{ min: 0 }}
                value={formData.kitchensYourUse}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={4}>
              <TextField
                fullWidth
                label="Communal"
                name="kitchensCommunal"
                type="number"
                inputProps={{ min: 0 }}
                value={formData.kitchensCommunal}
                onChange={handleChange}
              />
            </Grid>

            {/* Other Rooms */}
            <Grid item xs={12}>
              <Typography variant="subtitle1">Other Rooms</Typography>
            </Grid>
            <Grid item xs={4}>
              <TextField
                fullWidth
                label="Total Other Rooms"
                name="totalOtherRooms"
                type="number"
                inputProps={{ min: 0 }}
                value={formData.totalOtherRooms}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={4}>
              <TextField
                fullWidth
                label="Your Use"
                name="otherRoomsYourUse"
                type="number"
                inputProps={{ min: 0 }}
                value={formData.otherRoomsYourUse}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={4}>
              <TextField
                fullWidth
                label="Communal"
                name="otherRoomsCommunal"
                type="number"
                inputProps={{ min: 0 }}
                value={formData.otherRoomsCommunal}
                onChange={handleChange}
              />
            </Grid>
          </>
        )}

        {/* Action Buttons */}
        <Grid
          item
          xs={12}
          sx={{ display: "flex", justifyContent: "flex-end", mt: 3 }}
        >
          <Button variant="outlined" onClick={onClose} sx={{ mr: 2 }}>
            Cancel
          </Button>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={loading}
          >
            {loading ? (
              <CircularProgress size={24} />
            ) : editMode ? (
              "Update Property"
            ) : (
              "Add Property"
            )}
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
};

export default PropertyForm;
