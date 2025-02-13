import mongoose from "mongoose";

const rslSchema = new mongoose.Schema(
  {
    rslName: { type: String, required: true },
    firstName: { type: String },
    lastName: { type: String },
    email: { type: String, required: true, unique: true },
    phoneNumber: { type: String },
    addressLine1: { type: String, required: true },
    area: { type: String },
    city: { type: String, required: true },
    postCode: { type: String, required: true },
    website: { type: String },
    logo: { type: String },
    isDeleted: { type: Boolean, default: false },
    status: { type: Number, enum: [0, 1], default: 1 },
    visibleTo: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  },
  { timestamps: true }
);

const RSL = mongoose.model("RSL", rslSchema);
export default RSL;
