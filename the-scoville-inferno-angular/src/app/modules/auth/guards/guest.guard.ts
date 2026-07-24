import { inject } from "@angular/core";
import { CanActivateFn, Router } from "@angular/router";
import { Auth } from "../services/auth";
import { catchError, map, of } from "rxjs";
import { AuthApi } from "../services/auth-api";

const guestGuard: CanActivateFn = () => {
    const authApi = inject(AuthApi)
    const authService = inject(Auth)
    const router = inject(Router)

    // Если есть токен и данные пользователя, то делаем редайрект
    if (authService.isAuthenticated()) {
        // TODO: TEMP - /test поменять на главную страницу
        return of(router.createUrlTree(['/test']))
    }

    // Пытаемся получить пользователя, если есть хотя бы токен
    if(authService.token() && !authService.currentUser()) {
        return authApi.me().pipe(
            // TODO: TEMP - /test поменять на главную страницу
            map(() => router.createUrlTree(['/test'])),
            catchError(() => of(true))
        )
    }

    // Если нет ни токена ни пользователя
    return of(true)
}

export default guestGuard