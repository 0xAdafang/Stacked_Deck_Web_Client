import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient, HttpParams } from '@angular/common/http';

@Component({
  selector: 'app-verify-email',
  template: `<p>Vérification de ton email...</p>`,

})

export class VerifyComponent implements OnInit {
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private http: HttpClient
  ) {}

  ngOnInit() {
    const token = this.route.snapshot.queryParamMap.get('token');

    if (!token) {
      this.router.navigate(['/auth/login'], { queryParams: { verifyError: 1 } });
      return;
    }

    const params = new HttpParams().set('token', token);

    this.http.get('/api/auth/verify', {params, withCredentials: true}).subscribe({
      next: data => {
        this.router.navigate(['/auth/login'], { queryParams: { verified: 1 } });
      },
      error: () => {
        this.router.navigate(['/auth/login'], { queryParams: { verifyError: 1 } });
      }
    });
  }
}
