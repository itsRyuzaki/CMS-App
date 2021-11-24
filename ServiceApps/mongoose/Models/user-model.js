import { Model, Schema } from "mongoose";
import { collectionNames } from "../config";

const UserSchema = new Schema({
  userId: String,
  name: String,
  dateOfBirth: String,
  address: {
    area: String,
    pincode: String,
    city: String,
    state: String,
  },
  gender: String,
  phoneNumber: {
    primary: String,
    secondary: [String],
  },
  selectedClinicId: String,
});

export const UserModel = new Model(collectionNames.user, UserSchema);
