import {
  AfterViewInit,
  Component,
  EventEmitter,
  OnInit,
  Output,
} from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { AGE_OPTIONS, SORT_OPTIONS } from './../../Config/search-bar.config';

@Component({
  selector: 'app-search-bar',
  templateUrl: './search-bar.component.html',
  styleUrls: ['./search-bar.component.scss'],
})
export class SearchBarComponent implements OnInit, AfterViewInit {
  searchForm: FormGroup;
  ageOptions = [...AGE_OPTIONS];
  sortOptions = [...SORT_OPTIONS];
  @Output() formChanges = new EventEmitter();

  constructor() {}

  ngOnInit(): void {
    this.initializeSearchForm();
  }

  ngAfterViewInit(): void {
    this.searchForm.valueChanges.subscribe((response) => {
      this.formChanges.emit(response);
    });
  }

  initializeSearchForm(): void {
    this.searchForm = new FormGroup({
      name: new FormControl(''),
      age: new FormControl(this.ageOptions[0].id),
      phoneNumber: new FormControl(''),
      sortBy: new FormControl(this.sortOptions[0].value),
    });
  }
}
