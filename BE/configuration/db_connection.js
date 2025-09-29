import dotenv from "dotenv";
import mongoose from "mongoose";

dotenv.config();

const db_url = process.env.PUBLIC_DB_CONNECTION_URL;

async function connectDB() {
  try {
    await mongoose.connect(db_url, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000,
    });
  } catch (err) {
    console.error("MongoDB connection failed:", err.message);
  }
}

export default connectDB;
