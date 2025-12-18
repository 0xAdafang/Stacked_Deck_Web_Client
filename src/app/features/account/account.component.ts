import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { UserService } from '../../core/services/user.service';
import { ThemeService } from '../../core/services/theme.service';
import { HeaderComponent } from '../../shared/components/header/header.component';
import { FooterComponent } from '../../shared/components/footer/footer.component';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-account',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, HeaderComponent, FooterComponent],
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.scss']
})
export class AccountComponent implements OnInit, OnDestroy {
  accountForm: FormGroup;
  isLoadingData = true;
  isSaving = false;
  isDark = true
  successMessage = '';
  errorMessage = '';
  private themeSub?: Subscription;

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private themeService: ThemeService
  ) {
    this.accountForm = this.fb.group({
      username:[{value: '', disabled: true}],
      email: [{value: '', disabled: true}],

      firstName: [''],
      lastName: [''],
      phone: [''],
      addressLine1: [''],
      addressLine2: [''],
      city: [''],
      postalCode: [''],
      country: ['CA']
    });
  }

  ngOnInit() {
    this.themeSub = this.themeService.isDark$.subscribe(d => this.isDark = d);
    this.loadProfile();
  }

  ngOnDestroy() {
    this.themeSub?.unsubscribe();
  }

  loadProfile() {
    this.isLoadingData = true;
    this.userService.getProfile().subscribe({
      next: (profile) => {
        this.accountForm.patchValue(profile);
        this.isLoadingData = false;
      },
      error: (err) => {
        console.error('Failed to load profile', err);
        this.errorMessage = 'Could not load profile data.';
        this.isLoadingData = false;
      }
    });
  }

  onSubmit() {
    if (this.accountForm.valid) {
      this.isLoadingData = true;
      this.successMessage = '';
      this.errorMessage = '';

      const formData = this.accountForm.getRawValue();

      this.userService.updateProfile(formData).subscribe({
        next:() => {
          this.successMessage = 'Profile updated successfully.';
          this.isLoadingData = false;
          setTimeout(() => this.successMessage = '', 3000);
        },
        error: (err) => {
          console.error(err);
          this.errorMessage = 'Could not update profile data.';
          this.isLoadingData = false;
        }
      });
    }
  }
}

