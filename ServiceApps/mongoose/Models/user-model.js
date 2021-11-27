import { Model, Schema } from "mongoose";
import { ADDRESS_SCHEMA, collectionNames } from "../config";

const UserSchema = new Schema({
  userId: String,
  name: String,
  dateOfBirth: String,
  address: ADDRESS_SCHEMA,
  gender: String,
  phoneNumber: String,
  selectedClinicId: String,
});

export const UserModel = new Model(collectionNames.user, UserSchema);
