import { Routes } from '@angular/router';
import { LoginPage } from './pages/login-page/login-page';
import { RegisterPage } from './pages/register-page/register-page';
import { MainLayout } from './layout/main-layout/main-layout';
import { TestPage } from './pages/test-page/test-page';
import authGuard from './modules/auth/guards/auth.guard';
import guestGuard from './modules/auth/guards/guest.guard';
import { AdminProductsPage } from './pages/admin/admin-products-page/admin-products-page';
import { RouterOutletShell } from './layout/router-outlet-shell/router-outlet-shell';
import { roleGuard } from './modules/auth/guards/role.guard';
import { RolesEnum } from './modules/auth/types/auth.types';

export const routes: Routes = [
    {
        path: '',
        component: MainLayout,
        children: [
            {
                path: 'login',
                component: LoginPage,
                canActivate: [guestGuard]
            },
            {
                path: 'register',
                component: RegisterPage,
                canActivate: [guestGuard]
            }, 
            {
                path: 'test',
                component: TestPage,
                canActivate: [authGuard] 
            },
            {
                path: 'admin',
                component: RouterOutletShell,
                canActivate: [authGuard, roleGuard([RolesEnum.ADMIN])],
                children: [
                    {
                      path: 'products',
                      component: AdminProductsPage  
                    }
                ]
            }
        ]
    }
];