import { ValidatorFn, AbstractControl } from '@angular/forms';

export function yearRangeValidator(): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } | null => {
    const year = parseInt(control.value, 10);
    if (isNaN(year) || year < 1901 || year > 2155) {
      return { 'yearRange': true };
    }
    return null;
  };
}
