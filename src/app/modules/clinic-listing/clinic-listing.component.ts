import { SESSION_CONFIG } from './../../Core/Config/global-config';
import { SessionStorageUtil } from './../../Core/Utility/session-storage.utility';
import { PlatformService } from './../../Core/Services/platform.service';
import { IClinicModel } from './../../Core/interfaces/api-response.interface';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-clinic-listing',
  templateUrl: './clinic-listing.component.html',
  styleUrls: ['./clinic-listing.component.scss'],
})
export class ClinicListingComponent implements OnInit {
  clinicListing: {
    data: IClinicModel[];
    isLoading: boolean;
    hasError: boolean;
  } = {
    data: [],
    isLoading: true,
    hasError: false,
  };
  constructor(private readonly platformService: PlatformService) {}

  ngOnInit(): void {
    this.getClinicList();
  }

  getClinicList(): void {
    const userConfig = SessionStorageUtil.getKey(SESSION_CONFIG.userConfigKey);
    const requestBody = {
      filter: {
        userId: userConfig?.userId,
      },
    };

    this.platformService.getClinics(requestBody).subscribe(
      (res) => {
        this.clinicListing = {
          ...this.clinicListing,
          data: res.data,
          isLoading: false,
        };
      },
      (err) => {
        this.clinicListing = {
          ...this.clinicListing,
          isLoading: false,
          hasError: true,
        };
      }
    );

  }
}
