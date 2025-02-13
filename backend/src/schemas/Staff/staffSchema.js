import mongoose from "mongoose";

const staffSchema = new mongoose.Schema(
  {
    jobTitle: { type: String, required: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    phone: { type: String, required: true },
    gender: { type: String, required: true, enum: ["Male", "Female", "Other"] },
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    correspondingEmail: { type: String, required: true },
    password: { type: String, required: true },
    role: { type: Number, enum: [3], default: 3 },
    addedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    isDeleted: { type: Boolean, default: false },
    status: { type: Number, enum: [0, 1], default: 1 },
  },
  { timestamps: true }
);

const Staff = mongoose.model("Staff", staffSchema);
export default Staff;
