import { SESSION_CONFIG } from './../../Core/Config/global-config';
import { SessionStorageUtil } from './../../Core/Utility/session-storage.utility';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {
  BUTTON_IDs,
  PAGE_URLs,
  TABLE_IDs,
} from 'src/app/Core/Config/global-config';
import { PlatformService } from 'src/app/Core/Services/platform.service';
import { RequestUtil } from '../../Core/Utility/request-utility';
import { IRowDataConfig } from './../../Core/interfaces/table.interface';
import { HelperUtil } from './../../Core/Utility/helper-utility';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  buttonIds = { ...BUTTON_IDs };
  tableIds = { ...TABLE_IDs };
  pendingPatients: { data: IRowDataConfig[]; isLoading: boolean } = {
    data: [],
    isLoading: true,
  };
  followUpPatients: { data: IRowDataConfig[]; isLoading: boolean } = {
    data: [],
    isLoading: true,
  };
  categoriesMasterData = new Map();
  patientsMasterData = new Map();
  categoryKey = 'categoryId';
  patientkey = 'patientId';

  constructor(
    private readonly router: Router,
    private readonly platformService: PlatformService
  ) {}

  ngOnInit(): void {
    this.getCategories();
    this.getPendingPatients();
    this.getFollowUpPatients();
  }

  /**
   * Get a master list of all categories
   */
  getCategories(): void {
    const categories = SessionStorageUtil.getKey(
      SESSION_CONFIG.categoryConfigKey
    );
    HelperUtil.createMapFromArray(
      categories,
      this.categoryKey,
      this.categoriesMasterData
    );
  }

  /**
   * Get pending patients list and populate data required for the table
   */
  getPendingPatients(): void {
    const requestBody = RequestUtil.paymentRecords(false, {}, 5);

    this.platformService.getPaymentRecords(requestBody).subscribe(
      (res) => {
        HelperUtil.createMapFromArray(
          res.patientDetails,
          this.patientkey,
          this.patientsMasterData
        );

        this.pendingPatients.data = res.paymentRecords.map(
          (details: any): IRowDataConfig => {
            return {
              rowData: {
                ...details,
                name: this.patientsMasterData.get(details[this.patientkey])
                  .name,
                age: this.patientsMasterData.get(details[this.patientkey]).age,
                gender: this.patientsMasterData.get(details[this.patientkey])
                  .gender,
                category: this.categoriesMasterData.get(
                  details[this.categoryKey]
                ).type,
                phoneNumber: this.patientsMasterData.get(
                  details[this.patientkey]
                ).phoneNumber.primary,
              },
              id: details.patientId,
            };
          }
        );
        this.pendingPatients.isLoading = false;
      },
      (err) => {
        this.pendingPatients.isLoading = false;
      }
    );
  }

  /**
   * Get Follow up patients list and populate data required for the table
   */
  getFollowUpPatients(): void {
    const requestBody = RequestUtil.medicalRecords(false, {}, 5);
    this.platformService.getMedicalRecords(requestBody).subscribe(
      (res) => {
        HelperUtil.createMapFromArray(
          res.patientDetails,
          this.patientkey,
          this.patientsMasterData
        );

        this.followUpPatients.data = res.medicalRecords.map(
          (details: any): IRowDataConfig => {
            return {
              rowData: {
                dateOfVisit: HelperUtil.getStringifiedDate(
                  details.dateOfVisit,
                  true
                ),
                followUpDate: HelperUtil.getStringifiedDate(
                  details.followUpDate,
                  true
                ),
                name: this.patientsMasterData.get(details[this.patientkey])
                  .name,
                age: this.patientsMasterData.get(details[this.patientkey]).age,
                category: this.categoriesMasterData.get(
                  details[this.categoryKey]
                ).type,
                phoneNumber: this.patientsMasterData.get(
                  details[this.patientkey]
                ).phoneNumber.primary,
              },
              id: details.patientId,
            };
          }
        );
        this.followUpPatients.isLoading = false;
      },
      (err) => {
        this.followUpPatients.isLoading = false;
      }
    );
  }

  /**
   * Navigate to add Patient page
   */
  onAddPatientCTAClicked(): void {
    this.router.navigate([...PAGE_URLs.addPatient]);
  }

  /**
   * Naviagte to patient listing
   */
  onSearchCTAClicked(): void {
    this.router.navigate([...PAGE_URLs.allPatients]);
  }
}
