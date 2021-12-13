import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AddPaymentDialogComponent } from './../../Core/Components/Modals/add-payment-dialog/add-payment-dialog.component';
import {
  BUTTON_IDs,
  CATEGORY_KEY,
  SESSION_CONFIG
} from './../../Core/Config/global-config';
import {
  ICategoryModel,
  IPaymentModel
} from './../../Core/interfaces/api-response.interface';
import {
  IDialogResponse,
  IPaymentDialogRequest
} from './../../Core/interfaces/common.interface';
import { PlatformService } from './../../Core/Services/platform.service';
import { HelperUtil } from './../../Core/Utility/helper-utility';
import { RequestUtil } from './../../Core/Utility/request-utility';
import { SessionStorageUtil } from './../../Core/Utility/session-storage.utility';

@Component({
  selector: 'app-payment-history',
  templateUrl: './payment-history.component.html',
  styleUrls: ['./payment-history.component.scss'],
})
export class PaymentHistoryComponent implements OnInit {
  @Input() patientId: string;
  @Input() isEditPage = false;
  categoriesMasterData = new Map<string, ICategoryModel>();
  paymentRecordStatus: {
    data: Partial<IPaymentModel>[];
    isLoading: boolean;
    hasError: boolean;
  } = {
    data: [],
    isLoading: true,
    hasError: false,
  };
  buttonIds = { ...BUTTON_IDs };
  isPaymentAdded: { [x: string]: boolean } = {};
  constructor(
    private readonly platformService: PlatformService,
    public dialog: MatDialog
  ) {}

  ngOnInit(): void {
    HelperUtil.createMapFromArray(
      SessionStorageUtil.getKey(SESSION_CONFIG.categoryConfigKey),
      CATEGORY_KEY,
      this.categoriesMasterData
    );
    this.getPaymentRecords();
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
        this.paymentRecordStatus.data.forEach((element) => {
          this.isPaymentAdded[element.categoryId] = false;
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

  onAddCTAClicked(category: ICategoryModel): void {
    const request: IPaymentDialogRequest = {
      oldPaymentDetails: this.paymentRecordStatus.data,
      category,
    };
    const dialogRef = this.dialog.open(AddPaymentDialogComponent, {
      data: { ...request },
    });

    dialogRef.afterClosed().subscribe((response: IDialogResponse) => {
      if (response.isSuccess) {
        const index = this.paymentRecordStatus.data.findIndex(
          (detail) => detail.categoryId === category.categoryId
        );
        this.paymentRecordStatus.data[index].transactions.push({
          ...response.data.transaction,
          stringifiedDate: HelperUtil.getStringifiedDate(
            response.data.transaction.date,
            true
          ),
        });
        this.paymentRecordStatus.data[index].dueAmount =
          response.data.dueAmount;
        this.isPaymentAdded[category.categoryId] = true;
        setTimeout(() => {
          this.isPaymentAdded[category.categoryId] = false;
        }, 3000);
      }
    });
  }
}
