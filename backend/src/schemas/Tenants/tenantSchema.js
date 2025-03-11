import mongoose from "mongoose";

const TenantSchema = new mongoose.Schema(
  {
    property: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Property",
      required: true,
    },
    roomNumber: { type: Number, required: true },
    signInDate: { type: Date, required: true },
    signOutDate: { type: Date },
    dateOfAssessment: { type: Date, required: true },

    preferredArea: { type: String },
    ethnicOrigin: {
      type: String,
      enum: [],
    },
    religion: {
      type: String,
      enum: [],
    },
    sexualOrientation: {
      type: String,
      enum: [],
    },

    sourceOfIncome: { type: String },
    benefits: { type: String },
    totalAmount: { type: Number },
    paymentFrequency: { type: String },

    debts: { type: Boolean, required: true },
    debtDetails: { type: String },
    gamblingIssues: { type: Boolean },
    gamblingDetails: { type: String },
    criminalRecords: { type: Boolean },
    offenceDetails: {
      nature: String,
      date: Date,
      sentence: String,
    },

    supportNeeds: [{ type: String }],
    fullCheckCompleted: { type: Boolean, required: true },

    physicalHealthConditions: { type: Boolean },
    mentalHealthConditions: { type: Boolean },
    diagnosedMentalHealth: { type: Boolean },
    legalStatus: { type: String },
    prescribedMedication: { type: Boolean },
    selfHarmOrSuicidalThoughts: { type: Boolean },
    prisonHistory: { type: Boolean },
    legalOrders: { type: Boolean },

    benefitsClaimed: { type: String },
    drugUse: { type: Boolean },
    riskAssessment: [{ type: String }],

    familySupport: { type: Boolean },
    supportWorkerSignature: { type: String },
    tenantSignature: { type: String },

    personalDetails: {
      title: String,
      firstName: { type: String, required: true },
      middleName: String,
      lastName: { type: String, required: true },
      nationalInsuranceNumber: { type: String, required: true },
      maritalStatus: { type: String, required: true },
      height: Number,
      shoeSize: Number,
      clothingSize: String,
      eyeColor: String,
      gender: { type: String, required: true },
      contactNumber: String,
      email: String,
      signupEmail: String,

      claimReferenceNumber: String,
      skinTone: String,
      hairColor: String,
      dateOfBirth: { type: Date, required: true },
      placeOfBirth: String,
      currentSituation: String,

      hasVehicle: { type: Boolean },
      distinguishingMarks: { type: Boolean },
      employerOrCollegeDetails: { type: Boolean },
      movedLast12Months: { type: Boolean },
      enteredUKLast2Years: { type: Boolean },
      partnerLivingWithYou: { type: Boolean },

      bereavementOrSeparation: { type: Boolean },
      relevantCircumstances: { type: Boolean },
      rentAffordableWhenMoved: { type: Boolean },
      multiAgencyProtectionPlan: { type: Boolean },

      homelessHostelFor3Months: { type: Boolean },
      nextOfKinInfo: { type: Boolean },
      gpInfo: { type: Boolean },
      requireNilIncomeForm: { type: Boolean },

      claimBackdated: { type: Boolean },
      otherCharges: { type: String },
      shelteredAccommodation: { type: Boolean },

      photoUploaded: { type: Boolean },
      proofOfBenefitUploaded: { type: Boolean },
      studentStatus: { type: Boolean },
      incapableOfWork: { type: Boolean },
      registeredBlind: { type: Boolean },

      carerAllowanceReceived: { type: Boolean },
      overnightCareRequired: { type: Boolean },
      fosterCarer: { type: Boolean },
      currentlyAbsentFromHome: { type: Boolean },
      claimedHousingBenefitBefore: { type: Boolean },

      expectedIncomeChangeNext6Months: { type: Boolean },
      expectedExpenseChangeNext6Months: { type: Boolean },
      ukEntryDate: { type: Date },
    },

    termsAndConditions: {
      supportChecklist: {
        agreed: { type: Boolean },
      },
      licenseToOccupy: {
        agreed: { type: Boolean },
      },
      weeklyServiceCharge: {
        agreed: { type: Boolean },
      },
      missingPersonForm: {
        agreed: { type: Boolean },
      },
      tenantPhotographicID: {
        agreed: { type: Boolean },
      },
      personalDetailsAgreement: {
        agreed: { type: Boolean },
      },
      licenseChargePayments: {
        agreed: { type: Boolean },
      },
      fireEvacuationProcedure: {
        agreed: { type: Boolean },
      },
      supportAgreement: {
        agreed: { type: Boolean },
      },
      complaintsProcedure: {
        agreed: { type: Boolean },
      },
      confidentialityWaiver: {
        agreed: { type: Boolean },
      },
      nilIncomeFormAgreement: {
        agreed: { type: Boolean },
      },
      authorizationForm: {
        agreed: { type: Boolean },
      },
      supportServices: {
        agreed: { type: Boolean },
      },
      staffAgreement: {
        agreed: { type: Boolean },
      },
    },

    // New fields
    addedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
    status: { type: Number, enum: [0, 1], default: 1 },
  },
  { timestamps: true }
);

const Tenant = mongoose.model("Tenant", TenantSchema);
export default Tenant;