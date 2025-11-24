import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { CommonModule } from '@angular/common';
import { ThemeService } from '../../../core/services/theme.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-verify',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './verify.component.html',
  styleUrls: ['./verify.component.scss']
})
export class VerifyComponent implements OnInit, OnDestroy {
  email?: string;
  verified = false;
  verifyError = false;
  isLoading = false;

  isDark = true;
  private themeSubscription?: Subscription;

  constructor(
    private route: ActivatedRoute,
    private auth: AuthService,
    private router: Router,
    private themeService: ThemeService
  ) {}

  ngOnInit(): void {

    this.themeSubscription = this.themeService.isDark$.subscribe(
      isDark => this.isDark = isDark
    );

    this.email = this.route.snapshot.queryParamMap.get('email') ?? undefined;
    const token = this.route.snapshot.queryParamMap.get('token');

    if (token) {
      this.isLoading = true; // On commence la vérification

      this.auth.verifyEmail(token).subscribe({
        next: () => {
          this.isLoading = false;
          this.verified = true;

          setTimeout(() => {
            this.router.navigate(['/auth/login'], {
              queryParams: { verified: 'true' }
            });
          }, 2000);
        },
        error: () => {
          this.isLoading = false;
          this.verifyError = true;

          setTimeout(() => {
            this.router.navigate(['/auth/login'], {
              queryParams: { verifyError: 'true' }
            });
          }, 4000);
        }
      });
    } else if (!this.email) {
      this.verifyError = true;
      setTimeout(() => {
        this.router.navigate(['/auth/login']);
      }, 3000);
    }
  }

  ngOnDestroy(): void {
    this.themeSubscription?.unsubscribe();
  }
}
