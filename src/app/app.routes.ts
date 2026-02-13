import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'about',
    pathMatch: 'full'
  },
  {
    path: 'about',
    loadComponent: () => import('./pages/about/about-page.component')
  },
  {
    path: 'contact',
    loadComponent: () => import('./pages/contact/contact-page.component')
  },
  {
    path: 'pricing',
    loadComponent: () => import('./pages/pricing/pricing-page.component')
  },
   {
    path: 'pokemon',
    loadComponent: () => import('./pages/pokemon/pokemon-page.component')
  },
  {
    path: 'pokemon/:id',
    loadComponent: () => import('./pages/pokemon-page/pokemon-page')
  },
  {
    path: '**',
    redirectTo: () => {
      return 'about'
    }
  },
];
