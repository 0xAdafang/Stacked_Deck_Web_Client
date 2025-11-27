import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ThemeService } from '../../core/services/theme.service';
import { Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ProductService, Product } from '../../core/services/product.service';
import {HeaderComponent} from '../../shared/components/header/header.component';
import {FooterComponent} from '../../shared/components/footer/footer.component';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule, HeaderComponent, FooterComponent],
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.scss']
})
export class ProductListComponent implements OnInit, OnDestroy {
  isDark = true;
  private themeSub?: Subscription;

  filterForm: FormGroup;
  showMobileFilters = false;
  products: Product[] = [];
  loading = false;


  productTypes = [
    { label: 'Single Cards', value: 'SINGLE' },
    { label: 'Booster Packs', value: 'BOOSTER_PACK' },
    { label: 'Elite Trainer Boxes', value: 'ETB' },
    { label: 'Booster Boxes', value: 'BOOSTER_BOX' },
    { label: 'Bundles', value: 'BUNDLE' }
  ];

  sortOptions = [
    { label: 'Newest Arrivals', value: 'createdAt_desc' },
    { label: 'Price: Low to High', value: 'price_asc' },
    { label: 'Price: High to Low', value: 'price_desc' },
    { label: 'Name: A-Z', value: 'name_asc' }
  ];

  constructor(
    private themeService: ThemeService,
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private productService: ProductService
  ) {
    this.filterForm = this.fb.group({
      type: [''],
      minPrice: [null],
      maxPrice: [null],
      sort: ['createdAt_desc'],
      search: ['']
    });
  }

  ngOnInit(): void {
    this.themeSub = this.themeService.isDark$.subscribe(d => this.isDark = d);


    this.route.queryParams.subscribe(params => {

      this.filterForm.patchValue({
        type: params['type'] || '',
        sort: params['sort'] || 'createdAt_desc',
        minPrice: params['minPrice'] ? Number(params['minPrice']) : null,
        maxPrice: params['maxPrice'] ? Number(params['maxPrice']) : null,
        search: params['q'] || ''
      }, { emitEvent: false });

      this.loadProducts(params);
    });


    this.filterForm.valueChanges.pipe(
      debounceTime(500),
      distinctUntilChanged((a, b) => JSON.stringify(a) === JSON.stringify(b)) // Bloque si rien n'a changé
    ).subscribe(values => {
      this.updateUrl(values);
    });
  }

  loadProducts(params: any): void {
    this.loading = true;

    const filters = { ...params };

    this.productService.getProducts(filters).subscribe({
      next: (response) => {
        this.products = response.content || [];

        this.loading = false;
      },
      error: (err) => {
        console.error('API Error:', err);
        this.loading = false;
      }
    });
  }

  updateUrl(filters: any): void {
    const queryParams: any = {};


    if (filters.type) queryParams.type = filters.type;
    if (filters.sort) queryParams.sort = filters.sort;
    if (filters.minPrice) queryParams.minPrice = filters.minPrice;
    if (filters.maxPrice) queryParams.maxPrice = filters.maxPrice;
    if (filters.search) queryParams.q = filters.search;


    const currentParams = this.route.snapshot.queryParams;
    if (JSON.stringify(queryParams) === JSON.stringify(currentParams)) {
      return; // STOP : On ne fait rien si c'est pareil
    }

    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: queryParams,
      queryParamsHandling: 'merge',
    });
  }

  toggleMobileFilters(): void {
    this.showMobileFilters = !this.showMobileFilters;
  }


  getRarityColor(rarity: string): string {
    const colors: Record<string, string> = {
      COMMON: '#9ca3af', UNCOMMON: '#6b7280', RARE: '#8b5cf6',
      RARE_HOLO: '#a78bfa', DOUBLE_RARE: '#c084fc', TRIPLE_RARE: '#d8b4fe',
      ULTRA_RARE: '#ec4899', ILLUSTRATION_RARE: '#f472b6',
      SPECIAL_ILLUSTRATION_RARE: '#f9a8d4', HYPER_RARE: '#fbbf24',
      RAINBOW_RARE: '#facc15', SECRET_RARE: '#fde047',
      SHINY_RARE: '#86efac', SHINY: '#86efac', PROMO: '#60a5fa'
    };
    return colors[rarity] || '#9ca3af';
  }

  ngOnDestroy(): void {
    this.themeSub?.unsubscribe();
  }
}
