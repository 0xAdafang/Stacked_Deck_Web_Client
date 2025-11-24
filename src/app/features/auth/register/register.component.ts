import { Component, OnInit, OnDestroy } from '@angular/core';
import {
  FormBuilder,
  Validators,
  AbstractControl,
  ValidationErrors,
  ReactiveFormsModule,
  FormGroup
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { CommonModule } from '@angular/common';
import { ThemeService } from '../../../core/services/theme.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-register',
  standalone: true,
  templateUrl: './register.component.html',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink
  ],
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit, OnDestroy {

  form!: FormGroup;
  submitting = false;
  serverError = '';
  isDark = true;
  private themeSubscription?: Subscription;

  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private router: Router,
    private themeService: ThemeService
  ) {
    this.form = this.fb.group(
      {
        email: ['', [Validators.required, Validators.email]],
        username: ['', [Validators.required, Validators.pattern(/^[a-zA-Z0-9_\-]{3,20}$/)]],
        password: ['', [Validators.required, Validators.minLength(8)]],
        confirmPassword: ['', Validators.required],
      },
      { validators: RegisterComponent.passwordsMatch }
    );
  }

  ngOnInit(): void {
    this.themeSubscription = this.themeService.isDark$.subscribe(
      isDark => this.isDark = isDark
    );
  }

  ngOnDestroy(): void {
    this.themeSubscription?.unsubscribe();
  }

  private static passwordsMatch(control: AbstractControl): ValidationErrors | null {
    const pass = control.get('password')?.value;
    const confirm = control.get('confirmPassword')?.value;
    if (!pass || !confirm) return null;
    return pass === confirm ? null : { mismatch: true };
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.submitting = true;
    this.serverError = '';

    const payload = this.form.value;

    this.auth.register(payload).subscribe({
      next: () => {
        const email = payload.email;
        this.router.navigate(['/auth/verify'], {
          queryParams: { email: email }
        });
      },
      error: (err) => {
        this.serverError = err?.error?.message ?? 'Registration failed. Please try again.';
        this.submitting = false;
      }
    });
  }
}
