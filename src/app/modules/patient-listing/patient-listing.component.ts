import { Component, OnInit } from '@angular/core';
import { TABLE_IDs } from './../../Core/Config/global-config';
import { AGE_OPTIONS } from './../../Core/Config/search-bar.config';
import { IRowDataConfig } from './../../Core/interfaces/table.interface';
import { PlatformService } from './../../Core/Services/platform.service';
import { HelperUtil } from './../../Core/Utility/helper-utility';
import { RequestUtil } from './../../Core/Utility/request-utility';

@Component({
  selector: 'app-patient-listing',
  templateUrl: './patient-listing.component.html',
  styleUrls: ['./patient-listing.component.scss'],
})
export class PatientListingComponent implements OnInit {
  tableIds = { ...TABLE_IDs };
  patientList: { data: IRowDataConfig[]; isLoading: boolean } = {
    data: [],
    isLoading: true,
  };
  masterPatientList: IRowDataConfig[] = [];
  categoriesMasterData = new Map();
  categoryKey = 'categoryId';
  patientkey = 'patientId';
  sortProperty = '';

  constructor(private readonly platformService: PlatformService) {}

  ngOnInit(): void {
    this.getPatientsList();
  }

  /**
   * Get pending patients list and populate data required for the table
   */
  getPatientsList(): void {
    const requestBody = RequestUtil.patientDetails({});

    this.platformService.getPatients(requestBody).subscribe(
      (res) => {
        this.patientList.data = res.data.map((details: any): IRowDataConfig => {
          return {
            rowData: {
              ...details,
              phoneNumber: details.phoneNumber.primary,
            },
            id: details.patientId,
          };
        });
        this.masterPatientList = JSON.parse(
          JSON.stringify(this.patientList.data)
        );
        this.patientList.isLoading = false;
      },
      (err) => {
        this.patientList.isLoading = false;
      }
    );
  }

  handleSearchFormChanges(formData): void {
    this.patientList.isLoading = true;
    this.patientList.data = this.masterPatientList.filter((details) => {
      return (
        details.rowData.name
          .toLowerCase()
          .indexOf(formData.name.toLowerCase()) !== -1 &&
        details.rowData.phoneNumber
          .toLowerCase()
          .indexOf(formData.phoneNumber.toLowerCase()) !== -1 &&
        this.ageSearchUtil(+details.rowData.age, formData.age)
      );
    });
    this.sortProperty = formData.sortBy;
    this.patientList.data.sort(this.sortComparator);
    this.patientList.isLoading = false;
  }

  ageSearchUtil(currentValue: number, ageOptionId: string): boolean {
    const index = AGE_OPTIONS.findIndex(
      (ageOption) => ageOption.id === ageOptionId
    );
    return (
      currentValue >= AGE_OPTIONS[index].min &&
      currentValue <= AGE_OPTIONS[index].max
    );
  }

  sortComparator = (
    firstEl: IRowDataConfig,
    secondEl: IRowDataConfig
  ): number => {
    let value = -1;
    let el1 = 0;
    let el2 = 0;
    switch (this.sortProperty) {
      case 'name':
        value = firstEl.rowData.name.localeCompare(secondEl.rowData.name);
        break;
      case 'age':
        el1 = +firstEl.rowData.age;
        el2 = +secondEl.rowData.age;
        value = el1 > el2 ? 1 : el1 < el2 ? -1 : 0;
        break;
      case 'pendingAmount':
        el1 = +firstEl.rowData.pendingAmount;
        el2 = +secondEl.rowData.pendingAmount;
        value = el1 > el2 ? 1 : el1 < el2 ? -1 : 0;
        break;
      case 'totalVisits':
        el1 = +firstEl.rowData.totalVisits;
        el2 = +secondEl.rowData.totalVisits;
        value = el1 > el2 ? 1 : el1 < el2 ? -1 : 0;
        break;
      case 'lastModified':
        const date1 = HelperUtil.getConvertedDateObj(
          new Date(firstEl.rowData.lastModified)
        );
        const date2 = HelperUtil.getConvertedDateObj(
          new Date(secondEl.rowData.lastModified)
        );
        value = HelperUtil.dateComparator(date1, date2);
        break;
      default:
        value = -1;
    }
    return value;
  };
}
