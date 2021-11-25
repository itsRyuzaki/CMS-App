export interface ITableConfig {
  clickConfig?: { navigationPrefix: string };
  tableHeading?: string;
  columnConfig: { property: string; label: string }[];
}

export interface IRowDataConfig {
  rowData: { property: string; value: string }[];
}
