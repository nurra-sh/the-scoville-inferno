import { inject } from "@angular/core";
import { CanActivateFn, Router } from "@angular/router";
import { Auth } from "../services/auth";
import { AuthApi } from "../services/auth-api";
import { catchError, map, of } from "rxjs";

const authGuard: CanActivateFn = () => {
    const authApi = inject(AuthApi)
    const authService = inject(Auth)
    const router = inject(Router)

    // Если есть токен и данные пользователя, то пропускаем
    if (authService.isAuthenticated()) {
        return true
    }

    // Пытаемся получить пользователя, если есть хотя бы токен
    if(authService.token() && !authService.currentUser()) {
        return authApi.me().pipe(
            map(() => true),
            catchError(() => of(router.createUrlTree(['/login'])))
        )
    }

    // Если нет ни токена ни пользователя
    return of(router.createUrlTree(['/login']))
}

export default authGuard