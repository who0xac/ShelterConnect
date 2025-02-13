import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    companyName: { type: String, required: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    correspondingEmail: { type: String, required: true, unique: true },
    addressLine1: { type: String, required: true },
    area: { type: String, required: true },
    city: { type: String, required: true },
    postCode: { type: String, required: true },
    phoneNumber: { type: String, required: true },
    role: {
      type: Number,
      enum: [1, 2, 3], 
      required: true,
      default: 2,
    },
    isDeleted: { type: Boolean, default: false }, 
    status: { type: Number, enum: [0, 1], default: 1 }, 
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("User", userSchema);
export default User;
