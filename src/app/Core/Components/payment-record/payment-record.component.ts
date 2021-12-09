import { Component, Input, OnInit } from '@angular/core';
import { IPaymentModel } from './../../interfaces/api-response.interface';

@Component({
  selector: 'app-payment-record',
  templateUrl: './payment-record.component.html',
  styleUrls: ['./payment-record.component.scss'],
})
export class PaymentRecordComponent implements OnInit {
  @Input() paymentConfig: IPaymentModel;
  @Input() category: string;
  constructor() {}

  ngOnInit(): void {}
}
