import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service';
import { HttpErrorResponse } from '@angular/common/http';
import {CommonModule} from '@angular/common';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  templateUrl: './forgot-password.component.html',
  imports: [
    ReactiveFormsModule,
    CommonModule
  ],
  styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent {
  form: FormGroup;

  sending = false;
  sent = false;
  errorMsg = '';

  constructor(
    private fb: FormBuilder,
    private auth: AuthService
  ) {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
    });
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.sending = true;
    this.errorMsg = '';

    const email = this.form.value.email!;

    this.auth.forgotPassword(email).subscribe({
      next: () => {
        this.sent = true;
        this.sending = false;
      },
      error: (err: HttpErrorResponse) => {
        this.errorMsg = "Unable to send reset email. Please try again later.";
        this.sending = false;
      }
    });
  }
}
