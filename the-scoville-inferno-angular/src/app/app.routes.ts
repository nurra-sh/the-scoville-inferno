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
import { ProductsPage } from './pages/products-page/products-page';
import { ProductDetailsPage } from './pages/product-details-page/product-details-page';
import { AdminProductFormPage } from './pages/admin/admin-product-form-page/admin-product-form-page';
import { AccountPage } from './pages/account-page/account-page';
import { CartPage } from './pages/cart-page/cart-page';
import { CheckoutPage } from './pages/checkout-page/checkout-page';
import { OrderSuccessPage } from './pages/order-success-page/order-success-page';

export const routes: Routes = [
    {
        path: '',
        component: MainLayout,
        children: [
            {
                path: '',
                redirectTo: '/products',
                pathMatch: 'full'
            },
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
                path: 'products',
                component: RouterOutletShell,
                canActivate: [authGuard],
                children: [
                    {
                        path: '',
                        component: ProductsPage
                    },
                    {
                        path: ':id',
                        component: ProductDetailsPage
                    }
                ]
            },
            {
                path: 'cart',
                component: CartPage
            },
            {
                path: 'account',
                component: AccountPage,
                canActivate: [authGuard]
            },
            {
                path: 'checkout',
                component: CheckoutPage,
                canActivate: [authGuard]
              },
              {
                path: 'order-success',
                component: OrderSuccessPage
              },
            {
                path: 'admin',
                component: RouterOutletShell,
                canActivate: [authGuard, roleGuard([RolesEnum.ADMIN])],
                children: [
                    {
                        path: 'products',
                        component: AdminProductsPage
                    },
                    {
                        path: 'products/new',
                        component: AdminProductFormPage
                    },
                    {
                        path: 'products/:id/edit',
                        component: AdminProductFormPage
                    }
                ]
            }
        ]
    }
];