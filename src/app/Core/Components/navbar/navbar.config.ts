import { INavItems } from './../../interfaces/navbar.interface';


export const DEFAULT_PAGE = 'Dashboard';

export const APP_NAME = 'CMS App';

export const navItemsConfig: INavItems[] = [
  {
    title: 'Clinics',
    link: '/clinics',
  },
  {
    title: DEFAULT_PAGE,
    link: '/',
  },
  {
    title: 'Patients',
    link: '/patients',
  },
];
