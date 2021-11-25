import { Component, OnInit } from '@angular/core';
import { IRowDataConfig, ITableConfig } from '../../interfaces/table.interface';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss'],
})
export class TableComponent implements OnInit {
  rowDataConfig: IRowDataConfig[];
  tableDataConfig: ITableConfig;
  constructor() {}

  ngOnInit(): void {
    this.tableDataConfig = {
      columnConfig: [
        { property: 'patientName', label: 'Name' },
        { property: 'transactionCount', label: 'Count' },
        { property: 'totalAmount', label: 'Total Amount' },
      ],
      clickConfig: { navigationPrefix: '/' },
      tableHeading: 'Pending',
    };

    this.rowDataConfig = [
      {
        rowData: [
          {
            property: 'patientName',
            value: 'Akshit',
          },
          { property: 'transactionCount', value: '2' },
          { property: 'totalAmount', value: '1234' },
        ],
      },
    ];
  }
}
