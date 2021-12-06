import { ENDPOINT_CONFIG } from './../../Config/endpoint.config';
import { IButtonConfig } from '../../interfaces/button.interface';
import { BUTTON_IDs } from '../../Config/global-config';

export const buttonConfigs: { [x: string]: IButtonConfig } = {
  [BUTTON_IDs.searchRedirect]: {
    id: BUTTON_IDs.searchRedirect,
    label: 'Search',
  },
  [BUTTON_IDs.addPatient]: {
    id: BUTTON_IDs.addPatient,
    label: 'Add Patient',
  },
  [BUTTON_IDs.addCategory]: {
    id: BUTTON_IDs.addCategory,
    label: 'Add Category',
  },
  [BUTTON_IDs.saveCategory]: {
    id: BUTTON_IDs.saveCategory,
    label: 'Save',
    apiURL: ENDPOINT_CONFIG.addCategory,
  },
  [BUTTON_IDs.submitPatientForm]: {
    id: BUTTON_IDs.submitPatientForm,
    label: 'Submit Details',
    loadingLabel: 'Submitting...',
  },
};
