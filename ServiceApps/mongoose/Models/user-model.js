import mongoose from "mongoose";
const { model, Schema } = mongoose;
import { ADDRESS_SCHEMA, COLLECTION_NAMES } from "../Config/global-config.js";

const UserSchema = new Schema({
  userId: String,
  name: String,
  dateOfBirth: String,
  address: ADDRESS_SCHEMA,
  gender: String,
  phoneNumber: String,
  selectedClinicId: String,
});

export const UserModel = new model(COLLECTION_NAMES.user, UserSchema);
