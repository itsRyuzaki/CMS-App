import mongoose from "mongoose";
const { model, Schema } = mongoose;
import { COLLECTION_NAMES, DATE_SCHEMA } from "../Config/global-config.js";

const PaymentDetailSchema = new Schema({
  patientId: String,
  categoryId: String,
  transactions: [{ fees: Number, paidAmount: Number, date: DATE_SCHEMA }],
  dueAmount: Number,
});

export const PaymentDetailModel = new model(
  COLLECTION_NAMES.paymentDetail,
  PaymentDetailSchema
);
