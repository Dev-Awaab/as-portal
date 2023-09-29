import mongoose, { Schema, Model } from "mongoose";

export interface TradeDocument extends mongoose.Document {
  COMMODITY: string;
  DATE: Number;
  ORDER: string,
  ORDERID: Number;
  DESCRIPTION: string;
  TRADEVOLUME: Number;
  BALANCE: Number;
  DEBIT: Number;
  CREDIT: Number;
}

const tradeSchema = new Schema<TradeDocument>({
  COMMODITY: {
    type: String,
    required: true,
  },
  DATE: {
    type: Number,
    required: true,
  },
  ORDER: {
    type: String,
    required: false,
  },
  ORDERID: {
    type: Number,
    // unique: true,
    required: false,
  },
  DESCRIPTION: {
    type: String,
    required: true,
  },
  TRADEVOLUME: {
    type: Number,
    required: false,
  },
  BALANCE: {
    type: Number,
    required: true,
  },
  DEBIT: {
    type: Number,
    default: 0,
  },
  CREDIT: {
    type: Number,
    default: 0,
  },
});

const Trade: Model<TradeDocument> = mongoose.model("Trade", tradeSchema);

export default Trade;
