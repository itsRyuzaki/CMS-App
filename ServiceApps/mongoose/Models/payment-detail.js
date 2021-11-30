import mongoose from "mongoose";
const { model, Schema } = mongoose;
import { collectionNames } from "../config.js";

const PaymentDetailSchema = new Schema({
  patientId: String,
  categoryId: String,
  fees: [
    {
      value: Number,
      date: String,
    },
  ],
  paidAmount: [
    {
      value: Number,
      date: String,
    },
  ],
});

export const PaymentDetailModel = new model(
  collectionNames.paymentDetail,
  PaymentDetailSchema
);
