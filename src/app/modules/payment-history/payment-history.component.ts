import { Component, Input, OnInit } from '@angular/core';
import {
  CATEGORY_KEY, SESSION_CONFIG
} from 'src/app/Core/Config/global-config';
import {
  ICategoryModel, IPaymentModel
} from 'src/app/Core/interfaces/api-response.interface';
import { PlatformService } from 'src/app/Core/Services/platform.service';
import { HelperUtil } from 'src/app/Core/Utility/helper-utility';
import { RequestUtil } from 'src/app/Core/Utility/request-utility';
import { SessionStorageUtil } from 'src/app/Core/Utility/session-storage.utility';

@Component({
  selector: 'app-payment-history',
  templateUrl: './payment-history.component.html',
  styleUrls: ['./payment-history.component.scss'],
})
export class PaymentHistoryComponent implements OnInit {
  @Input() patientId: string;
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
  constructor(private readonly platformService: PlatformService) {}

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
}
