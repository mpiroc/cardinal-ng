import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { NgRedux } from '@angular-redux/store';
import { FormControl, Validators } from '@angular/forms';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import { AuthService } from '../../services/firebase/auth.service';
import { resetPasswordSetEmail } from '../../redux/actions/reset-password';
import { IState } from '../../redux/state';

@Component({
  selector: 'cardinal-reset-password-component',
  templateUrl: './reset-password.component.html',
  styleUrls: [ './reset-password.component.scss' ],
})
export class ResetPasswordComponent {
  readonly emailFormControl = new FormControl('', [
    Validators.required,
    Validators.email,
  ]);

  readonly isValid$ = this.emailFormControl.statusChanges
    .map(status => status === 'VALID');

  constructor(
    private router: Router,
    private authService: AuthService,
    private ngRedux: NgRedux<IState>,
  ) {
  }

  async resetPassword(): Promise<void> {
    const state: IState = this.ngRedux.getState();
    const email: string = state.resetPassword.get('email');

    await this.authService.resetPassword(email);

    await this.router.navigate(['/reset-password-confirmation'], {
      queryParams: { email },
    });
  }

  onEmailInput($event: any) {
    this.ngRedux.dispatch(resetPasswordSetEmail($event.target.value));
  }
}
