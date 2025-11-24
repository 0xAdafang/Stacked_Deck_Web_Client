import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators, FormGroup } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { CommonModule } from '@angular/common';
import { ThemeService } from '../../../core/services/theme.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-resend-verification',
  templateUrl: './resend-verification.component.html',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RouterLink],
  styleUrls: ['./resend-verification.component.scss']
})
export class ResendVerificationComponent implements OnInit, OnDestroy {

  form: FormGroup;
  sending = false;
  sent = false;
  errorMsg = '';

  isDark = true;
  private themeSubscription?: Subscription;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private auth: AuthService,
    private themeService: ThemeService
  ) {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
    });
  }

  ngOnInit(): void {
    // Gestion du thème
    this.themeSubscription = this.themeService.isDark$.subscribe(
      isDark => this.isDark = isDark
    );

    const emailFromLogin = this.route.snapshot.queryParamMap.get('email');
    if (emailFromLogin) {
      this.form.patchValue({ email: emailFromLogin});
    }
  }

  ngOnDestroy(): void {
    this.themeSubscription?.unsubscribe();
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
