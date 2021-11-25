import { navItemsConfig, APP_NAME, DEFAULT_PAGE } from './navbar.config';
import { INavItems } from './../../interfaces/navbar.interface';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent implements OnInit {
  appName = APP_NAME;
  navItems: INavItems[];
  selectedPageIndex: number;
  constructor() {}

  ngOnInit(): void {
    this.navItems = [...navItemsConfig];
    this.selectedPageIndex = this.navItems.findIndex( navItem => navItem.title === DEFAULT_PAGE);
    this.navItems[this.selectedPageIndex].isActive = true;

  }
}
