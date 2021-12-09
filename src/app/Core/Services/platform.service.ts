import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { ENDPOINT_CONFIG, ENDPOINT_PREFIX } from './../Config/endpoint.config';
import { SESSION_CONFIG } from './../Config/global-config';
import { SessionStorageUtil } from './../Utility/session-storage.utility';

@Injectable({
  providedIn: 'root',
})
export class PlatformService {
  constructor(private readonly http: HttpClient) {}

  addPatientDetails(requestBody): Observable<any> {
    return this.http.post(
      `${ENDPOINT_PREFIX}${ENDPOINT_CONFIG.addPatientDetails}`,
      requestBody
    );
  }

  saveCategory(requestBody): Observable<any> {
    return this.http.post(
      `${ENDPOINT_PREFIX}${ENDPOINT_CONFIG.addCategory}`,
      requestBody
    );
  }

  getCategories(requestBody): Observable<any> {
    return this.http.post(
      `${ENDPOINT_PREFIX}${ENDPOINT_CONFIG.getCategories}`,
      requestBody
    );
  }

  getUserProfile(): Observable<any> {
    return this.http.get(`${ENDPOINT_PREFIX}${ENDPOINT_CONFIG.getUserDetails}`);
  }

  getPaymentRecords(requestBody): Observable<any> {
    return this.http.post(
      `${ENDPOINT_PREFIX}${ENDPOINT_CONFIG.paymentRecords}`,
      requestBody
    );
  }

  getMedicalRecords(requestBody): Observable<any> {
    return this.http.post(
      `${ENDPOINT_PREFIX}${ENDPOINT_CONFIG.medicalRecords}`,
      requestBody
    );
  }

  getPatients(requestBody): Observable<any> {
    return this.http.post(
      `${ENDPOINT_PREFIX}${ENDPOINT_CONFIG.getPatients}`,
      requestBody
    );
  }

  loadUserProfile() {
    return new Promise((resolve, reject) => {
      this.getUserProfile().subscribe((response) => {
        SessionStorageUtil.setKey(
          SESSION_CONFIG.userConfigKey,
          response.data[0]
        );
        resolve(true);
      });
    });
  }

  loadCategoryConfig() {
    return new Promise((resolve, reject) => {
      this.getCategories({}).subscribe((response) => {
        SessionStorageUtil.setKey(
          SESSION_CONFIG.categoryConfigKey,
          response.data
        );
        resolve(true);
      });
    });
  }
}
