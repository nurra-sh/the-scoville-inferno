import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function mustMatch(controlName: string, matchingControlName: string): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const controlToMatch = control.get(controlName);
    const matchingControl = control.get(matchingControlName);

    if (!controlToMatch || !matchingControl) {
      return null;
    }

    if (matchingControl.errors && !matchingControl.errors['mustMatch']) {
      return null;
    }

    if (controlToMatch.value !== matchingControl.value) {
      matchingControl.setErrors({ ...matchingControl.errors, mustMatch: true });
      return { mustMatch: true };
    } else {
      if (matchingControl.errors) {
        const errors = { ...matchingControl.errors };
        delete errors['mustMatch'];
        matchingControl.setErrors(Object.keys(errors).length ? errors : null);
      }
      return null;
    }
  };
}