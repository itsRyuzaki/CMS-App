import mongoose from "mongoose";
const { model, Schema } = mongoose;
import { ADDRESS_SCHEMA, collectionNames } from "../config.js";

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
  isDeleted: { type: Boolean, default: false },
});

export const PatientModel = new model(collectionNames.patient, PatientSchema);
