import { AbstractControl, ValidationErrors } from '@angular/forms';

export function passwordMatch(control: AbstractControl): ValidationErrors | null{
   return control.value.password === control.value.repassword ? null : { passwordMatch: true };;
}
