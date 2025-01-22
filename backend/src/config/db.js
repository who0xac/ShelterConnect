import mongoose from "mongoose"; 

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.DATABASE_URL);
    console.log("MongoDB Connected...");
  } catch (err) {
    console.error("Unable to Connect: " + err.message);
    process.exit(1);
  }
};

export default connectDB;
