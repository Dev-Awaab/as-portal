import mongoose, { Schema, Model } from "mongoose";

export interface PerformaceDocument extends mongoose.Document {
  INLEIN: Number;
  DATE: Number;
  BALANCE: Number;
  AVAILABLECASHBALANCE: Number;
  PERCENTRETURN: Number;
}

const perfromaceSchema = new Schema<PerformaceDocument>({
  DATE: {
    type: Number,
    required: true,
  },
  INLEIN: {
    type: Number,
    required: true,
  },
  AVAILABLECASHBALANCE: {
    type: Number,
    required: true,
  },
  BALANCE: {
    type: Number,
    required: true,
  },
  PERCENTRETURN: {
    type: Number,
    required: true,
  },
})

const Performace: Model<PerformaceDocument> = mongoose.model("Performace", perfromaceSchema);

export default Performace;
