import { ITableConfig } from '../../interfaces/table.interface';
import { TABLE_IDs, PAGE_URLs } from './../../Config/global-config';

export const TABLE_CONFIG: { [x: string]: ITableConfig } = {
  [TABLE_IDs.pending]: {
    tableHeading: 'Pending',
    columnConfig: [
      {
        property: 'name',
        label: 'Name',
      },
      {
        property: 'category',
        label: 'Category',
      },
      {
        property: 'age',
        label: 'Age',
      },
      {
        property: 'gender',
        label: 'Gender',
      },
      {
        property: 'phoneNumber',
        label: 'Phone No.',
      },
      {
        property: 'dueAmount',
        label: 'Due Amount(in ₹)',
      },
    ],
    navigationConfig: {
      viewURL: PAGE_URLs.viewPatient,
      editURL: PAGE_URLs.editPatient,
    },
  },
  [TABLE_IDs.followUp]: {
    tableHeading: 'Follow Up',
    columnConfig: [
      {
        property: 'name',
        label: 'Name',
      },
      {
        property: 'category',
        label: 'Category',
      },
      {
        property: 'age',
        label: 'Age',
      },
      {
        property: 'phoneNumber',
        label: 'Phone No.',
      },
      {
        property: 'dateOfVisit',
        label: 'Last Visit',
      },
      {
        property: 'followUpDate',
        label: 'Next Follow Up',
      },
    ],
    navigationConfig: {
      viewURL: PAGE_URLs.viewPatient,
      editURL: PAGE_URLs.editPatient,
    },
  },
  [TABLE_IDs.allPatients]: {
    tableHeading: null,
    columnConfig: [
      {
        property: 'name',
        label: 'Name',
      },
      {
        property: 'age',
        label: 'Age',
      },
      {
        property: 'gender',
        label: 'Gender',
      },
      {
        property: 'phoneNumber',
        label: 'Phone No.',
      },
      {
        property: 'totalVisits',
        label: 'Total Visits',
      },
      {
        property: 'pendingAmount',
        label: 'Due Amount(in ₹)',
      },
      {
        property: 'lastModified',
        label: 'Last Modified',
      },
    ],
    navigationConfig: {
      viewURL: PAGE_URLs.viewPatient,
      editURL: PAGE_URLs.editPatient,
    },
  },
};
