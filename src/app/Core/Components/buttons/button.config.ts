import { BUTTON_IDs } from '../../Config/global-config';
import { IButtonConfig } from '../../interfaces/button.interface';

export const buttonConfigs: { [x: string]: IButtonConfig } = {
  [BUTTON_IDs.searchRedirect]: {
    label: 'Search',
  },
  [BUTTON_IDs.addPatient]: {
    label: 'Add Patient',
  },
  [BUTTON_IDs.editPateint]: {
    label: 'Edit Details',
  },
  [BUTTON_IDs.addCategory]: {
    label: 'Add Category',
  },
  [BUTTON_IDs.save]: {
    label: 'Save',
    loadingLabel: 'Saving...',
  },
  [BUTTON_IDs.addMedicalRecord]: {
    label: 'Medical Record',
  },
  [BUTTON_IDs.cancel]: {
    label: 'Cancel',
  },
  [BUTTON_IDs.add]: {
    label: 'Add',
  },
  [BUTTON_IDs.submitPatientForm]: {
    label: 'Submit Details',
    loadingLabel: 'Submitting...',
  },
  [BUTTON_IDs.update]: {
    label: 'Update',
    loadingLabel: 'Updating...',
  },
};
