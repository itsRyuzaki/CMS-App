import { IAgeOption, IOptionConfig } from '../interfaces/common.interface';

export const AGE_OPTIONS: IAgeOption[] = [
  {
    min: 0,
    max: 1000,
    label: 'Any',
    id: 'Any',
  },
  {
    min: 0,
    max: 10,
    label: '0-10',
    id: 'first',
  },
  {
    min: 11,
    max: 20,
    label: '11-20',
    id: 'second',
  },
  {
    min: 21,
    max: 30,
    label: '21-30',
    id: 'third',
  },
  {
    min: 31,
    max: 40,
    label: '31-40',
    id: 'fourth',
  },
  {
    min: 41,
    max: 50,
    label: '41-50',
    id: 'fifth',
  },
  {
    min: 51,
    max: 60,
    label: '51-60',
    id: 'sixth',
  },
  {
    min: 61,
    max: 1000,
    label: 'Above 60',
    id: 'last',
  },
];

export const SORT_OPTIONS: IOptionConfig[] = [
  {
    value: 'name',
    label: 'Name',
  },
  {
    value: 'age',
    label: 'Age',
  },
  {
    value: 'lastModified',
    label: 'Last Visit',
  },
  {
    value: 'pendingAmount',
    label: 'Pending Amount',
  },
  {
    value: 'totalVisits',
    label: 'Total Visits',
  },
];
