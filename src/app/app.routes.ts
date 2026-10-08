import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadChildren: () =>
      import('./features/certifications/certifications.routes').then(
        m => m.CERTIFICATIONS_ROUTES
      )
  },
  {
    path: '**',
    redirectTo: ''
  }
];
