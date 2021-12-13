import { Component, Input, OnInit } from '@angular/core';
import { IMedicalRecord } from './../../interfaces/api-response.interface';

@Component({
  selector: 'app-medical-record',
  templateUrl: './medical-record.component.html',
  styleUrls: ['./medical-record.component.scss']
})
export class MedicalRecordComponent implements OnInit {

  @Input() recordConfig: IMedicalRecord;
  @Input() category: string;
  constructor() { }

  ngOnInit(): void {
  }

}
