import { Component } from '@angular/core';
import {
  FormBuilder,
  Validators,
  AbstractControl,
  ValidationErrors,
  ReactiveFormsModule,
  FormGroup
} from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import {CommonModule} from '@angular/common';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  imports: [
    CommonModule,
    ReactiveFormsModule,
  ],
  styleUrls: ['./register.component.scss']
})

export class RegisterComponent {

  form!: FormGroup;
  submitting = false;
  serverError = '';

  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private router: Router
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

    const payload = this.form.value as {
      email: string;
      username: string;
      password: string;
      confirmPassword: string;
    };


    this.auth.register(payload).subscribe({
      next: (response) => {

        const email = payload.email;
        this.router.navigate(['/auth/verify'], {
          queryParams: { email: email }
        });
      },
      error: (err) => {
        this.serverError = err?.error?.message ?? 'Erreur lors de l\'inscription';
        this.submitting = false;
      }
    });
  }
}
