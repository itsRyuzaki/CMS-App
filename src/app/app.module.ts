import { HttpClientModule } from '@angular/common/http';
import { APP_INITIALIZER, NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { MatExpansionModule } from '@angular/material/expansion';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { PlatformService } from 'src/app/Core/Services/platform.service';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ButtonComponent } from './Core/Components/buttons/button.component';
import { CardComponent } from './Core/Components/card/card.component';
import { MedicalRecordComponent } from './Core/Components/medical-record/medical-record.component';
import { AddCategoryDialogComponent } from './Core/Components/Modals/add-category-dialog/add-category-dialog.component';
import { AddPaymentDialogComponent } from './Core/Components/Modals/add-payment-dialog/add-payment-dialog.component';
import { NavbarComponent } from './Core/Components/navbar/navbar.component';
import { PageHeaderComponent } from './Core/Components/page-header/page-header.component';
import { SearchBarComponent } from './Core/Components/search-bar/search-bar.component';
import { SkeletonLoaderComponent } from './Core/Components/skeleton-loader/skeleton-loader.component';
import { TableComponent } from './Core/Components/table/table.component';
import { ClinicListingComponent } from './modules/clinic-listing/clinic-listing.component';
import { DashboardComponent } from './modules/dashboard/dashboard.component';
import { PastMedicalRecordComponent } from './modules/past-medical-record/past-medical-record.component';
import { PatientListingComponent } from './modules/patient-listing/patient-listing.component';
import { PaymentHistoryComponent } from './modules/payment-history/payment-history.component';
import { AddPatientComponent } from './patient/add-patient/add-patient.component';
import { EditPatientComponent } from './patient/edit-patient/edit-patient.component';
import { PatientFormComponent } from './patient/patient-form/patient-form.component';
import { PatientComponent } from './patient/patient.component';
import { ViewPatientComponent } from './patient/view-patient/view-patient.component';

export function userProviderFactory(provider: PlatformService) {
  return () => provider.loadUserProfile();
}
export function categoryProviderFactory(provider: PlatformService) {
  return () => provider.loadCategoryConfig();
}
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
    PageHeaderComponent,
    SkeletonLoaderComponent,
    MedicalRecordComponent,
    PatientFormComponent,
    PaymentHistoryComponent,
    PastMedicalRecordComponent,
    AddCategoryDialogComponent,
    AddPaymentDialogComponent,
    SearchBarComponent,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    MatExpansionModule,
    MatDialogModule,
  ],
  providers: [
    {
      provide: APP_INITIALIZER,
      useFactory: userProviderFactory,
      deps: [PlatformService],
      multi: true,
    },
    {
      provide: APP_INITIALIZER,
      useFactory: categoryProviderFactory,
      deps: [PlatformService],
      multi: true,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
