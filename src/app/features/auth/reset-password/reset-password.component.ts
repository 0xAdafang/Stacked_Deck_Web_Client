import { Component } from '@angular/core';
import { FormBuilder, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service'; // adapte le chemin si besoin

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent {


  token: string = this.route.snapshot.queryParamMap.get('token') ?? '';

  form = this.fb.group(
    {
      password: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', Validators.required],
    },
    { validators: this.matchPasswords }
  );

  submitting = false;
  serverError = '';

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private auth: AuthService
  ) {}


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
      error: (err) => {
        this.serverError = err?.error?.message ?? 'Password cannot be reset.';
        this.submitting = false;
      }
    });
  }
}
