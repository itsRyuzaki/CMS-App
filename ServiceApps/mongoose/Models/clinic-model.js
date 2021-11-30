import mongoose from "mongoose";
const { model, Schema } = mongoose;
import { collectionNames } from "../config.js";

const ClinicSchema = new Schema({
  clinicId: String,
  userId: String,
  name: String,
  address: {
    area: String,
    pincode: String,
    city: String,
    state: String,
  },
  staffDetails: [{ name: String, age: Number, phoneNumber: String }],
  isDeleted: Boolean,
});

export const ClinicModel = new model(collectionNames.clinic, ClinicSchema);
