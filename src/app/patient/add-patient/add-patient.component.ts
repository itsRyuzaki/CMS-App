import { Router } from '@angular/router';
import { HelperUtil } from './../../Core/Utility/helper-utility';
import { SessionStorageUtil } from '../../Core/Utility/session-storage.utility';
import { PlatformService } from './../../Core/Services/platform.service';
import {
  BUTTON_IDs,
  MONTHS,
  PAGE_URLs,
  SESSION_CONFIG,
} from './../../Core/Config/global-config';
import { IGenderConfig } from '../../Core/interfaces/common.interface';
import { AfterViewInit, Component, OnInit } from '@angular/core';
import { DEFAULT_CATEGORY_OPTION, GENDER_CONFIG } from './add-patient.config';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-add-patient',
  templateUrl: './add-patient.component.html',
  styleUrls: ['./add-patient.component.scss'],
})
export class AddPatientComponent implements OnInit, AfterViewInit {
  addPatientForm: FormGroup;
  selectedClinicId: string;
  genderConfig: IGenderConfig = { ...GENDER_CONFIG };
  buttonIds = { ...BUTTON_IDs };
  categoryOptions = [{ ...DEFAULT_CATEGORY_OPTION }];
  invalidCategoryId = 'invalid';
  isCategorySelectDisabled = true;
  categoryApiStatus = {
    isLoading: false,
    hasError: false,
    hasLoaded: false,
  };
  isInvalidCompleteForm = false;
  isInvalidCategoryForm = false;
  isInvalidPersonalInfoForm = false;
  isInvalidMedicalDetailsForm = false;

  showCategoryForm = false;
  pateintDetailApiStatus = {
    isLoading: false,
    hasError: false,
    hasLoaded: false,
  };
  dueAmount = 0;

  constructor(
    private readonly platformService: PlatformService,
    private readonly router: Router
  ) {}

  ngOnInit(): void {
    const userProfile = SessionStorageUtil.getKey(SESSION_CONFIG.userConfigKey);

    this.selectedClinicId = userProfile.selectedClinicId;

    this.initializePatientForm();

    this.categoryOptions = SessionStorageUtil.getKey(
      SESSION_CONFIG.categoryConfigKey
    );
    if (this.categoryOptions && this.categoryOptions.length !== 0) {
      this.isCategorySelectDisabled = false;
    }
  }

  ngAfterViewInit(): void {
    this.addPatientForm
      .get('newPaymentDetails.fees')
      .valueChanges.subscribe((fees) => {
        this.handleFeeChanges(fees);
      });

    this.addPatientForm
      .get('newPaymentDetails.paidAmount')
      .valueChanges.subscribe((paidAmount) => {
        this.handlePaidAmountChanges(paidAmount);
      });
  }

  handlePaidAmountChanges(value): void {
    this.dueAmount = this.addPatientForm.value.newPaymentDetails.fees - value;
  }

  handleFeeChanges(value): void {
    this.dueAmount =
      value - this.addPatientForm.value.newPaymentDetails.paidAmount;
  }

