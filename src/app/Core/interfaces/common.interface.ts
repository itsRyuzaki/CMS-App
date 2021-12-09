export interface IGenderConfig {
  name: string;
  data: {
    value: string;
    label: string;
  }[];
}

export interface IConvertedDate {
  day: number;
  month: number;
  year: number;
}
