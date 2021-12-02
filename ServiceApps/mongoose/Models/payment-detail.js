import mongoose from "mongoose";
const { model, Schema } = mongoose;
import { COLLECTION_NAMES } from "../Config/global-config.js";

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
  dueAmount: Number
});

export const PaymentDetailModel = new model(
  COLLECTION_NAMES.paymentDetail,
  PaymentDetailSchema
);
