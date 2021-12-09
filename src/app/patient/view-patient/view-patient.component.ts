import { PAGE_URLs } from 'src/app/Core/Config/global-config';
import { SessionStorageUtil } from './../../Core/Utility/session-storage.utility';
import {
  SESSION_CONFIG,
  CATEGORY_KEY,
  BUTTON_IDs,
} from './../../Core/Config/global-config';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { PlatformService } from 'src/app/Core/Services/platform.service';
import {
  ICategoryModel,
  IMedicalRecord,
  IPatientModel,
  IPaymentModel,
} from './../../Core/interfaces/api-response.interface';
import { HelperUtil } from './../../Core/Utility/helper-utility';
import { RequestUtil } from './../../Core/Utility/request-utility';

@Component({
  selector: 'app-view-patient',
  templateUrl: './view-patient.component.html',
  styleUrls: ['./view-patient.component.scss'],
})
export class ViewPatientComponent implements OnInit {
  patientId: string;
  buttonIds = { ...BUTTON_IDs };
  categoriesMasterData = new Map<string, ICategoryModel>();
  personalInfoStatus: {
    data: IPatientModel;
    isLoading: boolean;
    hasError: boolean;
  } = {
    data: {},
    isLoading: true,
    hasError: false,
  };
  medicalRecordStatus: {
    data: Partial<IMedicalRecord>[];
    isLoading: boolean;
    hasError: boolean;
  } = {
    data: [],
    isLoading: true,
    hasError: false,
  };
  paymentRecordStatus: {
    data: Partial<IPaymentModel>[];
    isLoading: boolean;
    hasError: boolean;
  } = {
    data: [],
    isLoading: true,
    hasError: false,
  };
  constructor(
    private readonly platformService: PlatformService,
    private readonly route: ActivatedRoute,
    private readonly router: Router
  ) {}

  ngOnInit(): void {
    this.patientId = this.route.snapshot.params.patientId;
    HelperUtil.createMapFromArray(
      SessionStorageUtil.getKey(SESSION_CONFIG.categoryConfigKey),
      CATEGORY_KEY,
      this.categoriesMasterData
    );
    this.getPatientDetails();
    this.getMedicalRecords();
    this.getPaymentRecords();
  }

  getPatientDetails(): void {
    const requestBody = RequestUtil.patientDetails({
      patientId: this.patientId,
    });
    this.platformService.getPatients(requestBody).subscribe(
      (res) => {
        this.personalInfoStatus = {
          ...this.personalInfoStatus,
          data: res.data[0],
          isLoading: false,
        };
      },
      (err) => {
        this.personalInfoStatus = {
          ...this.personalInfoStatus,
          isLoading: false,
          hasError: true,
        };
      }
    );
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

  getPaymentRecords(): void {
    const requestBody = RequestUtil.paymentRecords(true, {
      patientId: this.patientId,
    });
    this.platformService.getPaymentRecords(requestBody).subscribe(
      (res) => {
        this.paymentRecordStatus = {
          ...this.paymentRecordStatus,
          data: res.paymentRecords,
          isLoading: false,
        };
        console.log(this.paymentRecordStatus.data);
        this.paymentRecordStatus.data.forEach((element) => {
          element.transactions.forEach((transaction) => {
            transaction.stringifiedDate = HelperUtil.getStringifiedDate(
              transaction.date,
              true
            );
          });
        });
      },
      (err) => {
        this.paymentRecordStatus = {
          ...this.paymentRecordStatus,
          isLoading: false,
          hasError: true,
        };
      }
    );
  }

  onEditPatientBtnClicked(): void {
    this.router.navigate([...PAGE_URLs.editPatient(this.patientId)]);
  }
}
