import { Routes } from '@angular/router';
import { ClientAuthGuard } from './guards/client-auth.guard';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { LoginAuthGuard } from './guards/login-auth.guard';

export const routes: Routes = [
    {
        path: '',
        loadChildren: () =>
            import('./auth/auth.module').then((m) => m.AuthModule),
    },
    {
        path: 'admin',
        canActivate: [ClientAuthGuard],
        canLoad: [ClientAuthGuard],
        loadChildren: () =>
            import('./admin-portal/admin-portal.module').then((m) => m.AdminPortalModule),
    },
    {
        path: '**',
        redirectTo: '/pagenotfound',
        pathMatch: 'full',
    },
    {
        path: 'pagenotfound',
        component: PageNotFoundComponent,
        canActivate: [LoginAuthGuard],
        canLoad: [LoginAuthGuard],
    },
];
