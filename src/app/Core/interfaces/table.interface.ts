export interface ITableConfig {
  navigationConfig?: {
    viewURL?: (id: string) => string[];
    editURL?: (id: string) => string[];
  };
  tableHeading?: string;
  columnConfig: { property: string; label: string }[];
}

export interface IRowDataConfig {
  rowData: { [x: string]: string };
  id?: string;
}
