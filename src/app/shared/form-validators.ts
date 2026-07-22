import { AbstractControl, AsyncValidatorFn, ValidatorFn } from '@angular/forms';

/**
 * Synchronous validator factory that rejects any value contained in the
 * provided list of forbidden values.
 */
export function forbiddenValueValidator(forbiddenValues: string[]): ValidatorFn {
  return (control: AbstractControl): { [key: string]: boolean } | null => {
    if (forbiddenValues.indexOf(control.value) !== -1) {
      return { nameIsForbidden: true };
    }
    return null;
  };
}

/**
 * Asynchronous validator factory that rejects any value contained in the
 * provided list of forbidden values after a simulated server round-trip.
 */
export function forbiddenEmailValidator(
  forbiddenEmails: string[],
  delayMs = 1500
): AsyncValidatorFn {
  return (control: AbstractControl): Promise<{ [key: string]: boolean } | null> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        if (forbiddenEmails.indexOf(control.value) !== -1) {
          resolve({ emailIsForbidden: true });
        } else {
          resolve(null);
        }
      }, delayMs);
    });
  };
}
