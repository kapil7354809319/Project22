import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class CustomValidationService {
  constructor() {}
  numericFilter(event: KeyboardEvent) {
    const inputElement = event.target as HTMLInputElement;
    let value = inputElement.value;
    value = value.replace(/[^0-9.]/g, '');
    const decimalCount = (value.match(/\./g) || []).length;
    if (decimalCount > 1) {
      value = value.replace(/\.+/, '.');
    }
    const decimalParts = value.split('.');
    if (decimalParts[1] && decimalParts[1].length > 2) {
      decimalParts[1] = decimalParts[1].slice(0, 2);
    }
    value = decimalParts.join('.');
    inputElement.value = value;
  }

  validatePercentageValue(event: KeyboardEvent) {
    const inputElement = event.target as HTMLInputElement;
    const value = parseFloat(inputElement.value);
    if (value > 100) {
      inputElement.value = '100';
    }
  }

  validateRelayValue(event: KeyboardEvent) {
    const inputElement = event.target as HTMLInputElement;
    const value = parseFloat(inputElement.value);
    if (value > 100) {
      return 100;
    } else if (value < 0) {
      return 0;
    } else if (isNaN(value)) {
      return '';
    } else {
      return value;
    }
  }
}
