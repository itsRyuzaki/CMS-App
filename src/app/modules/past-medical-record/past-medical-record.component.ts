import { Component, Input, OnInit } from '@angular/core';
import {
  CATEGORY_KEY, SESSION_CONFIG
} from 'src/app/Core/Config/global-config';
import {
  ICategoryModel,
  IMedicalRecord
} from 'src/app/Core/interfaces/api-response.interface';
import { PlatformService } from 'src/app/Core/Services/platform.service';
import { HelperUtil } from 'src/app/Core/Utility/helper-utility';
import { RequestUtil } from 'src/app/Core/Utility/request-utility';
import { SessionStorageUtil } from 'src/app/Core/Utility/session-storage.utility';

@Component({
  selector: 'app-past-medical-record',
  templateUrl: './past-medical-record.component.html',
  styleUrls: ['./past-medical-record.component.scss'],
})
export class PastMedicalRecordComponent implements OnInit {
  @Input() patientId: string;
  categoriesMasterData = new Map<string, ICategoryModel>();
  medicalRecordStatus: {
    data: Partial<IMedicalRecord>[];
    isLoading: boolean;
    hasError: boolean;
  } = {
    data: [],
    isLoading: true,
    hasError: false,
  };

  constructor(private readonly platformService: PlatformService) {}

  ngOnInit(): void {
    HelperUtil.createMapFromArray(
      SessionStorageUtil.getKey(SESSION_CONFIG.categoryConfigKey),
      CATEGORY_KEY,
      this.categoriesMasterData
    );
    this.getMedicalRecords();
  }

  getMedicalRecords(): void {
    const requestBody = RequestUtil.medicalRecords(true, {
      patientId: this.patientId,
    });
    this.platformService.getMedicalRecords(requestBody).subscribe(
      (res) => {
        this.medicalRecordStatus = {
          ...this.medicalRecordStatus,
          data: res.medicalRecords,
          isLoading: false,
        };

        this.medicalRecordStatus.data.forEach((element) => {
          element.stringifiedVisitDate = HelperUtil.getStringifiedDate(
            element.dateOfVisit,
            true
          );
          element.stringifiedFollowUpDate = HelperUtil.getStringifiedDate(
            element.followUpDate,
            true
          );
        });
      },
      (err) => {
        this.medicalRecordStatus = {
          ...this.medicalRecordStatus,
          isLoading: false,
          hasError: true,
        };
      }
    );
  }
}
