import { ICategoryModel, IPaymentModel } from './api-response.interface';

export interface IGenderConfig {
  name: string;
  data: {
    value: string;
    label: string;
  }[];
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
