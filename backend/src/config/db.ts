import mongoose from "mongoose";
import { logger } from "../utils";

const MONGODB_URI =
  "mongodb://localhost:27017/accounting-booking-software-backend";

const connectDB = async () => {
  try {
    mongoose.connect(MONGODB_URI);
    logger.info("Connected to MongoDB");
  } catch (error) {
    logger.error(`MongoDB connection error: ${error}`);
  }
};

// Connect to MongoDB
// mongoose.connect(MONGODB_URI);

// const db = mongoose.connection;

// db.on("error", (err) => {
//
// });

// db.once("open", () => {
//   logger.info("Connected to MongoDB");
// });

export default connectDB;
