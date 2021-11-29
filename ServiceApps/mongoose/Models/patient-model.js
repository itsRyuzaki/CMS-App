import { Model, Schema } from "mongoose";
import { ADDRESS_SCHEMA, collectionNames } from "../config";

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
  isDeleted: Boolean,
});

export const PatientModel = new Model(collectionNames.patient, PatientSchema);
