import mongoose from "mongoose";
const { model, Schema } = mongoose;
import { ADDRESS_SCHEMA, COLLECTION_NAMES } from "../Config/global-config.js";

const PatientSchema = new Schema({
  clinicId: String,
  patientId: String,
  name: String,
  age: {
    value: Number,
    lastModified: String,
  },
  address: ADDRESS_SCHEMA,
  gender: String,
  phoneNumber: {
    primary: String,
    secondary: String,
  },
  totalVisits: Number,
  pendingAmount: Number,
  isDeleted: { type: Boolean, default: false },
});

export const PatientModel = new model(COLLECTION_NAMES.patient, PatientSchema);
