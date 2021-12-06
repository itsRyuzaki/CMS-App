import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavbarComponent } from './Core/Components/navbar/navbar.component';
import { CardComponent } from './Core/Components/card/card.component';
import { TableComponent } from './Core/Components/table/table.component';
import { ButtonComponent } from './Core/Components/buttons/button.component';
import { DashboardComponent } from './modules/dashboard/dashboard.component';
import { AddPatientComponent } from './patient/add-patient/add-patient.component';
import { PatientComponent } from './patient/patient.component';
import { EditPatientComponent } from './patient/edit-patient/edit-patient.component';
import { ViewPatientComponent } from './patient/view-patient/view-patient.component';
import { PatientListingComponent } from './modules/patient-listing/patient-listing.component';
import { ClinicListingComponent } from './clinic-listing/clinic-listing.component';
import { PageHeaderComponent } from './Core/Components/page-header/page-header.component';

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    CardComponent,
    TableComponent,
    DashboardComponent,
    ButtonComponent,
    AddPatientComponent,
    PatientComponent,
    EditPatientComponent,
    ViewPatientComponent,
    PatientListingComponent,
    ClinicListingComponent,
    PageHeaderComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
