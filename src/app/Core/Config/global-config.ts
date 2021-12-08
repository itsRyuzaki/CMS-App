export const BUTTON_IDs = {
  addPatient: 'addPatientBtn',
  searchRedirect: 'searchRedirectBtn',
  addCategory: 'addCategoryBtn',
  saveCategory: 'saveCategoryBtn',
  submitPatientForm: 'submitPatientFormBtn',
  submitCategoryForm: 'submitCategoryFormBtn',
};

export const MONTHS = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

export const SESSION_CONFIG = {
  userConfigKey: 'UserProfile',
  categoryConfigKey: 'CategoryConfig',
};

export const TABLE_IDs = {
  pending: 'pending',
  followUp: 'followUp',
  allPatients: 'allPatients',
};

export const PAGE_URLs = {
  allPatients: ['/patients'],
  addPatient: ['/patient', 'add'],
  viewPatient: (id: string) => {
    return ['/patient', id];
  },
  editPatient: (id: string) => {
    return ['/patient', id, 'edit'];
  },
};
