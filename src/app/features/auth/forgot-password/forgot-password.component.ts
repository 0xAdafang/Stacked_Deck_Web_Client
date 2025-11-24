import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service';
import { HttpErrorResponse } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ThemeService } from '../../../core/services/theme.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  templateUrl: './forgot-password.component.html',
  imports: [
    ReactiveFormsModule,
    CommonModule,
    RouterLink
  ],
  styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent implements OnInit, OnDestroy {
  form: FormGroup;
  sending = false;
  sent = false;
  errorMsg = '';

  isDark = true;
  private themeSubscription?: Subscription;

  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private themeService: ThemeService
  ) {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
    });
  }

  ngOnInit(): void {
    this.themeSubscription = this.themeService.isDark$.subscribe(
      isDark => this.isDark = isDark
    );
  }

  ngOnDestroy(): void {
    this.themeSubscription?.unsubscribe();
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
