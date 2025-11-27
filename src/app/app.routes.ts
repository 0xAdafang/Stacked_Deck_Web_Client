import { Routes } from '@angular/router';
import { AuthGuard } from './core/guards/auth.guard';
import { ProductListComponent } from './features/products/product-list.component';

export const routes: Routes = [
  // 1. D'abord les routes spécifiques
  {
    path: 'home',
    // On garde le AuthGuard si vous voulez vérifier quelque chose,
    // mais assurez-vous que '/home' est bien dans PUBLIC_ROUTES du guard (ce qui est le cas)
    canActivate: [AuthGuard],
    loadChildren: () =>
      import('./features/home/home.module').then(m => m.HomeModule)
  },
  {
    path: 'products',
    component: ProductListComponent,
    // Pas de AuthGuard ici car c'est public
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

  // 2. Ensuite la racine
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'home' // Mieux vaut rediriger vers Home que Login pour un site e-commerce
  },

  // 3. EN DERNIER : Le Wildcard (404)
  // Tout ce qui n'a pas été trouvé au dessus tombe ici
  {
    path: '**',
    redirectTo: 'home' // Ou vers une page 404
  }
];
