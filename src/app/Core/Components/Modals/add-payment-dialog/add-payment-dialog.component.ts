import { AfterViewInit, Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { BUTTON_IDs } from './../../../Config/global-config';
import {
  IDialogResponse,
  IPaymentDialogRequest,
} from './../../../interfaces/common.interface';
import { PlatformService } from './../../../Services/platform.service';
import { HelperUtil } from './../../../Utility/helper-utility';

@Component({
  selector: 'app-add-payment-dialog',
  templateUrl: './add-payment-dialog.component.html',
  styleUrls: ['./add-payment-dialog.component.scss'],
})
export class AddPaymentDialogComponent implements OnInit, AfterViewInit {
  paymentForm: FormGroup;
  initialAmount = 0;
  dueAmount = 0;
  buttonIds = { ...BUTTON_IDs };
  paymentApiStatus = {
    isLoading: false,
    hasError: false,
  };
  isInvalidPayemntForm = false;
  paymentDetailIndex: number;

  constructor(
    private readonly platformService: PlatformService,
    private dialogRef: MatDialogRef<AddPaymentDialogComponent>,
    @Inject(MAT_DIALOG_DATA)
    public dialogRequest: IPaymentDialogRequest
  ) {}

  ngOnInit(): void {
    this.paymentForm = new FormGroup({
      fees: new FormControl(0, [Validators.min(0)]),
      paidAmount: new FormControl(0, [Validators.min(0)]),
    });

    this.paymentDetailIndex = this.dialogRequest.oldPaymentDetails.findIndex(
      (detail) => detail.categoryId === this.dialogRequest.category.categoryId
    );
    if (this.paymentDetailIndex !== -1) {
      this.dueAmount =
        this.dialogRequest.oldPaymentDetails[this.paymentDetailIndex].dueAmount;
      this.initialAmount =
        this.dialogRequest.oldPaymentDetails[this.paymentDetailIndex].dueAmount;
    } else {
      const dialogResponse: IDialogResponse = {
        isSuccess: false,
        data: {},
      };
      this.dialogRef.close(dialogResponse);
    }
  }

  ngAfterViewInit(): void {
    this.paymentForm.get('fees').valueChanges.subscribe((fees) => {
      this.handleFeeChanges(fees);
    });

    this.paymentForm.get('paidAmount').valueChanges.subscribe((paidAmount) => {
      this.handlePaidAmountChanges(paidAmount);
    });
  }

  handlePaidAmountChanges(value): void {
    this.dueAmount = this.initialAmount + this.paymentForm.value.fees - value;
  }

  handleFeeChanges(value): void {
    this.dueAmount =
      this.initialAmount + value - this.paymentForm.value.paidAmount;
  }

  onSaveCategoryCTAClicked(): void {
    this.paymentApiStatus.isLoading = true;
    const currentTransaction = {
      ...this.paymentForm.value,
      date: HelperUtil.getConvertedDateObj(new Date()),
    };

    if (this.paymentForm.valid && this.dueAmount >= 0) {
      // tslint:disable-next-line: prefer-const
      let oldPaymentDetails = JSON.parse(
        JSON.stringify(this.dialogRequest.oldPaymentDetails)
      );

      oldPaymentDetails[this.paymentDetailIndex].transactions.push({
        ...currentTransaction,
      });
      const requestBody = {
        patientId: this.dialogRequest.oldPaymentDetails[0].patientId,
        patientDetails: {
          lastModified: HelperUtil.getStringifiedDate(new Date()),
        },
        oldPaymentDetails,
      };

      this.platformService.updatePatientDetails(requestBody).subscribe(
        (response) => {
          this.paymentApiStatus.isLoading = false;
          const dialogResponse: IDialogResponse = {
            isSuccess: true,
            data: {
              transaction: { ...currentTransaction },
              dueAmount: this.dueAmount,
            },
          };

          this.dialogRef.close(dialogResponse);
        },
        (err) => {
          this.paymentApiStatus.isLoading = false;
          this.paymentApiStatus.hasError = true;
          setTimeout(() => {
            this.paymentApiStatus.hasError = false;
          }, 3000);
        }
      );
    } else {
      this.paymentApiStatus.isLoading = false;
      this.isInvalidPayemntForm = true;
      setTimeout(() => {
        this.isInvalidPayemntForm = false;
      }, 3000);
    }
  }

  onCloseIconClicked(): void {
    const dialogResponse: IDialogResponse = {
      isSuccess: false,
      data: {},
    };

    this.dialogRef.close(dialogResponse);
  }
}
