export class UserData {
  setData(obj: any, key: string) {
    localStorage.setItem(key, btoa(JSON.stringify(obj)));
    return true;
  }

  getData<T>(key: string): T | null {
    const storedData = localStorage.getItem(key);
    return storedData ? JSON.parse(atob(storedData)) : null;
  }

  clearData(key: string) {
    localStorage.removeItem(key);
    return true;
  }
}
