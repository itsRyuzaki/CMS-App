import { HelperUtil } from './helper-utility';
import {
  DETAILS_PAGE,
  PENDING_PAGE,
  FOLLOW_UP_PAGE,
} from './../Config/global-config';

export const RequestUtil = {
  paymentRecords: (isDetailsPage: boolean, filter: any, limit: number = -1) => {
    return {
      filter,
      projection: {},
      queryOptions: {
        ...(limit !== -1 && { limit }),
      },
      pageType: isDetailsPage ? DETAILS_PAGE : PENDING_PAGE,
    };
  },
  medicalRecords: (isDetailsPage: boolean, filter: any, limit: number = -1) => {
    const dateObj = HelperUtil.getConvertedDateObj(new Date());
    const dateFilter = {
      'followUpDate.day': {
        $gte: dateObj.day,
      },
      'followUpDate.month': {
        $gte: dateObj.month,
      },
      'followUpDate.year': {
        $gte: dateObj.year,
      },
    };
    const projection = {
      diagnosis: 0,
      symptoms: 0,
      investigation: 0,
      treatment: 0,
      notes: 0,
      physicalExamination: 0,
    };
    return {
      filter: {
        ...filter,
        ...(isDetailsPage ? {} : dateFilter),
      },
      projection: {
        ...(isDetailsPage ? {} : projection),
      },
      queryOptions: {
        ...(limit !== -1 && { limit }),
      },
      pageType: isDetailsPage ? DETAILS_PAGE : FOLLOW_UP_PAGE,
    };
  },
  patientDetails: (filter: any, limit: number = -1) => {
    return {
      filter,
      projection: {},
      queryOptions: {
        ...(limit !== -1 && { limit }),
      },
    };
  },
};
