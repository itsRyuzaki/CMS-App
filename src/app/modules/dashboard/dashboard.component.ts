import { HelperUtil } from './../../Core/Utility/helper-utility';
import { RequestUtil } from '../../Core/Utility/request-utility';
import { IRowDataConfig } from './../../Core/interfaces/table.interface';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { map } from 'rxjs/operators';
import {
  BUTTON_IDs,
  PAGE_URLs,
  TABLE_IDs,
} from 'src/app/Core/Config/global-config';
import { PlatformService } from 'src/app/Core/Services/platform.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  buttonIds = { ...BUTTON_IDs };
  tableIds = { ...TABLE_IDs };
  pendingPatientsData: IRowDataConfig[];
  followUpPatientsData: IRowDataConfig[];
  categoriesMasterData = new Map();
  patientsMasterData = new Map();
  categoryKey: 'categoryId';
  patientkey: 'patientId';

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
    this.platformService.getCategories({}).subscribe(
      (res) => {
        if (res.data.length !== 0) {
          HelperUtil.createMapFromArray(
            res.data,
            this.categoryKey,
            this.categoriesMasterData
          );
        }
      },
      (err) => {}
    );
  }

  /**
   * Get pending patients list and populate data required for the table
   */
  getPendingPatients(): void {
    const requestBody = RequestUtil.pendingPatients(false, {}, 5);
    this.platformService.getPendingPatients(requestBody).subscribe((res) => {
      HelperUtil.createMapFromArray(
        res.patientDetails,
        this.patientkey,
        this.patientsMasterData
      );

      this.pendingPatientsData = res.pendingPatients.map(
        (details: any): IRowDataConfig => {
          return {
            rowData: {
              ...details,
              name: this.patientsMasterData.get(details[this.patientkey]).name,
              age: this.patientsMasterData.get(details[this.patientkey]).age
                .value,
              gender: this.patientsMasterData.get(details[this.patientkey])
                .gender,
              category: this.categoriesMasterData.get(details[this.categoryKey])
                .type,
              phoneNumber: this.patientsMasterData.get(details[this.patientkey])
                .phoneNumber.primary,
            },
            id: details.patientId,
          };
        }
      );
    });
  }

  /**
   * Get Follow up patients list and populate data required for the table
   */
  getFollowUpPatients(): void {
    const requestBody = RequestUtil.followUpPatients(false, {}, 5);
    this.platformService.getFollowUpPatients(requestBody).subscribe((res) => {
      HelperUtil.createMapFromArray(
        res.patientDetails,
        this.patientkey,
        this.patientsMasterData
      );

      this.followUpPatientsData = res.followUpPatients.map(
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
              name: this.patientsMasterData.get(details[this.patientkey]).name,
              age: this.patientsMasterData.get(details[this.patientkey]).age
                .value,
              category: this.categoriesMasterData.get(details[this.categoryKey])
                .type,
              phoneNumber: this.patientsMasterData.get(details[this.patientkey])
                .phoneNumber.primary,
            },
            id: details.patientId,
          };
        }
      );
    });
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

