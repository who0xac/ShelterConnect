import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  Box,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  TextField,
  CssBaseline,
  Chip,
  Tooltip,
  Card,
  CardContent,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DownloadIcon from "@mui/icons-material/Download";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import SearchIcon from "@mui/icons-material/Search";
import CloseIcon from "@mui/icons-material/Close";
import SkipPreviousIcon from "@mui/icons-material/SkipPrevious";
import SkipNextIcon from "@mui/icons-material/SkipNext";
import PersonIcon from "@mui/icons-material/Person";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import TenantForm from "../components/TenantForm.jsx";
import jsPDF from "jspdf";
import { getAllTenants, deleteTenantById } from "../api/tenantApi.js";
import { getCurrentUser,getCurrentUserRoleAndPermissions } from "../api/userApi.js";

const drawerWidth = 240;




const handleDownloadReport = (tenant) => {
  // Create a new PDF document
  const doc = new jsPDF();

  // Add default font
  doc.setFont("helvetica");

  // Set consistent margins on all sides
  const margin = 15;
  const pageWidth = doc.internal.pageSize.width;
  const pageHeight = doc.internal.pageSize.height;
  const contentWidth = pageWidth - margin * 2;

  // Initial position starts after top margin
  let yPosition = margin;

  // Add footer space to prevent overlap
  const footerSpace = 20;
  const headerSpacing = 25;

  // Function to add section headers
  const addSectionHeader = (text) => {
    doc.setFillColor(59, 81, 181);
    doc.rect(margin, yPosition, contentWidth, 8, "F");

    doc.setTextColor(255, 255, 255);
    doc.setFontSize(11);
    doc.setFont("helvetica", "bold");
    doc.text(text, margin + 3, yPosition + 5.5);
    yPosition += 12;
  };

  // Improved field function with better alignment
  const addField = (label, value, width = contentWidth) => {
    doc.setFont("helvetica", "bold");
    doc.setTextColor(80, 80, 80);
    doc.setFontSize(9);
    doc.text(label, margin, yPosition);

    // Calculate value position to ensure proper alignment
    const labelWidth = 60;

    doc.setFont("helvetica", "normal");
    doc.setTextColor(0, 0, 0);

    // Handle multi-line text for long values
    if (value && value.length > 40) {
      const splitValue = doc.splitTextToSize(
        value || "N/A",
        width - labelWidth
      );
      doc.text(splitValue, margin + labelWidth, yPosition);
      // Adjust y position based on number of lines
      yPosition += 6 * splitValue.length;
    } else {
      doc.text(value || "N/A", margin + labelWidth, yPosition);
      yPosition += 6;
    }

    // Check if we need a page break
    if (yPosition > pageHeight - margin - footerSpace) {
      doc.addPage();
      yPosition = margin + headerSpacing;
    }
  };

  // Function to format date strings
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return "Invalid Date";
      return date.toLocaleDateString("en-GB", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } catch (error) {
      return "Invalid Date";
    }
  };

  // Improved two-column layout
  const addTwoColumnFields = (leftLabel, leftValue, rightLabel, rightValue) => {
    const halfWidth = contentWidth / 2 - 5;
    const labelWidth = 60;

    doc.setFont("helvetica", "bold");
    doc.setTextColor(80, 80, 80);
    doc.setFontSize(9);
    doc.text(leftLabel, margin, yPosition);

    doc.setFont("helvetica", "normal");
    doc.setTextColor(0, 0, 0);
    doc.text(leftValue || "N/A", margin + labelWidth, yPosition);

    doc.setFont("helvetica", "bold");
    doc.setTextColor(80, 80, 80);
    doc.text(rightLabel, margin + halfWidth + 10, yPosition);

    doc.setFont("helvetica", "normal");
    doc.setTextColor(0, 0, 0);
    doc.text(rightValue || "N/A", margin + halfWidth + labelWidth, yPosition);

    yPosition += 6;

    // Check if we need a page break
    if (yPosition > pageHeight - margin - footerSpace) {
      doc.addPage();
      yPosition = margin + headerSpacing;
    }
  };

  // Function to add base64 signature images
  const addSignatureImage = (base64Data, x, y, width, height) => {
    if (base64Data && typeof base64Data === "string" && base64Data.length > 0) {
      try {
        // Remove data URI prefix if present
        const imageData = base64Data.includes("base64,")
          ? base64Data.split("base64,")[1]
          : base64Data;

        doc.addImage(imageData, "PNG", x, y, width, height);
        return true;
      } catch (error) {
        console.error("Error adding signature image:", error);
        return false;
      }
    }
    return false;
  };

  // Function to add logo
  const addLogo = () => {
    // Check if we have a path or URL to use
    if (tenant.organizationLogoPath) {
      // Create an image object
      const img = new Image();
      img.crossOrigin = "Anonymous"; // Needed for CORS if logo is on different domain

      // Set up the onload handler
      img.onload = function () {
        const canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0);

        // Get base64 data from canvas - this creates the base64 string from the image drawn on canvas
        const imgData = canvas.toDataURL("image/png");
        doc.addImage(imgData, "PNG", margin, 5, 40, 15);
      };

      // Set the src to the image path - this is where you specify your image location
      img.src = "src/assets/icons/shelterconnect-removebg.png";
    } else {
      // Fallback to text
      doc.setFontSize(14);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(255, 255, 255);
      doc.text("SHELTER CONNECT", margin, 15);
    }
  };

  // Function to add page header for additional pages
  const addPageHeader = () => {
    // Add header with solid background (smaller than first page)
    doc.setFillColor(26, 35, 126);
    doc.rect(0, 0, pageWidth, 20, "F");

    // Add logo (smaller version)
    if (tenant.organizationLogo) {
      addSignatureImage(tenant.organizationLogo, margin, 2.5, 30, 15);
    } else {
      doc.setFontSize(12);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(255, 255, 255);
      doc.text("SHELTER CONNECT", margin, 13);
    }

    // Add report title
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text("TENANT REPORT", pageWidth / 2, 13, { align: "center" });

    // Add reference number
    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");
    doc.text(
      `Reference: TR-${tenant._id.substring(0, 8)}`,
      pageWidth - margin - 50,
      13
    );
  };

  // Function to add risk indicator in risk assessment section
  const addRiskIndicator = (label, isRisk) => {
    doc.setFont("helvetica", "bold");
    doc.setTextColor(80, 80, 80);
    doc.setFontSize(9);
    doc.text(label, margin, yPosition);

    if (isRisk) {
      doc.setTextColor(180, 0, 0);
      doc.setFont("helvetica", "bold");
      doc.text("Yes", margin + 60, yPosition);
    } else {
      doc.setTextColor(0, 100, 0);
      doc.setFont("helvetica", "normal");
      doc.text("No", margin + 60, yPosition);
    }

    yPosition += 6;
    doc.setTextColor(0, 0, 0);

    // Check for page break after each risk indicator
    if (yPosition > pageHeight - margin - footerSpace) {
      doc.addPage();
      addPageHeader(); // Add header to the new page
      yPosition = margin + headerSpacing;
    }
  };

  // Add header with solid background
  doc.setFillColor(26, 35, 126);
  doc.rect(0, 0, pageWidth, 35, "F");

  // Add logo
  addLogo();

  // Title and Reference Number
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(20);
  doc.setFont("helvetica", "bold");
  doc.text("TENANT REPORT", pageWidth / 2, 15, { align: "center" });

  doc.setFontSize(11);
  doc.setFont("helvetica", "normal");
  doc.text(`Reference: TR-${tenant._id.substring(0, 8)}`, margin, 25);

  // Date generated information
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(9);
  const currentDate = new Date().toLocaleDateString("en-GB", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  doc.text(`Generated on: ${currentDate}`, pageWidth - margin - 50, 25);

  yPosition = 45;

  // Enhanced Full Name and Portrait section
  doc.setFillColor(240, 240, 240);
  doc.roundedRect(margin, yPosition, contentWidth, 35, 5, 5, "F");

  // Add subtle design elements
  doc.setDrawColor(59, 81, 181);
  doc.setLineWidth(0.5);
  doc.line(margin, yPosition + 35, margin + contentWidth, yPosition + 35);

  doc.setTextColor(59, 81, 181);
  doc.setFontSize(18);
  doc.setFont("helvetica", "bold");
  const fullName = `${tenant.personalDetails.title || ""} ${
    tenant.personalDetails.firstName
  } ${tenant.personalDetails.middleName || ""} ${
    tenant.personalDetails.lastName
  }`.trim();
  doc.text(fullName, margin + 5, yPosition + 15);

  doc.setFontSize(11);
  doc.setFont("helvetica", "normal");
  // doc.text(`Room ${tenant.roomNumber || "N/A"}`, margin + 5, yPosition + 25);

  // Add placeholder for photo or profile icon (or actual photo if available)
  if (tenant.personalDetails.photo) {
    // If there's a photo available
    addSignatureImage(
      tenant.personalDetails.photo,
      pageWidth - margin - 35,
      yPosition + 5,
      25,
      25
    );
  } else {
    // Placeholder for photo - simple rectangle
    doc.setFillColor(200, 200, 200);
    doc.roundedRect(pageWidth - margin - 35, yPosition + 5, 25, 25, 2, 2, "F");

    // Simple person silhouette
    doc.setFillColor(150, 150, 150);
    doc.circle(pageWidth - margin - 22.5, yPosition + 12, 5, "F");
    doc.setFillColor(150, 150, 150);
    doc.roundedRect(pageWidth - margin - 30, yPosition + 18, 15, 10, 1, 1, "F");
  }

  yPosition += 45;

  // Personal Details Section
  addSectionHeader("PERSONAL DETAILS");

  addTwoColumnFields(
    "Full Name:",
    fullName,
    "Date of Birth:",
    formatDate(tenant.personalDetails.dateOfBirth)
  );
  addTwoColumnFields(
    "Gender:",
    tenant.personalDetails.gender || "N/A",
    "Marital Status:",
    tenant.personalDetails.maritalStatus || "N/A"
  );
  addTwoColumnFields(
    "National Insurance:",
    tenant.personalDetails.nationalInsuranceNumber || "N/A",
    "Place of Birth:",
    tenant.personalDetails.placeOfBirth || "N/A"
  );
  addTwoColumnFields(
    "Contact Number:",
    tenant.personalDetails.contactNumber || "N/A",
    "Email:",
    tenant.personalDetails.email || "N/A"
  );

  if (tenant.personalDetails.currentSituation) {
    addField("Current Situation:", tenant.personalDetails.currentSituation);
  }

  // Property Details Section with enhanced styling
  addSectionHeader("PROPERTY DETAILS");

  const propertyAddress =
    tenant.property && tenant.property.address
      ? tenant.property.address
      : "N/A";

  // Add property address with potential multi-line handling
  doc.setFont("helvetica", "bold");
  doc.setTextColor(80, 80, 80);
  doc.setFontSize(9);
  doc.text("Property Address:", margin, yPosition);

  doc.setFont("helvetica", "normal");
  doc.setTextColor(0, 0, 0);
  const addressLines = doc.splitTextToSize(propertyAddress, contentWidth - 60);
  doc.text(addressLines, margin + 60, yPosition);
  yPosition += addressLines.length * 6;

  // Check for page break after address
  if (yPosition > pageHeight - margin - footerSpace - 20) {
    doc.addPage();
    addPageHeader(); // Add header to the new page
    yPosition = margin + headerSpacing;
  }

  // Add remaining property fields
  addTwoColumnFields(
    "Room Number:",
    String(tenant.roomNumber || "N/A"),
    "Assessment Date:",
    formatDate(tenant.dateOfAssessment)
  );
  addTwoColumnFields(
    "Sign In Date:",
    formatDate(tenant.signInDate),
    "Sign Out Date:",
    formatDate(tenant.signOutDate)
  );

  // Financial Information Section
  addSectionHeader("FINANCIAL INFORMATION");

  addTwoColumnFields(
    "Source of Income:",
    tenant.sourceOfIncome || "N/A",
    "Benefits:",
    tenant.benefits || "N/A"
  );
  addTwoColumnFields(
    "Total Amount:",
    tenant.totalAmount ? `£${tenant.totalAmount.toFixed(2)}` : "N/A",
    "Payment Frequency:",
    tenant.paymentFrequency || "N/A"
  );
  addTwoColumnFields(
    "Benefits Claimed:",
    tenant.benefitsClaimed || "N/A",
    "Debts:",
    tenant.debts ? "Yes" : "No"
  );

  if (tenant.debts && tenant.debtDetails) {
    addField("Debt Details:", tenant.debtDetails);
  }

  // Health Information Section
  addSectionHeader("HEALTH INFORMATION");

  addTwoColumnFields(
    "Physical Health Issues:",
    tenant.physicalHealthConditions ? "Yes" : "No",
    "Mental Health Issues:",
    tenant.mentalHealthConditions ? "Yes" : "No"
  );
  addTwoColumnFields(
    "Diagnosed Mental Health:",
    tenant.diagnosedMentalHealth ? "Yes" : "No",
    "Prescribed Medication:",
    tenant.prescribedMedication ? "Yes" : "No"
  );
  addTwoColumnFields(
    "Self-Harm/Suicidal Thoughts:",
    tenant.selfHarmOrSuicidalThoughts ? "Yes" : "No",
    "GP Information:",
    tenant.personalDetails.gpInfo ? "Available" : "Not Available"
  );

  // Risk Assessment Section with text-based indicators instead of dots
  addSectionHeader("RISK ASSESSMENT");

  // Use text-based indicators for critical risk factors
  addRiskIndicator("Criminal Records:", tenant.criminalRecords);
  addRiskIndicator("Prison History:", tenant.prisonHistory);
  addRiskIndicator("Legal Orders:", tenant.legalOrders);

  addTwoColumnFields(
    "Legal Status:",
    tenant.legalStatus || "N/A",
    "Gambling Issues:",
    tenant.gamblingIssues ? "Yes" : "No"
  );

  addRiskIndicator("Drug Use:", tenant.drugUse);

  if (tenant.riskAssessment && tenant.riskAssessment.length > 0) {
    addField("Risk Factors:", tenant.riskAssessment.join(", "));
  }

 if (tenant.criminalRecords && tenant.offenceDetails) {
   yPosition += 5; // Increased spacing before the offence details section
   doc.setFont("helvetica", "bold");
   doc.text("Offence Details:", margin, yPosition);
   yPosition += 8; // Increased spacing after the heading

   // Check for page break before offence details box
   if (yPosition > pageHeight - margin - footerSpace - 30) {
     // Increased required space
     doc.addPage();
     addPageHeader(); // Add header to the new page
     yPosition = margin + headerSpacing;
     doc.setFont("helvetica", "bold");
     doc.text("Offence Details:", margin, yPosition);
     yPosition += 8; // Increased spacing
   }

   // Create a bordered box for offence details
   const startY = yPosition;
   let boxHeight = 0;

   if (tenant.offenceDetails.nature) {
     doc.setFont("helvetica", "normal");
     doc.text(
       `Nature: ${tenant.offenceDetails.nature}`,
       margin + 8, // Increased left padding
       yPosition
     );
     yPosition += 8; // Increased line spacing
     boxHeight += 8;
   }

   if (tenant.offenceDetails.date) {
     doc.setFont("helvetica", "normal");
     doc.text(
       `Date: ${formatDate(tenant.offenceDetails.date)}`,
       margin + 8, // Increased left padding
       yPosition
     );
     yPosition += 8; // Increased line spacing
     boxHeight += 8;
   }

   if (tenant.offenceDetails.sentence) {
     doc.setFont("helvetica", "normal");
     doc.text(
       `Sentence: ${tenant.offenceDetails.sentence}`,
       margin + 8, // Increased left padding
       yPosition
     );
     yPosition += 8; // Increased line spacing
     boxHeight += 8;
   }

   // Draw the box around offence details with more padding
   doc.setDrawColor(180, 180, 180);
   doc.setLineWidth(0.5);
   doc.roundedRect(margin, startY - 4, contentWidth, boxHeight + 8, 3, 3); // Increased padding and rounded corners

   yPosition += 3; // Add a little extra space after the box
 }

  // Support Needs Section
  addSectionHeader("SUPPORT NEEDS & ADDITIONAL INFORMATION");

  if (tenant.supportNeeds && tenant.supportNeeds.length > 0) {
    addField("Support Needs:", tenant.supportNeeds.join(", "));
  }

  addTwoColumnFields(
    "Family Support:",
    tenant.familySupport ? "Yes" : "No",
    "Full Check Completed:",
    tenant.fullCheckCompleted ? "Yes" : "No"
  );

  // Additional Demographics
  if (
    tenant.ethnicOrigin ||
    tenant.religion ||
    tenant.sexualOrientation ||
    tenant.preferredArea
  ) {
    addSectionHeader("DEMOGRAPHIC INFORMATION");

    if (tenant.ethnicOrigin) addField("Ethnic Origin:", tenant.ethnicOrigin);
    if (tenant.religion) addField("Religion:", tenant.religion);
    if (tenant.sexualOrientation)
      addField("Sexual Orientation:", tenant.sexualOrientation);
    if (tenant.preferredArea) addField("Preferred Area:", tenant.preferredArea);
  }

  // Terms and Agreements Section with improved styling
  if (tenant.termsAndConditions) {
    addSectionHeader("AGREEMENTS & SIGNATURES");

    const agreementItems = [
      { key: "supportChecklist", label: "Support Checklist" },
      { key: "licenseToOccupy", label: "License To Occupy" },
      { key: "weeklyServiceCharge", label: "Weekly Service Charge" },
      { key: "missingPersonForm", label: "Missing Person Form" },
      { key: "tenantPhotographicID", label: "Tenant Photographic ID" },
      { key: "personalDetailsAgreement", label: "Personal Details Agreement" },
      { key: "licenseChargePayments", label: "License Charge Payments" },
      { key: "fireEvacuationProcedure", label: "Fire Evacuation Procedure" },
      { key: "supportAgreement", label: "Support Agreement" },
      { key: "complaintsProcedure", label: "Complaints Procedure" },
      { key: "confidentialityWaiver", label: "Confidentiality Waiver" },
      { key: "nilIncomeFormAgreement", label: "Nil Income Form Agreement" },
      { key: "authorizationForm", label: "Authorization Form" },
      { key: "supportServices", label: "Support Services" },
      { key: "staffAgreement", label: "Staff Agreement" },
    ];

    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.text("Agreements Signed:", margin, yPosition);
    yPosition += 5;

    // Create a nice table for agreements
    const cellWidth = contentWidth / 2;
    let currentX = margin;
    let itemCount = 0;

    agreementItems.forEach((item) => {
      // Switch to next column or row as needed
      if (itemCount % 2 === 0 && itemCount > 0) {
        yPosition += 8;
        currentX = margin;
      } else if (itemCount % 2 === 1) {
        currentX = margin + cellWidth;
      }

      if (
        tenant.termsAndConditions[item.key] &&
        tenant.termsAndConditions[item.key].agreed
      ) {
        doc.setTextColor(0, 100, 0);
        doc.setFillColor(230, 255, 230);
        doc.roundedRect(currentX, yPosition - 5, cellWidth - 5, 7, 2, 2, "F");
        doc.text(`✓ ${item.label}`, currentX + 5, yPosition);
      } else {
        doc.setTextColor(180, 0, 0);
        doc.setFillColor(255, 230, 230);
        doc.roundedRect(currentX, yPosition - 5, cellWidth - 5, 7, 2, 2, "F");
        doc.text(`✗ ${item.label}`, currentX + 5, yPosition);
      }

      itemCount++;

      if (
        yPosition > pageHeight - margin - footerSpace &&
        currentX === margin + cellWidth
      ) {
        doc.addPage();
        addPageHeader(); // Add header to the new page
        yPosition = margin + headerSpacing;
        currentX = margin;
        itemCount = 0;
      }
    });

    doc.setTextColor(0, 0, 0);

    // Ensure proper spacing after the agreements section
    if (itemCount % 2 === 1) {
      yPosition += 8;
    } else {
      yPosition += 3;
    }
  }

  // ----- IMPROVED SIGNATURE SECTION -----

  // Before adding signatures, check if we have enough space for the entire signature section
  // Signature section needs at least 70 points of vertical space
  const requiredSignatureSpace = 70;

  // Always ensure signatures are on same page by forcing a new page if there's not enough space
  if (yPosition > pageHeight - margin - footerSpace - requiredSignatureSpace) {
    doc.addPage();
    addPageHeader();
    yPosition = margin + headerSpacing;
  }

  // Add "SIGNATURES" section header to ensure it's visibly part of the signature section
  addSectionHeader("SIGNATURES");

  // Create attractive signature boxes
  doc.setDrawColor(100, 100, 100);
  doc.setFillColor(245, 245, 245);

  // Tenant signature box
  doc.roundedRect(margin, yPosition, contentWidth / 2 - 10, 40, 3, 3, "FD");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.setTextColor(0, 0, 0); // Set text color to black before writing the heading
  doc.text("Tenant Signature:", margin + 5, yPosition + 10);

  // Try to find the tenant signature in various possible locations
  let tenantSignature = null;
  if (tenant.signature && typeof tenant.signature === "string") {
    tenantSignature = tenant.signature;
  } else if (
    tenant.tenantSignature &&
    typeof tenant.tenantSignature === "string"
  ) {
    tenantSignature = tenant.tenantSignature;
  } else if (
    tenant.personalDetails &&
    tenant.personalDetails.signature &&
    typeof tenant.personalDetails.signature === "string"
  ) {
    tenantSignature = tenant.personalDetails.signature;
  }

  // If we found a signature, try to add it
  if (tenantSignature) {
    try {
      // Extract base64 data if needed
      let signatureData = tenantSignature;
      if (signatureData.includes("base64,")) {
        signatureData = signatureData.split("base64,")[1];
      }

      // Add image with error handling
      try {
        doc.addImage(
          signatureData,
          "PNG",
          margin + 10,
          yPosition + 15,
          contentWidth / 2 - 30,
          20
        );
        console.log("Tenant signature added successfully");
      } catch (err) {
        console.error("Could not add tenant signature image:", err);
      }
    } catch (err) {
      console.error("Error processing tenant signature:", err);
    }
  } else {
    console.log("No tenant signature found in any expected location");
  }

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.text(`Date: ________________`, margin + 5, yPosition + 35);

  // Support Worker signature box with white background
 doc.setFillColor(245, 245, 245);
 doc.roundedRect(
   margin + contentWidth / 2,
   yPosition,
   contentWidth / 2 - 10,
   40,
   3,
   3,
   "FD"
 );
 doc.setFont("helvetica", "bold");
 doc.setFontSize(9);
 doc.setTextColor(0, 0, 0); // Set text color to black before writing the heading
 doc.text(
   "Support Worker Signature:",
   margin + contentWidth / 2 + 5,
   yPosition + 10
 );

  // Add support worker signature if available
  if (
    tenant.supportWorkerSignature &&
    typeof tenant.supportWorkerSignature === "string"
  ) {
    try {
      // Extract base64 data if needed
      let signatureData = tenant.supportWorkerSignature;
      if (signatureData.includes("base64,")) {
        signatureData = signatureData.split("base64,")[1];
      }

      // Add image with error handling
      try {
        doc.addImage(
          signatureData,
          "PNG",
          margin + contentWidth / 2 + 10,
          yPosition + 15,
          contentWidth / 2 - 30,
          20
        );
      } catch (err) {
        console.log("Could not add support worker signature image:", err);
      }
    } catch (err) {
      console.log("Error processing support worker signature:", err);
    }
  }

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.text(
    `Date: ________________`,
    margin + contentWidth / 2 + 5,
    yPosition + 35
  );

  // Add headers to all pages except the first one
  const totalPages = doc.internal.getNumberOfPages();
  for (let i = 2; i <= totalPages; i++) {
    doc.setPage(i);
    addPageHeader();
  }

  // Add an enhanced footer with plenty of space to all pages
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);

    // Add decorative line with distance from bottom
    doc.setDrawColor(26, 35, 126);
    doc.setLineWidth(0.5);
    doc.line(
      margin,
      pageHeight - margin - footerSpace,
      pageWidth - margin,
      pageHeight - margin - footerSpace
    );

    // Add page numbers and confidentiality notice
    doc.setFontSize(8);
    doc.setTextColor(100, 100, 100);
    doc.text(
      `Page ${i} of ${totalPages} | CONFIDENTIAL - FOR INTERNAL USE ONLY`,
      pageWidth / 2,
      pageHeight - margin - 5,
      { align: "center" }
    );
  }

  // Save the PDF with a formatted name
  try {
    const formattedDate = new Date().toISOString().split("T")[0];
    doc.save(
      `Tenant_Report_${tenant.personalDetails.lastName}_${tenant.personalDetails.firstName}_${formattedDate}.pdf`
    );

    // Show success message
    toast.success("PDF report generated successfully.");
  } catch (error) {
    console.error("Error generating PDF:", error);
    toast.error("Failed to generate PDF report. Please try again.");
  }
};
const Tenants = () => {
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [userName, setUserName] = useState("");
  const [tenantsData, setTenantsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openTenantForm, setOpenTenantForm] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [selectedTenant, setSelectedTenant] = useState(null);
  const [editMode, setEditMode] = useState(false);
const [userPermissions, setUserPermissions] = useState({
  role: null,
  permissions: [],
});
  // Table control states
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [sortConfig, setSortConfig] = useState({ key: "", direction: "asc" });

    useEffect(() => {
      const checkPermissions = async () => {
        try {
          const userRoleAndPermissions =
            await getCurrentUserRoleAndPermissions();
          console.log(userRoleAndPermissions);

          const { role, permissions } = userRoleAndPermissions;
          setUserPermissions({ role, permissions });
        } catch (error) {
          console.error("Error checking permissions:", error);
          setUserPermissions({
            role: null,
            canAdd: false,
            canEdit: false,
            canDelete: false,
            canDownload: false,
          });
        }
      };

      checkPermissions();
    }, []);

    // console.log("====================================");
    // console.log(userPermissions);
    // console.log("====================================");

  useEffect(() => {
    fetchTenantsData();
  }, []);

  useEffect(() => {
    getCurrentUser(navigate, setUserName);
  }, []);

  const fetchTenantsData = async () => {
    setLoading(true);
    try {
      const result = await getAllTenants();
      if (result.success && Array.isArray(result.data)) {
        setTenantsData(result.data);
      } else {
        setTenantsData([]);
        setError("Invalid data structure received");
      }
    } catch (error) {
      console.error("Error fetching tenants data:", error);
      setError("Failed to fetch tenants data");
      setTenantsData([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  const sortData = (data) => {
    if (!sortConfig.key) return data;
    return [...data].sort((a, b) => {
      const aValue = a[sortConfig.key];
      const bValue = b[sortConfig.key];
      if (aValue < bValue) return sortConfig.direction === "asc" ? -1 : 1;
      if (aValue > bValue) return sortConfig.direction === "asc" ? 1 : -1;
      return 0;
    });
  };

const filteredData = tenantsData.filter((row) => {
  // Helper function to check if a value matches the searchTerm
  const checkMatch = (value) => {
    if (value == null) return false;
    if (typeof value === "object") {
      // Recursively search within the nested object
      return Object.values(value).some((nestedValue) =>
        checkMatch(nestedValue)
      );
    }
    return String(value).toLowerCase().includes(searchTerm.toLowerCase());
  };

  return Object.values(row).some((value) => checkMatch(value));
});


  const sortedData = sortData(filteredData);
  const totalPages = Math.ceil(sortedData.length / rowsPerPage);
  const currentData = sortedData.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  const handleDrawerToggle = () => setMobileOpen(!mobileOpen);
  const handleSidebarToggle = () => setSidebarOpen(!sidebarOpen);

  const handleLogout = () => {
    try {
      localStorage.removeItem("token");
      navigate("/");
    } catch (error) {
      console.error("Error during logout:", error);
      toast.error("Error during logout. Please try again.");
    }
  };

  const handleEditClick = (tenant) => {
    setSelectedTenant(tenant);
    setEditMode(true);
    setOpenTenantForm(true);
  };

  const handleDeleteClick = (tenant) => {
    setSelectedTenant(tenant);
    setOpenDeleteDialog(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      const result = await deleteTenantById(selectedTenant._id);
      if (result.success) {
        toast.success("Tenant deleted successfully!");
        fetchTenantsData();
      } else {
        toast.error(result.message || "Failed to delete tenant");
      }
    } catch (error) {
      toast.error("Network error. Please try again.");
    }
    setOpenDeleteDialog(false);
    setSelectedTenant(null);
  };

  const handleOpenTenantForm = () => {
    setEditMode(false);
    setSelectedTenant(null);
    setOpenTenantForm(true);
  };

  const handleCloseTenantForm = () => {
    setOpenTenantForm(false);
    setEditMode(false);
    setSelectedTenant(null);
  };

  const handleFormSuccess = () => {
    fetchTenantsData();
    setOpenTenantForm(false);
    setEditMode(false);
    setSelectedTenant(null);
  };

  // Helper function to safely render user data
  const renderAddedBy = (addedBy) => {
    if (!addedBy) return "N/A";
    if (typeof addedBy === "string") return addedBy;
    if (typeof addedBy === "object") {
      // Return the name if available, otherwise email or any identifier that makes sense
      return addedBy.firstName && addedBy.lastName
        ? `${addedBy.firstName} ${addedBy.lastName}`
        : addedBy.email || addedBy._id || "Unknown";
    }
    return "Unknown";
  };

  // Format date as MM/DD/YYYY
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return "Invalid Date";
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    } catch (error) {
      return "Invalid Date";
    }
  };

  // Get status specific color
  const getStatusColor = (status) => {
    return status === 1 ? "#4caf50" : "#f44336";
  };

  return (
    <Box
      sx={{ display: "flex", backgroundColor: "#f4f6f9", minHeight: "100vh" }}
    >
      <CssBaseline />
      <Header
        sidebarOpen={sidebarOpen}
        drawerWidth={drawerWidth}
        handleDrawerToggle={handleDrawerToggle}
        userName={userName}
      />
      <Sidebar
        sidebarOpen={sidebarOpen}
        drawerWidth={drawerWidth}
        mobileOpen={mobileOpen}
        handleDrawerToggle={handleDrawerToggle}
        handleSidebarToggle={handleSidebarToggle}
        handleLogout={handleLogout}
        navigate={navigate}
      />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { sm: `calc(100% - ${sidebarOpen ? drawerWidth : 80}px)` },
          transition: "width 0.3s",
          mt: 8,
        }}
      >
        {/* Header Card */}
        <Card
          elevation={3}
          sx={{
            mb: 4,
            borderRadius: "16px",
            background: "linear-gradient(135deg, #1a237e 0%, #3f51b5 100%)",
            boxShadow: "0 8px 16px rgba(26, 35, 126, 0.2)",
            overflow: "hidden",
          }}
        >
          <CardContent
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              p: 4,
            }}
          >
            <Box>
              <Typography
                variant="h4"
                sx={{
                  fontFamily: "Poppins, sans-serif",
                  fontWeight: 700,
                  color: "white",
                  letterSpacing: "0.5px",
                  mb: 1,
                }}
              >
                Tenant Management
              </Typography>
            </Box>
            {[1, 2].includes(userPermissions?.role) ? (
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={handleOpenTenantForm}
                sx={{
                  bgcolor: "white",
                  color: "#1a237e",
                  "&:hover": { bgcolor: "rgba(255, 255, 255, 0.9)" },
                  fontWeight: "600",
                  px: 3,
                  py: 1.5,
                  borderRadius: "12px",
                  boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
                  textTransform: "none",
                  transition: "all 0.3s ease",
                  letterSpacing: "0.5px",
                }}
              >
                Add New Tenant
              </Button>
            ) : (
              <>
                {userPermissions?.permissions[3] === true &&
                  [3].includes(userPermissions?.role) && (
                    <Button
                      variant="contained"
                      startIcon={<AddIcon />}
                      onClick={handleOpenTenantForm}
                      sx={{
                        bgcolor: "white",
                        color: "#1a237e",
                        "&:hover": { bgcolor: "rgba(255, 255, 255, 0.9)" },
                        fontWeight: "600",
                        px: 3,
                        py: 1.5,
                        borderRadius: "12px",
                        boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
                        textTransform: "none",
                        transition: "all 0.3s ease",
                        letterSpacing: "0.5px",
                      }}
                    >
                      Add New Tenant
                    </Button>
                  )}
              </>
            )}
          </CardContent>
        </Card>

        {/* Search and Rows per page */}
        <Card
          elevation={2}
          sx={{
            mb: 3,
            borderRadius: "16px",
            overflow: "hidden",
          }}
        >
          <CardContent
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              p: 2,
              "&:last-child": { pb: 2 },
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <TextField
                placeholder="Search Tenants..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
                size="small"
                InputProps={{
                  startAdornment: (
                    <SearchIcon sx={{ color: "text.secondary", mr: 1 }} />
                  ),
                  sx: {
                    borderRadius: "12px",
                    fontFamily: "Poppins, sans-serif",
                  },
                }}
                sx={{
                  width: "300px",
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "12px",
                    backgroundColor: "#f1f3f4",
                    transition: "all 0.3s ease",
                    "&:hover": {
                      backgroundColor: "#e8eaed",
                    },
                    "&.Mui-focused": {
                      backgroundColor: "white",
                      boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
                    },
                  },
                }}
              />
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ fontFamily: "Poppins, sans-serif" }}
                >
                  Rows per page:
                </Typography>
                <select
                  value={rowsPerPage}
                  onChange={(e) => {
                    setRowsPerPage(Number(e.target.value));
                    setCurrentPage(1);
                  }}
                  style={{
                    padding: "8px 12px",
                    borderRadius: "10px",
                    border: "1px solid #e0e0e0",
                    cursor: "pointer",
                    backgroundColor: "#f1f3f4",
                    fontFamily: "Poppins, sans-serif",
                    fontSize: "14px",
                  }}
                >
                  {[5, 10, 25, 50].map((size) => (
                    <option key={size} value={size}>
                      {size}
                    </option>
                  ))}
                </select>
              </Box>
            </Box>
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ fontFamily: "Poppins, sans-serif" }}
            >
              Showing{" "}
              {Math.min(
                (currentPage - 1) * rowsPerPage + 1,
                filteredData.length
              )}{" "}
              to {Math.min(currentPage * rowsPerPage, filteredData.length)} of{" "}
              {filteredData.length} entries
            </Typography>
          </CardContent>
        </Card>

        {/* Table */}
        <Card
          elevation={3}
          sx={{
            borderRadius: "16px",
            overflow: "hidden",
            backgroundColor: "white",
            boxShadow: "0 6px 18px rgba(0,0,0,0.1)",
            transition: "box-shadow 0.3s ease",
            "&:hover": {
              boxShadow: "0 8px 24px rgba(0,0,0,0.15)",
            },
          }}
        >
          <TableContainer>
            <Table sx={{ minWidth: 650 }}>
              <TableHead>
                <TableRow sx={{ bgcolor: "#f5f7fa" }}>
                  {[
                    { key: "property", label: "Property" },
                    { key: "firstName", label: "First Name" },
                    { key: "middleName", label: "Middle Name" },
                    { key: "lastName", label: "Last Name" },
                    { key: "room", label: "Room" },
                    { key: "dateOfBirth", label: "Date of Birth" },
                    { key: "signInDate", label: "Sign In Date" },
                    { key: "signOutDate", label: "Sign Out Date" },
                    { key: "addedBy", label: "Added By" },
                    { key: "createdAt", label: "Created At" },
                    { key: "status", label: "Status" },
                    { key: "actions", label: "Actions" },
                  ].map((column) => (
                    <TableCell
                      key={column.key}
                      onClick={() =>
                        column.key !== "actions" &&
                        column.key !== "status" &&
                        handleSort(column.key)
                      }
                      sx={{
                        fontFamily: "Poppins, sans-serif",
                        fontWeight: 600,
                        color: "#37474f",
                        fontSize: "0.875rem",
                        py: 2.5,
                        cursor:
                          column.key !== "actions" && column.key !== "status"
                            ? "pointer"
                            : "default",
                        "&:hover":
                          column.key !== "actions" && column.key !== "status"
                            ? { bgcolor: "rgba(0, 0, 0, 0.04)" }
                            : {},
                        transition: "background-color 0.2s ease",
                        borderBottom: "2px solid #e0e0e0",
                      }}
                    >
                      <Box sx={{ display: "flex", alignItems: "center" }}>
                        {column.label}
                        {sortConfig.key === column.key && (
                          <Typography
                            component="span"
                            sx={{ ml: 1, fontSize: "0.75rem" }}
                          >
                            {sortConfig.direction === "asc" ? "↑" : "↓"}
                          </Typography>
                        )}
                      </Box>
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={12} align="center" sx={{ py: 6 }}>
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                          flexDirection: "column",
                          gap: 2,
                        }}
                      >
                        <div
                          className="loading-spinner"
                          style={{
                            width: "40px",
                            height: "40px",
                            border: "4px solid rgba(63, 81, 181, 0.2)",
                            borderRadius: "50%",
                            borderTop: "4px solid #3f51b5",
                            animation: "spin 1s linear infinite",
                          }}
                        ></div>
                        <Typography
                          color="primary"
                          sx={{ fontFamily: "Poppins, sans-serif" }}
                        >
                          Loading tenant data...
                        </Typography>
                        <style>{`
                          @keyframes spin {
                            0% { transform: rotate(0deg); }
                            100% { transform: rotate(360deg); }
                          }
                        `}</style>
                      </Box>
                    </TableCell>
                  </TableRow>
                ) : error ? (
                  <TableRow>
                    <TableCell
                      colSpan={12}
                      align="center"
                      sx={{
                        py: 4,
                        color: "error.main",
                        fontFamily: "Poppins, sans-serif",
                      }}
                    >
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          gap: 1,
                        }}
                      >
                        <CloseIcon color="error" />
                        {error}
                      </Box>
                    </TableCell>
                  </TableRow>
                ) : currentData.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={12} align="center" sx={{ py: 6 }}>
                      <Box
                        sx={{
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                          gap: 2,
                        }}
                      >
                        <PersonIcon sx={{ fontSize: 48, color: "#bdbdbd" }} />
                        <Typography
                          color="text.secondary"
                          sx={{ fontFamily: "Poppins, sans-serif" }}
                        >
                          No tenant data available
                        </Typography>
                      </Box>
                    </TableCell>
                  </TableRow>
                ) : (
                  currentData.map((row) => (
                    <TableRow
                      key={row._id}
                      sx={{
                        "&:hover": { bgcolor: "#f9fafc" },
                        transition: "background-color 0.2s ease",
                        borderLeft: "4px solid transparent",
                        ":hover": {
                          borderLeft: `4px solid ${getStatusColor(row.status)}`,
                          bgcolor: "#f5f7fa",
                        },
                      }}
                    >
                      <TableCell
                        sx={{ py: 2.5, fontFamily: "Poppins, sans-serif" }}
                      >
                        {row.property ? row.property.address : "N/A"}
                      </TableCell>
                      <TableCell
                        sx={{ py: 2.5, fontFamily: "Poppins, sans-serif" }}
                      >
                        {row.personalDetails.firstName}
                      </TableCell>
                      <TableCell
                        sx={{ py: 2.5, fontFamily: "Poppins, sans-serif" }}
                      >
                        {row.personalDetails.middleName}
                      </TableCell>
                      <TableCell
                        sx={{ py: 2.5, fontFamily: "Poppins, sans-serif" }}
                      >
                        {row.personalDetails.lastName}
                      </TableCell>
                      <TableCell
                        sx={{ py: 2.5, fontFamily: "Poppins, sans-serif" }}
                      >
                        {row.roomNumber}
                      </TableCell>
                      <TableCell
                        sx={{ py: 2.5, fontFamily: "Poppins, sans-serif" }}
                      >
                        {formatDate(row.personalDetails.dateOfBirth)}
                      </TableCell>
                      <TableCell
                        sx={{ py: 2.5, fontFamily: "Poppins, sans-serif" }}
                      >
                        {formatDate(row.signInDate)}
                      </TableCell>
                      <TableCell
                        sx={{ py: 2.5, fontFamily: "Poppins, sans-serif" }}
                      >
                        {formatDate(row.signOutDate)}
                      </TableCell>
                      <TableCell
                        sx={{ py: 2.5, fontFamily: "Poppins, sans-serif" }}
                      >
                        {renderAddedBy(row.addedBy)}
                      </TableCell>
                      <TableCell
                        sx={{ py: 2.5, fontFamily: "Poppins, sans-serif" }}
                      >
                        {formatDate(row.createdAt)}
                      </TableCell>
                      <TableCell
                        sx={{ py: 2.5, fontFamily: "Poppins, sans-serif" }}
                      >
                        <Chip
                          label={row.status === 1 ? "Active" : "Inactive"}
                          size="small"
                          sx={{
                            borderRadius: "6px",
                            fontSize: "0.75rem",
                            fontWeight: 500,
                            fontFamily: "Poppins, sans-serif",
                            bgcolor: `${getStatusColor(row.status)}15`,
                            color: getStatusColor(row.status),
                            border: "none",
                          }}
                        />
                      </TableCell>
                      <TableCell sx={{ py: 2.5 }}>
                        <Box sx={{ display: "flex" }}>
                          {[1, 2].includes(userPermissions?.role) ? (
                            <>
                              <Tooltip title="Edit Tenant">
                                <IconButton
                                  color="primary"
                                  onClick={() => handleEditClick(row)}
                                  sx={{
                                    "&:hover": {
                                      bgcolor: "rgba(25, 118, 210, 0.1)",
                                      transform: "translateY(-2px)",
                                    },
                                    transition: "all 0.2s",
                                    mr: 1,
                                    boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
                                  }}
                                  size="small"
                                >
                                  <EditIcon fontSize="small" />
                                </IconButton>
                              </Tooltip>

                              <Tooltip title="Delete Tenant">
                                <IconButton
                                  color="error"
                                  onClick={() => handleDeleteClick(row)}
                                  sx={{
                                    "&:hover": {
                                      bgcolor: "rgba(211, 47, 47, 0.1)",
                                      transform: "translateY(-2px)",
                                    },
                                    transition: "all 0.2s",
                                    mr: 1,
                                    boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
                                  }}
                                  size="small"
                                >
                                  <DeleteIcon fontSize="small" />
                                </IconButton>
                              </Tooltip>

                              <Tooltip title="Download Report">
                                <IconButton
                                  color="secondary"
                                  onClick={() => handleDownloadReport(row)}
                                  sx={{
                                    "&:hover": {
                                      bgcolor: "rgba(156, 39, 176, 0.1)",
                                      transform: "translateY(-2px)",
                                    },
                                    transition: "all 0.2s",
                                    boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
                                  }}
                                  size="small"
                                >
                                  <DownloadIcon fontSize="small" />
                                </IconButton>
                              </Tooltip>
                            </>
                          ) : (
                            <>
                              {/* Edit Button */}
                              {userPermissions?.permissions[4] === true &&
                                [3].includes(userPermissions?.role) && (
                                  <Tooltip title="Edit Tenant">
                                    <IconButton
                                      color="primary"
                                      onClick={() => handleEditClick(row)}
                                      sx={{
                                        "&:hover": {
                                          bgcolor: "rgba(25, 118, 210, 0.1)",
                                          transform: "translateY(-2px)",
                                        },
                                        transition: "all 0.2s",
                                        mr: 1,
                                        boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
                                        cursor: "pointer",
                                      }}
                                      size="small"
                                    >
                                      <EditIcon fontSize="small" />
                                    </IconButton>
                                  </Tooltip>
                                )}

                              {/* Delete Button */}
                              {userPermissions?.permissions[5] === true &&
                                [3].includes(userPermissions?.role) && (
                                  <Tooltip title="Delete Tenant">
                                    <IconButton
                                      color="error"
                                      onClick={() => handleDeleteClick(row)}
                                      sx={{
                                        "&:hover": {
                                          bgcolor: "rgba(211, 47, 47, 0.1)",
                                          transform: "translateY(-2px)",
                                        },
                                        transition: "all 0.2s",
                                        mr: 1,
                                        boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
                                        cursor: "pointer",
                                      }}
                                      size="small"
                                    >
                                      <DeleteIcon fontSize="small" />
                                    </IconButton>
                                  </Tooltip>
                                )}

                              {/* Download Button */}
                              {userPermissions?.permissions[7] === true &&
                                [3].includes(userPermissions?.role) && (
                                  <Tooltip title="Download Report">
                                    <IconButton
                                      color="secondary"
                                      onClick={() => handleDownloadReport(row)}
                                      sx={{
                                        "&:hover": {
                                          bgcolor: "rgba(156, 39, 176, 0.1)",
                                          transform: "translateY(-2px)",
                                        },
                                        transition: "all 0.2s",
                                        boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
                                        cursor: "pointer",
                                      }}
                                      size="small"
                                    >
                                      <DownloadIcon fontSize="small" />
                                    </IconButton>
                                  </Tooltip>
                                )}
                            </>
                          )}
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Card>

        {/* Pagination */}
        <Card
          elevation={2}
          sx={{
            mt: 3,
            borderRadius: "16px",
            overflow: "hidden",
          }}
        >
          <CardContent
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              gap: 2,
              py: 2,
              "&:last-child": { pb: 2 },
            }}
          >
            <Button
              variant="outlined"
              startIcon={<SkipPreviousIcon />}
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              sx={{
                minWidth: "130px",
                borderRadius: "10px",
                textTransform: "none",
                fontWeight: 600,
                fontFamily: "Poppins, sans-serif",
                border: "1px solid #e0e0e0",
                color: currentPage === 1 ? "#bdbdbd" : "#3f51b5",
                "&:hover": {
                  borderColor: "#3f51b5",
                  backgroundColor: "rgba(63, 81, 181, 0.04)",
                },
                transition: "all 0.2s ease",
              }}
            >
              Previous
            </Button>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
                px: 2,
                py: 1,
                borderRadius: "8px",
                backgroundColor: "#f5f7fa",
                minWidth: "120px",
                justifyContent: "center",
              }}
            >
              <Typography
                variant="body2"
                sx={{ fontFamily: "Poppins, sans-serif", fontWeight: 500 }}
              >
                Page{" "}
                <span style={{ fontWeight: 700, color: "#3f51b5" }}>
                  {currentPage}
                </span>{" "}
                of {totalPages}
              </Typography>
            </Box>
            <Button
              variant="outlined"
              endIcon={<SkipNextIcon />}
              disabled={currentPage === totalPages || totalPages === 0}
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
              sx={{
                minWidth: "130px",
                borderRadius: "10px",
                textTransform: "none",
                fontWeight: 600,
                fontFamily: "Poppins, sans-serif",
                border: "1px solid #e0e0e0",
                color:
                  currentPage === totalPages || totalPages === 0
                    ? "#bdbdbd"
                    : "#3f51b5",
                "&:hover": {
                  borderColor: "#3f51b5",
                  backgroundColor: "rgba(63, 81, 181, 0.04)",
                },
                transition: "all 0.2s ease",
              }}
            >
              Next
            </Button>
          </CardContent>
        </Card>

        {/* Delete Confirmation Dialog */}
        <Dialog
          open={openDeleteDialog}
          onClose={() => setOpenDeleteDialog(false)}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
          sx={{
            "& .MuiDialog-paper": {
              borderRadius: "16px",
              padding: "16px",
              boxShadow: "0 8px 24px rgba(0,0,0,0.15)",
            },
          }}
        >
          <DialogTitle
            id="alert-dialog-title"
            sx={{
              fontWeight: 700,
              color: "#d32f2f",
              display: "flex",
              alignItems: "center",
              gap: 1.5,
              fontFamily: "Poppins, sans-serif",
              borderBottom: "1px solid #f0f0f0",
              pb: 2,
            }}
          >
            <DeleteIcon color="error" /> Confirm Delete
          </DialogTitle>
          <DialogContent sx={{ mt: 2, pt: 2 }}>
            <DialogContentText
              id="alert-dialog-description"
              sx={{
                color: "#37474f",
                fontWeight: 500,
                fontFamily: "Poppins, sans-serif",
              }}
            >
              Are you sure you want to delete{" "}
              {selectedTenant?.personalDetails
                ? `${selectedTenant.personalDetails.firstName} ${selectedTenant.personalDetails.lastName}`
                : "this tenant"}
              ? This action cannot be undone.
            </DialogContentText>
          </DialogContent>
          <DialogActions sx={{ p: 2, pt: 0 }}>
            <Button
              onClick={() => setOpenDeleteDialog(false)}
              color="primary"
              variant="outlined"
              sx={{
                borderRadius: "10px",
                textTransform: "none",
                fontFamily: "Poppins, sans-serif",
                fontWeight: 600,
                px: 3,
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleDeleteConfirm}
              color="error"
              variant="contained"
              autoFocus
              sx={{
                borderRadius: "10px",
                boxShadow: "none",
                "&:hover": {
                  boxShadow: "0 4px 8px rgba(211, 47, 47, 0.3)",
                  backgroundColor: "#c62828",
                },
                textTransform: "none",
                fontFamily: "Poppins, sans-serif",
                fontWeight: 600,
                px: 3,
              }}
            >
              Delete
            </Button>
          </DialogActions>
        </Dialog>

        {/* Tenant Form Dialog */}
        <Dialog
          open={openTenantForm}
          onClose={handleCloseTenantForm}
          maxWidth="md"
          fullWidth
          sx={{
            "& .MuiDialog-paper": {
              borderRadius: "16px",
              padding: "16px",
              boxShadow: "0 12px 32px rgba(0,0,0,0.12)",
            },
          }}
        >
          <DialogTitle
            sx={{
              fontFamily: "Poppins, sans-serif",
              fontWeight: 600,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              borderBottom: "1px solid #f0f0f0",
              pb: 2,
              color: "#37474f",
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
              {editMode ? (
                <>
                  <EditIcon color="primary" />
                  Edit Tenant
                </>
              ) : (
                <>
                  <AddIcon color="primary" />
                  Add New Tenant
                </>
              )}
            </Box>
            <IconButton
              onClick={handleCloseTenantForm}
              sx={{
                color: "#9e9e9e",
                "&:hover": {
                  backgroundColor: "#f5f5f5",
                  color: "#757575",
                },
                transition: "all 0.2s ease",
              }}
            >
              <CloseIcon />
            </IconButton>
          </DialogTitle>
          <DialogContent sx={{ p: 0 }}>
            <TenantForm
              onSuccess={handleFormSuccess}
              onClose={handleCloseTenantForm}
              initialData={editMode ? selectedTenant : null}
              editMode={editMode}
            />
          </DialogContent>
        </Dialog>

        <ToastContainer
          position="top-center"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
          style={{ fontFamily: "Poppins, sans-serif" }}
        />
      </Box>
    </Box>
  );
};

export default Tenants;
