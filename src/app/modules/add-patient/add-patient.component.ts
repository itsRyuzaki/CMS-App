import { SessionStorageUtil } from '../../Core/Utility/session-storage.utility';
import { PlatformService } from './../../Core/Services/platform.service';
import {
  BUTTON_IDs,
  MONTHS,
  SESSION_CONFIG,
} from './../../Core/Config/global-config';
import { IGenderConfig } from './../../Core/interfaces/add-patient.interface';
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
  isCategorySelectDisabled = true;
  showCategoryForm = false;

  constructor(private readonly platformService: PlatformService) {}

  ngOnInit(): void {
    let userProfile = SessionStorageUtil.getKey(SESSION_CONFIG.userConfigKey);
    if (userProfile === null) {
      this.platformService.getUserProfile().subscribe((res) => {
        userProfile = res.data[0];
        SessionStorageUtil.setKey(SESSION_CONFIG.userConfigKey, userProfile);
        this.selectedClinicId = userProfile.selectedClinicId;
      });
    }

    this.initializePatientForm();

    this.platformService.getCategories({}).subscribe(
      (res) => {
        if (res.data.length !== 0) {
          this.categoryOptions = res.data;
          this.isCategorySelectDisabled = false;
        }
      },
      (err) => {}
    );
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
    console.log(value);
    const dueAmount = this.addPatientForm.value.newPaymentDetails.fees - value;
    this.addPatientForm.patchValue(
      {
        newPaymentDetails: {
          dueAmount,
        },
      },
      { onlySelf: true }
    );
  }

  handleFeeChanges(value): void {
    console.log(value);
    const dueAmount =
      value - this.addPatientForm.value.newPaymentDetails.paidAmount;
    this.addPatientForm.patchValue(
      {
        newPaymentDetails: {
          dueAmount,
        },
      },
      { onlySelf: true }
    );
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
      }),
      categoryDetails: new FormGroup({
        categoryTitle: new FormControl(null, Validators.required),
        categoryDescription: new FormControl(null, Validators.required),
      }),
      newPaymentDetails: new FormGroup({
        fees: new FormControl(null, [Validators.min(0)]),
        paidAmount: new FormControl(null, [Validators.min(0)]),
        dueAmount: new FormControl(0),
      }),
    });
  }

  onAddCategoryCTAClicked(): void {
    this.showCategoryForm = true;
  }

  onSaveCategoryCTAClicked(): void {
    const categoryDetails =
      this.addPatientForm.value.categoryDetails;

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
      },
      (err) => {}
    );
  }

  onSubmitPatientDetails(): void {
    if (this.addPatientForm.valid) {
      const requestBody = this.createPatientDetailsRequest();
      this.platformService.addPatientDetails(requestBody).subscribe((x) => {
        console.log(x);
      });
    } else if (this.addPatientForm.controls.personalDetails.invalid) {
      console.log('patient');
    } else if (this.addPatientForm.controls.medicalDetails.invalid) {
      console.log('medicalDetails');
    } else {
      console.log('payment');
    }
  }

  createPatientDetailsRequest(): any {
    // Get initial values from form
    const patientDetails = {
      ...this.addPatientForm.value.personalDetails,
      clinicId: this.selectedClinicId,
      totalVisits: 1,
      pendingAmount: 0,
    };
    const medicalDetails = { ...this.addPatientForm.value.medicalDetails };
    const newPaymentDetails = {
      ...this.addPatientForm.value.newPaymentDetails,
      categoryId: this.addPatientForm.value.medicalDetails.categoryId,
    };

    // Update patient details
    patientDetails.age = {
      value: patientDetails.age,
      lastModified: this.getStringifiedDate(),
    };

    patientDetails.pendingAmount = newPaymentDetails.dueAmount;

    // Update medical details
    medicalDetails.dateOfVisit = this.getConvertedDateObj(
      new Date(medicalDetails.dateOfVisit)
    );
    medicalDetails.followUpDate = this.getConvertedDateObj(
      new Date(medicalDetails.followUpDate)
    );

    // Update payment details
    newPaymentDetails.fees = {
      value: newPaymentDetails.fees,
      date: this.getStringifiedDate(),
    };
    newPaymentDetails.paidAmount = {
      value: newPaymentDetails.paidAmount,
      date: this.getStringifiedDate(),
    };

    return {
      patientDetails,
      medicalDetails,
      newPaymentDetails,
    };
  }

  /**
   * Convert date into string format (Montg Day, Year)
   * @returns Current date in standard format as string
   */
  getStringifiedDate(): string {
    const currentDate = this.getConvertedDateObj(new Date());
    return `${MONTHS[currentDate.month]} ${currentDate.day}, ${
      currentDate.year
    }`;
  }

  /**
   * Converts date object to standard object
   * @param date Date Object
   * @returns Returns a standard date object
   */
  getConvertedDateObj(date: Date) {
    return {
      day: date.getDate(),
      month: date.getMonth(),
      year: date.getFullYear(),
    };
  }
}
