import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-resend-verification',
  standalone: true,
  templateUrl: './resend-verification.component.html',
  imports: [
    ReactiveFormsModule
  ],
  styleUrls: ['./resend-verification.component.css']
})
export class ResendVerificationComponent {
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

  submit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.sending = true;
    this.errorMsg = '';
    const email = this.form.value.email!;

    this.auth.resendVerification(email).subscribe({
      next: () => {
        this.sent = true;
        this.sending = false;
      },
      error: () => {
        this.errorMsg = "Unable to resend email at this time.";
        this.sending = false;
      }
    });
  }
}
