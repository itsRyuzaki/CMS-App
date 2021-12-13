import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { PlatformService } from './../../../Services/platform.service';
import { BUTTON_IDs, SESSION_CONFIG } from './../../../Config/global-config';
import { ICategoryModel } from './../../../interfaces/api-response.interface';
import { IDialogResponse } from './../../../interfaces/common.interface';
import { SessionStorageUtil } from './../../../Utility/session-storage.utility';

@Component({
  selector: 'app-add-category-dialog',
  templateUrl: './add-category-dialog.component.html',
  styleUrls: ['./add-category-dialog.component.scss'],
})
export class AddCategoryDialogComponent implements OnInit {
  categoryForm: FormGroup;
  buttonIds = { ...BUTTON_IDs };
  categoryApiStatus = {
    isLoading: false,
    hasError: false,
  };
  categories: ICategoryModel[];
  isInvalidCategoryForm = false;

  constructor(
    private readonly platformService: PlatformService,
    private dialogRef: MatDialogRef<AddCategoryDialogComponent>
  ) {}

  ngOnInit(): void {
    this.categories = SessionStorageUtil.getKey(
      SESSION_CONFIG.categoryConfigKey
    );
    this.categoryForm = new FormGroup({
      categoryTitle: new FormControl(null, Validators.required),
      categoryDescription: new FormControl(null, Validators.required),
    });
  }

  onSaveCategoryCTAClicked(): void {
    this.categoryApiStatus.isLoading = true;
    const categoryDetails = this.categoryForm.value;

    if (
      this.categoryForm.valid &&
      this.categories.findIndex(
        (category) =>
          category.type.toLowerCase() ===
          categoryDetails.categoryTitle.toLowerCase()
      ) === -1
    ) {
      const requestBody = {
        type: categoryDetails.categoryTitle,
        description: categoryDetails.categoryDescription,
      };

      this.platformService.saveCategory(requestBody).subscribe(
        (response) => {
          this.categories.push(response.data);
          SessionStorageUtil.setKey(
            SESSION_CONFIG.categoryConfigKey,
            this.categories
          );
          this.categoryApiStatus.isLoading = false;
          const dialogResponse: IDialogResponse = {
            isSuccess: true,
            data: response.data,
          };

          this.dialogRef.close(dialogResponse);
        },
        (err) => {
          this.categoryApiStatus.isLoading = false;
          this.categoryApiStatus.hasError = true;
          setTimeout(() => {
            this.categoryApiStatus.hasError = false;
          }, 3000);
        }
      );
    } else {
      this.categoryApiStatus.isLoading = false;
      this.isInvalidCategoryForm = true;
      setTimeout(() => {
        this.isInvalidCategoryForm = false;
      }, 3000);
    }
  }

  onCloseIconClicked(): void {
    const dialogResponse: IDialogResponse = {
      isSuccess: false,
      data: {},
    };

    this.dialogRef.close(dialogResponse);
  }
}
