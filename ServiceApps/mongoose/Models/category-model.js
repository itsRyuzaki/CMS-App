import mongoose from "mongoose";
const { model, Schema } = mongoose;
import { collectionNames } from "../config.js";

const CategorySchema = new Schema({
  categoryId: String,
  type: String,
  description: String,
});

export const CategoryModel = new model(
  collectionNames.category,
  CategorySchema
);
