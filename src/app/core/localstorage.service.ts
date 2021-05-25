import { Injectable } from '@angular/core';


@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {
  get(key: string) {
    try {
      return JSON.parse(atob(localStorage.getItem(key) as any));
    } catch (err) {
      return null;
    }
  }

  set(key: string, value: Object) {
    try {
      return localStorage.setItem(key, btoa(JSON.stringify(value)));
    } catch (err) {
      return null;
    }
  }

  delete(key: string) {
    try {
      return localStorage.removeItem(key)
    } catch (err) {
      return null
    }
  }
}
