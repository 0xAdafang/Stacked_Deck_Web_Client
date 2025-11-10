import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router, RouterLink} from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import {CommonModule} from '@angular/common';

@Component({
  selector: 'app-verify',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './verify.component.html',
  styleUrls: ['./verify.component.scss']
})
export class VerifyComponent implements OnInit {
  email?: string;
  verified = false;
  verifyError = false;

  constructor(
    private route: ActivatedRoute,
    private auth: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.email = this.route.snapshot.queryParamMap.get('email') ?? undefined;

    const token = this.route.snapshot.queryParamMap.get('token');

    if (token) {

      this.auth.verifyEmail(token).subscribe({
        next: () => {
          this.verified = true;


          setTimeout(() => {
            this.router.navigate(['/auth/login'], {
              queryParams: { verified: 'true' }
            });
          }, 2000);
        },
        error: () => {
          this.verifyError = true;


          setTimeout(() => {
            this.router.navigate(['/auth/login'], {
              queryParams: { verifyError: 'true' }
            });
          }, 3000);
        }
      });
    } else if (this.email) {

    } else {

      this.verifyError = true;
      setTimeout(() => {
        this.router.navigate(['/auth/login']);
      }, 3000);
    }
  }
}
