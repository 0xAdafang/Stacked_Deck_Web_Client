import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {ActivatedRoute, Router, RouterLink} from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  imports: [
    RouterLink,
    ReactiveFormsModule
  ],
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {


  loginForm!: FormGroup;

  errorMessage = '';
  errorMsg = '';
  unverifiedEmail = '';
  verified = false;
  verifyError = false;
  checkEmail = false;

  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {

    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
    });
  }

  ngOnInit(): void {

    this.verified = this.route.snapshot.queryParamMap.has('verified');
    this.verifyError = this.route.snapshot.queryParamMap.has('verifyError');
    this.checkEmail = this.route.snapshot.queryParamMap.has('checkEmail');


    const verifyToken = this.route.snapshot.queryParamMap.get('token');
    if (verifyToken) {
      this.auth.verifyEmail(verifyToken).subscribe({
        next: () => {
          this.verified = true;
        },
        error: () => {
          this.verifyError = true;
        }
      });
    }
  }

  onSubmit(): void {
    if (this.loginForm.invalid) return;

    const { username, password } = this.loginForm.value;

    this.errorMessage = '';
    this.errorMsg = '';
    this.unverifiedEmail = '';

    this.auth.login({ identifier: username!, password: password! }).subscribe({
      next: () => this.router.navigate(['/home']),
      error: (err) => {
        const msg = err?.error?.message ?? 'Connexion impossible';
        if (msg.toLowerCase().includes('not verified')) {
          this.errorMsg = msg;
          this.unverifiedEmail = username ?? '';
        } else {
          this.errorMessage = msg;
        }
      }
    });
  }
}
