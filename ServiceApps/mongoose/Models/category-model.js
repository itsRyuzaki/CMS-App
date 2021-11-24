import { Model, Schema } from "mongoose";
import { collectionNames } from "../config";

const CategorySchema = new Schema({
  categoryId: String,
  type: String,
  description: String,
});

export const CategoryModel = new Model(
  collectionNames.category,
  CategorySchema
);
