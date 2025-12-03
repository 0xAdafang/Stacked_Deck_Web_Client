import { Routes } from '@angular/router';
import { AuthGuard } from './core/guards/auth.guard';
import { ProductListComponent } from './features/products/product-list.component';
import { ProductDetailComponent } from './features/product-detail/product-detail.component';
import { CartComponent } from './features/cart/cart.component';

export const routes: Routes = [

  {
    path: 'home',

    canActivate: [AuthGuard],
    loadChildren: () =>
      import('./features/home/home.module').then(m => m.HomeModule)
  },
  {
    path: 'cart',
    canActivate: [AuthGuard],
    loadComponent: () => import('./features/cart/cart.component').then(m => m.CartComponent)
  },
  {
    path: 'products',
    component: ProductListComponent,

  },
  {
    path: 'products/:slug', component: ProductDetailComponent,
  },
  {
    path: 'auth',
    loadChildren: () =>
      import('./features/auth/auth.module').then(m => m.AuthModule)
  },
  {
    path: 'reset-password',
    redirectTo: 'auth/reset-password'
  },

  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'home'
  },

  {
    path: '**',
    redirectTo: 'home'
  }
];
