import { ICategoryModel, IPaymentModel } from './api-response.interface';

export interface IGenderConfig {
  name: string;
  data: IOptionConfig[];
}

export interface IOptionConfig {
  value: string;
  label: string;
}

export interface IConvertedDate {
  day: number;
  month: number;
  year: number;
}

export interface IDialogResponse {
  isSuccess: boolean;
  data: any;
}

export interface IPaymentDialogRequest {
  oldPaymentDetails: Partial<IPaymentModel>[];
  category: ICategoryModel;
}

export interface IAgeOption {
  min: number;
  max: number;
  label: string;
  id: string;
}
