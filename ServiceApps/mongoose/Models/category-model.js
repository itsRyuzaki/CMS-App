import mongoose from "mongoose";
const { model, Schema } = mongoose;
import { COLLECTION_NAMES } from "../Config/global-config.js";

const CategorySchema = new Schema({
  categoryId: String,
  type: String,
  description: String,
});

export const CategoryModel = new model(
  COLLECTION_NAMES.category,
  CategorySchema
);
