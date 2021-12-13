import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs/operators';

import { navItemsConfig, APP_NAME, DEFAULT_PAGE } from './navbar.config';
import { INavItems } from './../../interfaces/navbar.interface';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent implements OnInit {
  appName = APP_NAME;
  navItems: INavItems[];
  selectedPageIndex = 0;
  parentURL: string;
  urlProperty = 'url';
  constructor(private readonly router: Router) {}

  ngOnInit(): void {
    this.navItems = [...navItemsConfig];
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe((event) => {
        this.navItems[this.selectedPageIndex].isActive = false;

        const url = event[this.urlProperty] + '/';
        this.parentURL = url.split('/')[1];

        if (this.parentURL === '') {
          this.selectedPageIndex = this.navItems.findIndex(
            (navItem) => navItem.title === DEFAULT_PAGE
          );
        } else {
          this.selectedPageIndex = this.navItems.findIndex(
            (navItem) => navItem.link.indexOf(this.parentURL) !== -1
          );
        }

        this.navItems[this.selectedPageIndex].isActive = true;
      });
  }
}
