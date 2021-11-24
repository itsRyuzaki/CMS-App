import { Model, Schema } from "mongoose";
import { collectionNames } from "../config";

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

export const ClinicModel = new Model(collectionNames.clinic, ClinicSchema);
