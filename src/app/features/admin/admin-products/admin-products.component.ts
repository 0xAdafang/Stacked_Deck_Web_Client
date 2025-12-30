import {Component, OnDestroy, OnInit} from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ProductService } from '../../../core/services/product.service';
import { AdminService, ProductRequest, CategoryDto } from '../../../core/services/admin.service';
import { Product } from '../../../core/models/product.model';
import {FooterComponent} from '../../../shared/components/footer/footer.component';
import {HeaderComponent} from '../../../shared/components/header/header.component';
import { RouterModule } from '@angular/router';
import { ThemeService } from '../../../core/services/theme.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-admin-products',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, CurrencyPipe, FooterComponent, HeaderComponent, RouterModule],
  templateUrl: 'admin-products.component.html',
  styleUrls: ['admin-products.component.scss']
})
export class AdminProductsComponent implements OnInit, OnDestroy {
  products: Product[] = [];
  categories: CategoryDto[] = [];
  productForm: FormGroup;

  isDark = true;
  private themeSub?: Subscription;

  loading = false;
  isEditing = false;
  showForm = false;
  selectedProductId?: string;

  productTypes = [
    { label: 'Single Card', value: 'SINGLE_CARD' },
    { label: 'Booster Pack', value: 'BOOSTER_PACK' },
    { label: 'Elite Trainer Box', value: 'ETB' },
    { label: 'Booster Box', value: 'BOOSTER_BOX' },
    { label: 'Bundle', value: 'BUNDLE' }
  ]

  rarities = ['COMMON', 'UNCOMMON', 'RARE', 'RARE_HOLO', 'DOUBLE_RARE', 'ULTRA_RARE', 'ILLUSTRATION_RARE', 'SPECIAL_ILLUSTRATION_RARE', 'SECRET_RARE', 'HYPER_RARE'];

  conditions = ['NEAR_MINT', 'LIGHTLY_PLAYED', 'MODERATELY_PLAYED', 'HEAVILY_PLAYED', 'DAMAGED'];

  constructor(
    private productService: ProductService,
    private adminService : AdminService,
    private fb: FormBuilder,
    private themeService : ThemeService
  ) {
    this.productForm = this.fb.group({
      sku: ['', Validators.required],
      name: ['', Validators.required],
      description: ['', Validators.required],
      price: [0, [Validators.required, Validators.min(0)]],
      stockQuantity: [0, [Validators.required, Validators.min(0)]],
      categoryId: ['', Validators.required],
      image: ['', Validators.required],
      type: ['SINGLE_CARD', Validators.required],
      rarity: [null],
      condition: [null],
      active: [true],
      featured: [false]
    });
  }

  ngOnInit() {
    this.themeSub = this.themeService.isDark$.subscribe(d => this.isDark = d); // + Subscribe
    this.loadData();
  }

  ngOnDestroy() { this.themeSub?.unsubscribe(); }

  loadData() {
    this.loading = true;

    this.productService.getProducts({page: 0, size: 100}).subscribe({
      next: (page) => {
        this.products = page.content;
        this.loading = false;
      },
      error: () => this.loading = false
    });

    this.adminService.getCategories().subscribe(cats => this.categories = cats);
  }

  openCreate() {
    this.isEditing = false;
    this.selectedProductId = undefined;
    this.productForm.reset({
      price: 0,
      stockQuantity: 0,
      active: true,
      featured: false,
      type: 'SINGLE_CARD'
    });
    this.showForm = true;
  }

  openEdit(product: Product) {
    this.isEditing = true;
    this.selectedProductId = product.id;
    this.showForm = true;

    this.productForm.patchValue({
      sku: product.sku,
      name: product.name,
      description: product.description,
      price: product.price,
      stockQuantity: product.stockQuantity,
      categoryId: (product as any).categoryId || '',
      image: product.image,
      type: product.type,
      rarity: product.rarity,
      condition: product.condition,
      active: (product as any).active ?? true,
      featured: (product as any).featured ?? false
    });
  }

  onDelete(product: Product) {
    if (confirm(`Delete ${product.name}?`)) {
      this.adminService.deleteProduct(product.id).subscribe(() => {
        this.loadData();
      });
    }
  }

  onSubmit() {
    if (this.productForm.invalid) return;

    const formVal = this.productForm.value;

    const payload: ProductRequest = {
      ...formVal,
      price: Math.round(formVal.price * 100)
    };

    if (this.isEditing && this.selectedProductId) {
      this.adminService.updateProduct(this.selectedProductId, payload).subscribe(() => {
        this.closeForm();
        this.loadData();
      });
    } else {
      this.adminService.createProduct(payload).subscribe(() => {
        this.closeForm();
        this.loadData();
      });
    }
  }

  closeForm() {
    this.showForm = false;
  }
}



