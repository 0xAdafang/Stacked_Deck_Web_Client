import { Component, OnInit, HostBinding } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CheckoutService, CheckoutSummary as CheckoutSummaryType } from '../../core/services/checkout.service';
import {debounceTime, distinctUntilChanged, startWith, switchMap, tap, catchError} from 'rxjs/operators';
import { RouterModule } from '@angular/router';
import {combineLatest, of, Subscription} from 'rxjs';
import { HeaderComponent } from '../../shared/components/header/header.component';
import { FooterComponent } from '../../shared/components/footer/footer.component';
import {ThemeService} from '../../core/services/theme.service';


@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule, HeaderComponent, FooterComponent],
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.scss']
})
export class CheckoutComponent implements OnInit {
  @HostBinding('class.dark-theme') get darkTheme() { return this.isDark; }
  @HostBinding('class.light-theme') get lightTheme() { return !this.isDark; }

  isDark = true;
  private themeSubscription?: Subscription;
  checkoutForm: FormGroup;
  summary?: CheckoutSummaryType;
  loading = false;

  shippingMethods = [
    { value: 'STANDARD', label: 'Standard (5-7 days)', price: 499 },
    { value: 'EXPRESS', label: 'Express (1-2 days)', price: 1499 }
  ];

  constructor(
    private fb: FormBuilder,
    private checkoutService: CheckoutService,
    private themeService: ThemeService
  ) {
    this.checkoutForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      addressLine1: ['', Validators.required],
      addressLine2: [''],
      city: ['', Validators.required],
      country: ['CA', Validators.required],
      postalCode: ['', Validators.required],
      phone: ['', Validators.required],
      shippingMethod: ['STANDARD', Validators.required]
    });
  }

  ngOnInit() {

    this.themeSubscription = this.themeService.isDark$.subscribe(d => {
      this.isDark = d;
    });

    const shipping$ = this.checkoutForm.get('shippingMethod')!.valueChanges.pipe(
      startWith(this.checkoutForm.get('shippingMethod')!.value)
    );

    const country$ = this.checkoutForm.get('country')!.valueChanges.pipe(
      startWith(this.checkoutForm.get('country')!.value),
      debounceTime(500),
      distinctUntilChanged()
    );


    combineLatest([shipping$, country$]).pipe(
      tap(() => this.loading = true),


      switchMap(([shippingMethod, country]) => {

        return this.checkoutService.getSummary(shippingMethod, country).pipe(
          catchError((err: any) => {
            console.error('Error fetching summary', err);
            return of(null as unknown as CheckoutSummaryType | null);
          })
        );
      })
    ).subscribe((summary: CheckoutSummaryType | null) => {
      if (summary) {
        this.summary = summary;
      }
      this.loading = false;
    });
  }

  get isFreeShippingEligible(): boolean {
    return (this.summary?.subtotal ?? 0) >= 10000;
  }

  get amountUntilFreeShipping(): number {
    return Math.max(0, 10000 - (this.summary?.subtotal ?? 0));
  }


  onSubmit(): void {
    if (this.checkoutForm.invalid) {
      this.checkoutForm.markAllAsTouched();
      return;
    }

    this.loading = true;

    const totalAmount = this.summary?.total || 0;
    const email = this.checkoutForm.get('email')!.value;

    if (totalAmount <= 0 ) {
      alert("Invalid total amount");
      this.loading = false;
      return;
    }

    this.checkoutService.createStripeSession(totalAmount, 'cad', email).subscribe({
      next: (response) => {
        if (response.paymentUrl) {
          window.location.href = response.paymentUrl;
        }
      },
      error: (err) => {
        console.error('Payment error', err);
        this.loading = false;
        alert('Payment initiation failed. Please try again.');
      }
    });
    console.log('Proceeding to payment with:', this.checkoutForm.value);
  }
}
