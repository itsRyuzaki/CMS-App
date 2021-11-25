import { INavItems } from './../../interfaces/navbar.interface';


export const DEFAULT_PAGE = 'Dashboard';

export const APP_NAME = 'CMS App';

export const navItemsConfig: INavItems[] = [
  {
    title: 'My Clinics',
    link: '/clinic',
  },
  {
    title: DEFAULT_PAGE,
    link: '/',
  },
  {
    title: 'About',
    link: '/about',
  },
];
