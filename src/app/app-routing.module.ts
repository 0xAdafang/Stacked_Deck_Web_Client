import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

export const routes: Routes = [
  {path : '', redirectTo: '/auth', pathMatch: 'full'},
  {path: 'auth', loadChildren: () => import('./features/auth/auth.module').then(m => m.AuthModule)},
  {path: 'home', loadChildren: () => import('./features/home/home.module').then(m => m.HomeModule)}
]
@NgModule({

  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]

})
export class AppModule { }
