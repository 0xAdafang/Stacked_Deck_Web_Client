import {Component, OnInit} from '@angular/core';
import {FormBuilder, ReactiveFormsModule, Validators} from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import {CommonModule} from '@angular/common';

@Component({
  selector: 'app-resend-verification',
  templateUrl: './resend-verification.component.html',
  imports: [ReactiveFormsModule, CommonModule],
  styleUrls: ['./resend-verification.component.scss']
})
export class ResendVerificationComponent implements OnInit {


  form;

  sending = false;
  sent = false;
  errorMsg = '';

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private auth: AuthService
  ) {

    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
    });
  }

  ngOnInit(): void {
    const emailFromLogin = this.route.snapshot.queryParamMap.get('email');
    if (emailFromLogin) {
      this.form.patchValue({ email: emailFromLogin});
    }
  }

  submit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.sending = true;
    this.errorMsg = '';

    this.auth.resendVerification(this.form.value.email!).subscribe({
      next: () => {
        this.sent = true;
        this.sending = false;
      },
      error: () => {
        this.errorMsg = 'Unable to resend the email at this time. Please try again later.';
        this.sending = false;
      }
    });
  }
}
