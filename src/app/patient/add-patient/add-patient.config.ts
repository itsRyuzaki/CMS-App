import { IGenderConfig } from '../../Core/interfaces/common.interface';

export const GENDER_CONFIG: IGenderConfig = {
  name: 'gender',
  data: [
    {
      value: 'Male',
      label: 'Male',
    },
    {
      value: 'Female',
      label: 'Female',
    },
    {
      value: 'Other',
      label: 'Other',
    },
  ],
};

export const DEFAULT_CATEGORY_OPTION = {
  categoryId: '',
  type: 'No categories...',
};
