import { Routes } from '@angular/router';
import { authGuard } from 'src/app/core/interceptors/auth.guard';

export const routes: Routes = [
  {
    path: 'home',
    loadComponent: () => import('src/app/home/home.page').then((m) => m.HomePage),
  },
  {
    path: 'veiculos',
    loadComponent: () =>
      import('src/app/veiculos/veiculos.page').then((m) => m.VeiculosPage),
    canActivate: [authGuard],
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
];
