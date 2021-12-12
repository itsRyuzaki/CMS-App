import { AfterViewInit, Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import {
    IDialogResponse,
    IGenderConfig
} from '../../Core/interfaces/common.interface';
import { SessionStorageUtil } from '../../Core/Utility/session-storage.utility';
import { AddCategoryDialogComponent } from './../../Core/Components/Modals/add-category-dialog/add-category-dialog.component';
import {
    BUTTON_IDs,
    PAGE_URLs,
    SESSION_CONFIG
} from './../../Core/Config/global-config';
import { IPatientModel } from './../../Core/interfaces/api-response.interface';
import { PlatformService } from './../../Core/Services/platform.service';
import { HelperUtil } from './../../Core/Utility/helper-utility';
import { RequestUtil } from './../../Core/Utility/request-utility';
import { DEFAULT_CATEGORY_OPTION, GENDER_CONFIG } from './patient-form.config';

@Component({
  selector: 'app-patient-form',
  templateUrl: './patient-form.component.html',
  styleUrls: ['./patient-form.component.scss'],
})
export class PatientFormComponent implements OnInit, AfterViewInit {
  @Input() patientId: string;
  @Input() isEditPage = false;
  patientForm: FormGroup;
  selectedClinicId: string;
  genderConfig: IGenderConfig = { ...GENDER_CONFIG };
  buttonIds = { ...BUTTON_IDs };
  categoryOptions = [{ ...DEFAULT_CATEGORY_OPTION }];
  invalidCategoryId = 'invalid';
  isCategorySelectDisabled = true;
  isCategoryAdded = false;
  isInvalidCompleteForm = false;
  isInvalidCategoryForm = false;
  isInvalidPersonalInfoForm = false;
  isInvalidMedicalDetailsForm = false;
  isInvalidPaymentDetailsForm = false;
  totalVisits = 1;

  setPatientDetailStatus = {
    isLoading: false,
    hasError: false,
    hasLoaded: false,
  };
  personalInfoStatus: {
    data: IPatientModel;
    isLoading: boolean;
    hasError: boolean;
  } = {
    data: {},
    isLoading: false,
    hasError: false,
  };
  dueAmount = 0;
  showMedicalRecordBtn = true;
  showMedicalRecordForm = true;

  constructor(
    private readonly platformService: PlatformService,
    private readonly router: Router,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    const userProfile = SessionStorageUtil.getKey(SESSION_CONFIG.userConfigKey);

    this.selectedClinicId = userProfile.selectedClinicId;

    this.initializePatientForm();

    if (this.isEditPage) {
      this.getPersonalDetails();
      this.showMedicalRecordForm = false;
    }

    this.categoryOptions = SessionStorageUtil.getKey(
      SESSION_CONFIG.categoryConfigKey
    );
    if (this.categoryOptions && this.categoryOptions.length !== 0) {
      this.isCategorySelectDisabled = false;
    }
  }

  ngAfterViewInit(): void {
    this.patientForm
      .get('newPaymentDetails.fees')
      .valueChanges.subscribe((fees) => {
        this.handleFeeChanges(fees);
      });

    this.patientForm
      .get('newPaymentDetails.paidAmount')
      .valueChanges.subscribe((paidAmount) => {
        this.handlePaidAmountChanges(paidAmount);
      });
  }

  handlePaidAmountChanges(value): void {
    this.dueAmount = this.patientForm.value.newPaymentDetails.fees - value;
  }

  handleFeeChanges(value): void {
    this.dueAmount =
      value - this.patientForm.value.newPaymentDetails.paidAmount;
  }

  /**
   * Initialize Patient Form with Angular Reactive Form approach
   */
  initializePatientForm(): void {
    this.patientForm = new FormGroup({
      personalDetails: new FormGroup({
        name: new FormControl(null, [Validators.required]),
        age: new FormControl(null, [Validators.required, Validators.min(0)]),
        gender: new FormControl('Male', [Validators.required]),
        address: new FormGroup({
          area: new FormControl(null),
          pincode: new FormControl(null, [Validators.min(0)]),
          city: new FormControl(null),
          state: new FormControl(null),
        }),
        phoneNumber: new FormGroup({
          primary: new FormControl(null, [
            Validators.required,
            Validators.min(0),
          ]),
          secondary: new FormControl(null, [Validators.min(0)]),
        }),
      }),
      medicalDetails: new FormGroup({
        categoryId: new FormControl('invalid', Validators.required),
        symptoms: new FormControl(null),
        diagnosis: new FormControl(null),
        investigation: new FormControl(null),
        treatment: new FormControl(null),
        notes: new FormControl(null),
        dateOfVisit: new FormControl(null, [Validators.required]),
        followUpDate: new FormControl(null),
        physicalExamination: new FormGroup({
          bloodPressure: new FormControl(null),
          temperature: new FormControl(null),
          pulse: new FormControl(null),
          weight: new FormControl(null),
        }),
      }),
      newPaymentDetails: new FormGroup({
        fees: new FormControl(0, [Validators.min(0)]),
        paidAmount: new FormControl(0, [Validators.min(0)]),
      }),
    });
  }

  onAddCategoryCTAClicked(): void {
    const dialogRef = this.dialog.open(AddCategoryDialogComponent);

    dialogRef.afterClosed().subscribe((response: IDialogResponse) => {
      if (response.isSuccess) {
        // If disabled then it means only default value is there so overwrite
        if (this.isCategorySelectDisabled) {
          this.isCategorySelectDisabled = false;
          this.categoryOptions = [{ ...response.data }];
        } else {
          this.categoryOptions.push(response.data);
        }
        this.isCategoryAdded = true;

        setTimeout(() => {
          this.isCategoryAdded = false;
        }, 3000);
      }
    });
  }

  onMedicalRecordCTAClicked(): void {
    this.showMedicalRecordBtn = !this.showMedicalRecordBtn;
    this.showMedicalRecordForm = !this.showMedicalRecordForm;
  }

  onSubmitPatientDetails(): void {
    if (
      this.patientForm.valid &&
      this.dueAmount >= 0 &&
      this.patientForm.value.medicalDetails.categoryId !==
        this.invalidCategoryId
    ) {
      this.setPatientDetailStatus.isLoading = true;
      const requestBody = this.createPatientDetailsRequest();
      this.platformService.addPatientDetails(requestBody).subscribe(
        (res) => {
          this.setPatientDetailStatus.isLoading = false;
          this.setPatientDetailStatus.hasLoaded = true;
          this.router.navigate([...PAGE_URLs.viewPatient(res.data.patientId)]);
        },
        (err) => {
          this.setPatientDetailStatus.isLoading = false;
          this.setPatientDetailStatus.hasError = true;
          setTimeout(() => {
            this.setPatientDetailStatus.hasError = false;
          }, 3000);
        }
      );
    } else {
      this.isInvalidCompleteForm = true;
      this.isInvalidPersonalInfoForm =
        this.patientForm.controls.personalDetails.invalid;
      this.isInvalidMedicalDetailsForm =
        this.patientForm.controls.medicalDetails.invalid ||
        this.patientForm.value.medicalDetails.categoryId ===
          this.invalidCategoryId;
      this.isInvalidPaymentDetailsForm =
        this.patientForm.controls.newPaymentDetails.invalid;
      setTimeout(() => {
        this.isInvalidCompleteForm = false;
        this.isInvalidPersonalInfoForm = false;
        this.isInvalidMedicalDetailsForm = false;
        this.isInvalidPaymentDetailsForm = false;
      }, 10000);
    }
  }

  onUpdatePatientDetails(): void {
    // if btn is shown then it means form is hidden so dont check medical and payment details validity
    if (
      this.patientForm.controls.personalDetails.valid &&
      (!this.showMedicalRecordForm ||
        (this.patientForm.valid &&
          this.dueAmount >= 0 &&
          this.patientForm.value.medicalDetails.categoryId !==
            this.invalidCategoryId))
    ) {
      this.setPatientDetailStatus.isLoading = true;
      const requestBody = {
        ...this.createPatientDetailsRequest(),
        patientId: this.patientId,
      };
      this.platformService.updatePatientDetails(requestBody).subscribe(
        (res) => {
          this.setPatientDetailStatus.isLoading = false;
          this.setPatientDetailStatus.hasLoaded = true;
          this.router.navigate([...PAGE_URLs.viewPatient(res.data.patientId)]);
        },
        (err) => {
          this.setPatientDetailStatus.isLoading = false;
          this.setPatientDetailStatus.hasError = true;
          setTimeout(() => {
            this.setPatientDetailStatus.hasError = false;
          }, 3000);
        }
      );
    } else {
      this.isInvalidCompleteForm = true;
      this.isInvalidPersonalInfoForm =
        this.patientForm.controls.personalDetails.invalid;
      this.isInvalidMedicalDetailsForm =
        this.patientForm.controls.medicalDetails.invalid ||
        this.patientForm.value.medicalDetails.categoryId ===
          this.invalidCategoryId;
      this.isInvalidPaymentDetailsForm =
        this.patientForm.controls.newPaymentDetails.invalid;
      setTimeout(() => {
        this.isInvalidCompleteForm = false;
        this.isInvalidPersonalInfoForm = false;
        this.isInvalidMedicalDetailsForm = false;
        this.isInvalidPaymentDetailsForm = false;
      }, 10000);
    }
  }

  createPatientDetailsRequest(): any {
    // Get initial values from form
    const patientDetails = {
      ...this.patientForm.value.personalDetails,
      clinicId: this.selectedClinicId,
      totalVisits: this.totalVisits,
      pendingAmount: 0,
      lastModified: HelperUtil.getStringifiedDate(new Date()),
    };
    let medicalDetails = { ...this.patientForm.value.medicalDetails };
    let newPaymentDetails = {
      transactions: [],
      categoryId: this.patientForm.value.medicalDetails.categoryId,
    };

    if (this.showMedicalRecordForm) {
      // Update medical details
      medicalDetails.dateOfVisit = HelperUtil.getConvertedDateObj(
        new Date(medicalDetails.dateOfVisit)
      );
      medicalDetails.followUpDate =
        medicalDetails.followUpDate === null
          ? null
          : HelperUtil.getConvertedDateObj(
              new Date(medicalDetails.followUpDate)
            );

      // Update payment details
      newPaymentDetails.transactions = [
        {
          fees: this.patientForm.value.newPaymentDetails.fees,
          paidAmount: this.patientForm.value.newPaymentDetails.paidAmount,
          date: HelperUtil.getConvertedDateObj(new Date()),
        },
      ];
    } else {
      medicalDetails = null;
      newPaymentDetails = null;
    }

    return {
      patientDetails,
      medicalDetails,
      newPaymentDetails,
    };
  }

  getPersonalDetails(): void {
    this.personalInfoStatus.isLoading = true;
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
        this.totalVisits = this.personalInfoStatus.data.totalVisits + 1;
        this.patientForm.get('personalDetails').patchValue({
          name: this.personalInfoStatus.data.name,
          age: this.personalInfoStatus.data.age,
          address: {
            area: this.personalInfoStatus.data.address.area,
            pincode: +this.personalInfoStatus.data.address.pincode,
            city: this.personalInfoStatus.data.address.city,
            state: this.personalInfoStatus.data.address.state,
          },
          gender: this.personalInfoStatus.data.gender,
          phoneNumber: {
            primary: +this.personalInfoStatus.data.phoneNumber.primary,
            secondary: +this.personalInfoStatus.data.phoneNumber.secondary,
          },
        });
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
}
