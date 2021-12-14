import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DashboardComponent } from './modules/dashboard/dashboard.component';
import { PatientComponent } from './patient/patient.component';
import { AddPatientComponent } from './patient/add-patient/add-patient.component';
import { EditPatientComponent } from './patient/edit-patient/edit-patient.component';
import { ViewPatientComponent } from './patient/view-patient/view-patient.component';
import { PatientListingComponent } from './modules/patient-listing/patient-listing.component';
import { ClinicListingComponent } from './modules/clinic-listing/clinic-listing.component';

const routes: Routes = [
  {
    path: 'patient',
    component: PatientComponent,
    children: [
      { path: 'add', component: AddPatientComponent },
      { path: ':patientId/edit', component: EditPatientComponent },
      { path: ':patientId', component: ViewPatientComponent },
    ],
  },
  {
    path: 'patients',
    component: PatientListingComponent,
  },
  {
    path: 'clinics',
    component: ClinicListingComponent,
  },
  { path: '', component: DashboardComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
