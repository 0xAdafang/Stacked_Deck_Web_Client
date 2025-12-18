import { Routes } from '@angular/router';
import { AuthGuard } from './core/guards/auth.guard';
import { ProductListComponent } from './features/products/product-list.component';
import { ProductDetailComponent } from './features/product-detail/product-detail.component';


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
    path: 'checkout',
    canActivate: [AuthGuard],

    loadComponent: () => import('./features/checkout/checkout.component').then(m => m.CheckoutComponent)
  },
  {
    path: 'orders',
    loadComponent: () => import('./features/orders/order-history.component')
      .then(m => m.OrderHistoryComponent),
    canActivate: [AuthGuard]
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
    path: 'account',
    loadComponent: () => import('./features/account/account.component').then(m => m.AccountComponent),
    canActivate: [AuthGuard]
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
