import { IConvertedDate } from './common.interface';
export interface IPatientModel {
  clinicId?: string;
  patientId?: string;
  name?: string;
  age?: number;
  address?: IAddressModel;
  gender?: string;
  phoneNumber?: {
    primary?: string;
    secondary?: string;
  };
  totalVisits?: number;
  pendingAmount?: number;
  lastModified?: string;
}

export interface IAddressModel {
  area?: string;
  pincode?: string;
  city?: string;
  state?: string;
}

export interface IMedicalRecord {
  patientId: string;
  categoryId: string;
  symptoms: string;
  diagnosis: string;
  investigation: string;
  treatment: string;
  notes: string;
  dateOfVisit: IConvertedDate;
  followUpDate: IConvertedDate;
  physicalExamination: {
    bloodPressure: string;
    temperature: string;
    pulse: string;
    weight: string;
  };
  stringifiedVisitDate: string;
  stringifiedFollowUpDate: string;
}

export interface IUserModel {
  userId: string;
  name: string;
  dateOfBirth: string;
  address: IAddressModel;
  gender: string;
  phoneNumber: string;
  selectedClinicId: string;
}

export interface ICategoryModel {
  categoryId: string;
  type: string;
  description: string;
}

export interface IClinicModel {
  clinicId: string;
  userId: string;
  name: string;
  doctorInCharge: string;
  address: IAddressModel;
}

export interface IPaymentModel {
  patientId: string;
  categoryId: string;
  transactions: {
    fees: number;
    paidAmount: number;
    date: IConvertedDate;
    stringifiedDate: string;
  }[];
  dueAmount: number;
}
