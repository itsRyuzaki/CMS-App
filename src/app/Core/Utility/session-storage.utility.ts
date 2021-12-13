export const SessionStorageUtil = {
  setKey(key, data): void {
    sessionStorage.setItem(key, JSON.stringify(data));
  },

  getKey(key): any {
    const data = sessionStorage.getItem(key);

    return data ? JSON.parse(data) : null;
  },

  clearKeys() {
    sessionStorage.clear();
  },
};
