import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class DataServiceService {
  private STORAGE_KEY = 'serviceIds';
  serviceIds: any[] = [];

  constructor() {
    this.loadServiceIds();
  }

  private loadServiceIds() {
    const storedData = localStorage.getItem(this.STORAGE_KEY);
    if (storedData) {
      this.serviceIds = JSON.parse(storedData);
    }
  }

  addServiceId(serviceId: any) {
    this.serviceIds.push(serviceId);
    this.saveServiceIds();
  }

  clearServiceIds() {
    this.serviceIds = [];
    this.saveServiceIds();
    localStorage.removeItem(this.STORAGE_KEY);
  }

  private saveServiceIds() {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.serviceIds));
  }
}
