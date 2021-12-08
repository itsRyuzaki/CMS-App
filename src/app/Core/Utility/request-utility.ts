export const RequestUtil = {
  pendingPatients: (
    isDetailsPage: boolean,
    filter: any,
    limit: number
  ) => {
    return {
      filter,
      projection: {},
      queryOptions: {
        limit,
      },
      pageType: isDetailsPage ? 'DETAILS' : 'PENDING',
    };
  },
  followUpPatients: (
    isDetailsPage: boolean,
    filter: any,
    limit: number
  ) => {
    return {
      filter: {
        'followUpDate.day': {
          $gt: 9,
        },
        'followUpDate.month': {
          $gte: 11,
        },
        'followUpDate.year': {
          $gte: 2021,
        },
      },
      projection: {
        diagnosis: 0,
        symptoms: 0,
        investigation: 0,
        treatment: 0,
        notes: 0,
        physicalExamination: 0,
      },
      queryOptions: {
        skip: 0,
        limit: 5,
      },
      pageType: 'FOLLOW-UP',
    };
  },
};
