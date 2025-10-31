import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent {
  token: string;
  form: FormGroup;

  submitting = false;
  serverError = '';

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private auth: AuthService
  ) {
    this.token = this.route.snapshot.queryParamMap.get('token') ?? '';

    this.form = this.fb.group(
      {
        password: ['', [Validators.required, Validators.minLength(8)]],
        confirmPassword: ['', Validators.required],
      },
      { validators: this.matchPasswords }
    );
  }

  private matchPasswords(control: AbstractControl): ValidationErrors | null {
    const pass = control.get('password')?.value;
    const confirm = control.get('confirmPassword')?.value;
    if (!pass || !confirm) return null;
    return pass === confirm ? null : { mismatch: true };
  }

  submit(): void {
    if (this.form.invalid || !this.token) {
      return;
    }
    this.submitting = true;
    const newPass = this.form.value.password!;

    this.auth.resetPassword(this.token, newPass).subscribe({
      next: () => {
        this.router.navigate(['/auth/login'], { queryParams: { reset: 'ok' } });
      },
      error: (err: HttpErrorResponse) => {
        this.serverError = err?.error?.message ?? 'Password cannot be reset.';
        this.submitting = false;
      }
    });
  }
}
