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
    { label: 'Single Card', value: 'SINGLE' },
    { label: 'Booster Pack', value: 'BOOSTER_PACK' },
    { label: 'Elite Trainer Box', value: 'ETB' },
    { label: 'Booster Box', value: 'BOOSTER_BOX' },
    { label: 'Bundle', value: 'BUNDLE' }
  ];

  rarities = [
    { value: 'COMMON', label: 'Common' },
    { value: 'UNCOMMON', label: 'Uncommon' },
    { value: 'RARE', label: 'Rare' },
    { value: 'RARE_HOLO', label: 'Rare Holo' },
    { value: 'DOUBLE_RARE', label: 'Double Rare' },
    { value: 'TRIPLE_RARE', label: 'Triple Rare' },
    { value: 'ULTRA_RARE', label: 'Ultra Rare' },
    { value: 'ILLUSTRATION_RARE', label: 'Illustration Rare' },
    { value: 'SPECIAL_ILLUSTRATION_RARE', label: 'Special Illustration Rare' },
    { value: 'HYPER_RARE', label: 'Hyper Rare (Gold)' },
    { value: 'SECRET_RARE', label: 'Secret Rare' },
    { value: 'PROMO', label: 'Promo' }
  ];


  conditions = [
    { value: 'NEAR_MINT', label: 'Near Mint' },
    { value: 'LIGHTLY_PLAYED', label: 'Lightly Played' },
    { value: 'MODERATELY_PLAYED', label: 'Moderately Played' },
    { value: 'HEAVILY_PLAYED', label: 'Heavily Played' },
    { value: 'DAMAGED', label: 'Damaged' }
  ];

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
      categoryId: ['', Validators.required],
      initialStock: [0],
      image: ['', Validators.required],
      type: ['SINGLE', Validators.required],
      rarity: [null],
      condition: [null],
      illustrator: [''],
      active: [true],
      featured: [false],

      cardDetails: this.fb.group({
        hp: [''],
        types: [''],
        stage: [''],
        retreatCost: [''],
        weakness: [''],
        resistance: [''],
        flavorText: [''],
        attackDetails: ['']
      }),

    });
  }

  ngOnInit() {
    this.themeSub = this.themeService.isDark$.subscribe(d => this.isDark = d);
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
      initialStock: 0,
      active: true,
      featured: false,
      type: 'SINGLE'
    });
    this.showForm = true;
  }

  currentStock: number | null = null;

  openEdit(product: Product) {
    this.isEditing = true;
    this.selectedProductId = product.id;
    this.showForm = true;
    this.currentStock = null;

    this.productForm.patchValue({
      sku: product.sku,
      name: product.name,
      description: product.description,
      price: product.price,
      initialStock: [0, [Validators.min(0)]],
      categoryId: (product as any).categoryId || '',
      image: product.image,
      type: product.type,
      rarity: product.rarity,
      condition: product.condition,
      illustrator: product.illustrator,
      active: (product as any).active ?? true,
      featured: (product as any).featured ?? false
    });

    if (product.cardDetails) {
      this.productForm.get('cardDetails')?.patchValue(product.cardDetails);
    }
  }

  onDelete(product: Product) {
    if (confirm(`Delete ${product.name}?`)) {
      this.adminService.deleteProduct(product.id).subscribe(() => {
        this.loadData();
      });
    }
  }

  private generateSlug(name: string): string {
    return name.toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }

  onSubmit() {
    if (this.productForm.invalid) return;

    const formVal = this.productForm.value;

    const cardDetails = formVal.type === 'SINGLE' ? formVal.cardDetails : null;

    const payload: any = {
      sku: formVal.sku,
      name: formVal.name,
      slug: this.generateSlug(formVal.name) + '-' + formVal.sku.toLowerCase(),
      description: formVal.description,

      images: [formVal.image],

      type: formVal.type,

      baseAmount: Math.round(formVal.price * 100),
      currency: 'CAD',

      categoryId: formVal.categoryId,
      active: formVal.active,
      initialStock: formVal.initialStock,


      illustrator: formVal.illustrator,
      cardDetails: cardDetails
    };

    if (this.isEditing && this.selectedProductId) {
      this.adminService.updateProduct(this.selectedProductId, payload).subscribe({
        next: () => {
          this.closeForm();
          this.loadData();
        },
        error: (err) => console.error('Erreur Update', err)
      });
    } else {
      this.adminService.createProduct(payload).subscribe({
        next: () => {
          this.closeForm();
          this.loadData();
        },
        error: (err) => {
          console.error('Erreur Création', err);
          alert('Erreur lors de la création (Vérifiez la console)');
        }
      });
    }
  }

  onRestock(inputElement: HTMLInputElement) {
    const qty = parseInt(inputElement.value, 10);

    if (!qty || qty <= 0) {
      alert("Please enter a valid quantity");
      return;
    }

    if (this.selectedProductId) {

      this.adminService.addStock(this.selectedProductId, qty).subscribe({
        next: () => {
          alert(`Successfully added ${qty} units!`);
          inputElement.value = '';
          this.loadData();
        },
        error: (err) => {
          console.error('Restock failed', err);
          alert('Error adding stock. Check console.');
        }
      });
    }
  }

  closeForm() {
    this.showForm = false;
  }
}



