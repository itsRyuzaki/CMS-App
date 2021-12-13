import mongoose from "mongoose";
const { model, Schema } = mongoose;
import { ADDRESS_SCHEMA, COLLECTION_NAMES } from "../Config/global-config.js";

const ClinicSchema = new Schema({
  clinicId: String,
  userId: String,
  name: String,
  doctorInCharge: String,
  address: ADDRESS_SCHEMA,
  isDeleted: { type: Boolean, default: false },
});

export const ClinicModel = new model(COLLECTION_NAMES.clinic, ClinicSchema);
