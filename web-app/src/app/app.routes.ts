import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: '/browse', pathMatch: 'full' },
  {
    path: 'home',
    loadComponent: () =>
      import('./home/home.component').then((m) => m.HomeComponent),
    canActivate: [authGuard],
  },
  {
    path: 'login',
    loadComponent: () =>
      import('./auth/login/login.component').then((m) => m.LoginComponent),
  },
  {
    path: 'browse',
    loadComponent: () =>
      import('./browse/browse.component').then((m) => m.BrowseComponent),
    canActivate: [authGuard],
  },
  {
    path: 'media/:id',
    loadComponent: () =>
      import('./media-detail/media-detail.component').then((m) => m.MediaDetailComponent),
    canActivate: [authGuard],
  },
  {
    path: 'watchlist',
    loadComponent: () =>
      import('./watchlist/watchlist.component').then((m) => m.WatchlistComponent),
    canActivate: [authGuard],
  },
  { path: '**', redirectTo: '/browse' },
];