  /**
   * Initialize Patient Form with Angular Reactive Form approach
   */
  initializePatientForm(): void {
    this.addPatientForm = new FormGroup({
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
        categoryDetails: new FormGroup({
          categoryTitle: new FormControl(null),
          categoryDescription: new FormControl(null),
        }),
      }),
      newPaymentDetails: new FormGroup({
        fees: new FormControl(null, [Validators.min(0)]),
        paidAmount: new FormControl(null, [Validators.min(0)]),
      }),
    });
  }

  onAddCategoryCTAClicked(): void {
    this.showCategoryForm = true;
  }

  onSaveCategoryCTAClicked(): void {
    this.categoryApiStatus.isLoading = true;
    const categoryDetails =
      this.addPatientForm.value.medicalDetails.categoryDetails;

    if (
      categoryDetails.categoryTitle &&
      categoryDetails.categoryDescription &&
      this.categoryOptions.findIndex(
        (category) =>
          category.type.toLowerCase() ===
          categoryDetails.categoryTitle.toLowerCase()
      ) === -1
    ) {
      const requestBody = {
        type: categoryDetails.categoryTitle,
        description: categoryDetails.categoryDescription,
      };

      this.platformService.saveCategory(requestBody).subscribe(
        (response) => {
          if (response.errorDetails === null) {
            this.showCategoryForm = false;
          }

          // If disabled then it means only default value is there so overwrite
          if (this.isCategorySelectDisabled) {
            this.isCategorySelectDisabled = false;
            this.categoryOptions = [{ ...response.data }];
          } else {
            this.categoryOptions.push(response.data);
          }
          SessionStorageUtil.setKey(
            SESSION_CONFIG.categoryConfigKey,
            this.categoryOptions
          );
          this.categoryApiStatus.isLoading = false;
          this.categoryApiStatus.hasLoaded = true;
          setTimeout(() => {
            this.categoryApiStatus.hasLoaded = false;
          }, 3000);
        },
        (err) => {
          this.categoryApiStatus.isLoading = false;
          this.categoryApiStatus.hasError = true;
          setTimeout(() => {
            this.categoryApiStatus.hasError = false;
          }, 3000);
        }
      );
    } else {
      this.categoryApiStatus.isLoading = false;
      this.isInvalidCategoryForm = true;
      setTimeout(() => {
        this.isInvalidCategoryForm = false;
      }, 3000);
    }
  }

  onSubmitPatientDetails(): void {
    if (
      this.addPatientForm.valid &&
      this.dueAmount >= 0 &&
      this.addPatientForm.value.medicalDetails.categoryId !==
        this.invalidCategoryId
    ) {
      this.pateintDetailApiStatus.isLoading = true;
      const requestBody = this.createPatientDetailsRequest();
      this.platformService.addPatientDetails(requestBody).subscribe(
        (res) => {
          this.pateintDetailApiStatus.isLoading = false;
          this.pateintDetailApiStatus.hasLoaded = true;
          this.router.navigate([...PAGE_URLs.viewPatient(res.data.patientId)]);
        },
        (err) => {
          this.pateintDetailApiStatus.isLoading = false;
          this.pateintDetailApiStatus.hasError = true;
          setTimeout(() => {
            this.pateintDetailApiStatus.hasError = false;
          }, 3000);
        }
      );
    } else {
      this.isInvalidCompleteForm = true;
      this.isInvalidPersonalInfoForm =
        this.addPatientForm.controls.personalDetails.invalid;
      this.isInvalidMedicalDetailsForm =
        this.addPatientForm.controls.medicalDetails.invalid ||
        this.addPatientForm.value.medicalDetails.categoryId ===
          this.invalidCategoryId;
      setTimeout(() => {
        this.isInvalidCompleteForm = false;
        this.isInvalidPersonalInfoForm = false;
        this.isInvalidMedicalDetailsForm = false;
      }, 10000);
    }
  }

  createPatientDetailsRequest(): any {
    // Get initial values from form
    const patientDetails = {
      ...this.addPatientForm.value.personalDetails,
      clinicId: this.selectedClinicId,
      totalVisits: 1,
      pendingAmount: 0,
      lastModified: HelperUtil.getStringifiedDate(new Date()),
    };
    const medicalDetails = { ...this.addPatientForm.value.medicalDetails };
    const newPaymentDetails = {
      transactions: [],
      categoryId: this.addPatientForm.value.medicalDetails.categoryId,
    };

    // Update medical details
    medicalDetails.dateOfVisit = HelperUtil.getConvertedDateObj(
      new Date(medicalDetails.dateOfVisit)
    );
    medicalDetails.followUpDate = HelperUtil.getConvertedDateObj(
      new Date(medicalDetails.followUpDate)
    );

    // Update payment details
    newPaymentDetails.transactions = [
      {
        fees: this.addPatientForm.value.newPaymentDetails.fees,
        paidAmount: this.addPatientForm.value.newPaymentDetails.paidAmount,
        date: HelperUtil.getConvertedDateObj(new Date()),
      },
    ];

    return {
      patientDetails,
      medicalDetails,
      newPaymentDetails,
    };
  }
}
