import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { IRowDataConfig, ITableConfig } from '../../interfaces/table.interface';
import { TABLE_CONFIG } from './table.config';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss'],
})
export class TableComponent implements OnInit {
  @Input() tableId: string;
  @Input() rowDataConfig: IRowDataConfig[];
  @Input() showViewIcon = false;
  @Input() showEditIcon = false;
  @Input() showDeleteIcon = false;
  @Input() isRowClickable = true;

  @Output() isDeleteIconClicked = new EventEmitter();

  tableDataConfig: ITableConfig;
  constructor(private readonly router: Router) {}

  ngOnInit(): void {
    this.tableDataConfig = TABLE_CONFIG[this.tableId];
  }

  onViewIconClicked(rowConfig: IRowDataConfig): void {
    this.router.navigate([
      ...this.tableDataConfig.navigationConfig.viewURL(rowConfig.id),
    ]);
  }

  onEditIconClicked(rowConfig: IRowDataConfig): void {
    this.router.navigate([
      ...this.tableDataConfig.navigationConfig.editURL(rowConfig.id),
    ]);
  }

  onDeleteIconClicked(rowConfig: IRowDataConfig): void {
    this.isDeleteIconClicked.emit(rowConfig);
  }

  onRowClicked(rowConfig: IRowDataConfig): void {
    if (this.isRowClickable) {
      this.onViewIconClicked(rowConfig);
    }
  }
}
