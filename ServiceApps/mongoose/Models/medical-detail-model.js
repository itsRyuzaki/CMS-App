import mongoose from "mongoose";
const { model, Schema } = mongoose;
import { COLLECTION_NAMES, DATE_SCHEMA } from "../Config/global-config.js";

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
  COLLECTION_NAMES.medicalDetail,
  MedicalDetailSchema
);
