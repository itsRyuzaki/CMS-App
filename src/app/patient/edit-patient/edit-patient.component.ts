import { ActivatedRoute } from '@angular/router';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-edit-patient',
  templateUrl: './edit-patient.component.html',
  styleUrls: ['./edit-patient.component.scss'],
})
export class EditPatientComponent implements OnInit {
  patientId: string;
  constructor(private readonly route: ActivatedRoute) {}

  ngOnInit(): void {
    this.patientId = this.route.snapshot.params.patientId;
  }
}
