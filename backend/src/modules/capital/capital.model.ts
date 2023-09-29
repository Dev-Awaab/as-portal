import mongoose, { Schema, Model } from "mongoose";

export interface CapitalDocument extends mongoose.Document {
  initalCapital: number;
  year: Number;
}

const capitalSchema = new Schema<CapitalDocument>(
  {
    initalCapital: {
      type: Number,
      required: true,
    },
    year: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Capital: Model<CapitalDocument> = mongoose.model(
  "Capital",
  capitalSchema
);

export default Capital;
