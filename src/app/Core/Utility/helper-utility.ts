import { IConvertedDate } from './../interfaces/common.interface';
import { MONTHS } from './../Config/global-config';

export const HelperUtil = {
  /**
   * Convert date into string format (Month Day, Year)
   * @returns Current date in standard format as string
   */
  getStringifiedDate(date: any, isConvertedDate: boolean = false): string {
    if (date) {
      if (!isConvertedDate) {
        date = this.getConvertedDateObj(date);
      }
      return `${MONTHS[date.month]} ${date.day}, ${date.year}`;
    }
    return 'None';
  },

  /**
   * Converts date object to standard object
   * @param date Date Object
   * @returns Returns a standard date object
   */
  getConvertedDateObj(date: Date): IConvertedDate {
    return {
      day: date.getDate(),
      month: date.getMonth(),
      year: date.getFullYear(),
    };
  },

  /**
   * Creates a map from the given array
   * @param data Data object of type array
   * @param key key to check in data object
   * @param mapObj Mapped object
   */
  createMapFromArray(data: any[], key: string, mapObj: Map<any, any>): void {
    data.forEach((element) => {
      if (!mapObj.has(element[key])) {
        mapObj.set(element[key], element);
      }
    });
  },

  /**
   * Comapres the standard object
   * @param date1 First date element
   * @param date2 Second date element
   * @returns 1,0,-1 depending upon the comparison
   */
  dateComparator(date1: IConvertedDate, date2: IConvertedDate): number {
    if (date1.year > date2.year) {
      return 1;
    } else if (date1.year < date2.year) {
      return -1;
    } else {
      if (date1.month > date2.month) {
        return 1;
      } else if (date1.month < date2.month) {
        return -1;
      } else {
        if (date1.day > date2.day) {
          return 1;
        } else if (date1.day < date2.day) {
          return -1;
        } else {
          return 0;
        }
      }
    }
  },
};
