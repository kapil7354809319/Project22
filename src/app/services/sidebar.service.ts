import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SidebarService {
  private currentOpenDropdown = new BehaviorSubject<string | null>(null);

  setCurrentDropdown(dropdownId: string) {
    this.currentOpenDropdown.next(dropdownId);
  }

  getCurrentDropdown() {
    return this.currentOpenDropdown.asObservable();
  }

  closeDropdown() {
    this.currentOpenDropdown.next(null);
  }
}
