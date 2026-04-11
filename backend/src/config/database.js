import mongoose from "mongoose";
import config from "./config.js";

if (!config.mongoURI) {
  throw new Error("Please provide MONGO_URI in the environment variables");
}

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(config.mongoURI, {
      dbName: "chat-app", // optional but recommended
    });

    console.log(`MongoDB connected: ${conn.connection.host}`);
  } catch (error) {
    console.error("MongoDB connection failed:", error.message);
    process.exit(1);
  }
};

export default connectDB;