import { Model, Schema } from "mongoose";
import { collectionNames } from "../config";

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

export const PaymentDetailSchema = new Model(
  collectionNames.paymentDetail,
  PaymentDetailSchema
);
