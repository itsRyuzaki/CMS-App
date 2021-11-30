import mongoose from "mongoose";
const { model, Schema } = mongoose;
import { collectionNames, DATE_SCHEMA } from "../config.js";

const MedicalDetailSchema = new Schema({
  patientId: String,
  categoryId: String,
  symptoms: String,
  diagnosis: String,
  investigation: String,
  treatment: String,
  notes: String,
  dateOfVisit: DATE_SCHEMA,
  followUpDate: DATE_SCHEMA,
  physicalExamination: {
    bloodPressure: String,
    temperature: String,
    pulse: String,
    weight: String,
  },
});

export const MedicalDetailModel = new model(
  collectionNames.medicalDetail,
  MedicalDetailSchema
);
