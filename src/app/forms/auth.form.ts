import {
  FormBuilder,
  AbstractControl,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';

export class AuthForm {
  readonly form: FormGroup;

  readonly isValid$: Observable<boolean>;

  constructor(
    private formBuilder: FormBuilder,
  ) {
    this.form = formBuilder.group({
      email: ['', [
        Validators.required,
        Validators.email,
      ]],
      password: ['', [
        Validators.required,
        Validators.minLength(12),
        Validators.pattern(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).*$/),
      ]],
    });

    this.isValid$ = this.form.statusChanges.map(status => status === 'VALID');
  }

  getFirstEmailError(): string {
    return this.getFirstError(
      this.form.get('email'),
      ['required', 'email'],
    );
  }

  getFirstPasswordError(): string {
    return this.getFirstError(
      this.form.get('password'),
      ['required', 'minlength', 'pattern'],
    );
  }

  private getFirstError(control: AbstractControl, errors: string[]) {
    return errors.find(error => control.hasError(error));
  }
}