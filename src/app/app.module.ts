import { HttpClientModule } from '@angular/common/http';
import { APP_INITIALIZER, NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatExpansionModule } from '@angular/material/expansion';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { PlatformService } from 'src/app/Core/Services/platform.service';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ClinicListingComponent } from './clinic-listing/clinic-listing.component';
import { ButtonComponent } from './Core/Components/buttons/button.component';
import { CardComponent } from './Core/Components/card/card.component';
import { MedicalRecordComponent } from './Core/Components/medical-record/medical-record.component';
import { NavbarComponent } from './Core/Components/navbar/navbar.component';
import { PageHeaderComponent } from './Core/Components/page-header/page-header.component';
import { PaymentRecordComponent } from './Core/Components/payment-record/payment-record.component';
import { SkeletonLoaderComponent } from './Core/Components/skeleton-loader/skeleton-loader.component';
import { TableComponent } from './Core/Components/table/table.component';
import { DashboardComponent } from './modules/dashboard/dashboard.component';
import { PatientListingComponent } from './modules/patient-listing/patient-listing.component';
import { AddPatientComponent } from './patient/add-patient/add-patient.component';
import { EditPatientComponent } from './patient/edit-patient/edit-patient.component';
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
    PaymentRecordComponent,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    MatExpansionModule,
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
