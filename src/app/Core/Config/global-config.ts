export const BUTTON_IDs = {
  addPatient: 'addPatientBtn',
  searchRedirect: 'searchRedirectBtn',
  addCategory: 'addCategoryBtn',
  submitPatientForm: 'submitPatientFormBtn',
  editPateint: 'editPatientBtn',
  addMedicalRecord: 'addMedicalRecord',
  save: 'saveBtn',
  cancel: 'cancelBtn',
  add: 'addBtn',
  update: 'updateBtn',
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

export const DETAILS_PAGE = 'DETAILS';
export const PENDING_PAGE = 'PENDING';
export const FOLLOW_UP_PAGE = 'FOLLOW-UP';

export const CATEGORY_KEY = 'categoryId';
