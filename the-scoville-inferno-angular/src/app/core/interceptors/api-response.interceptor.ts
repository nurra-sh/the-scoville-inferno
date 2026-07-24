import { HttpErrorResponse, HttpInterceptorFn } from "@angular/common/http";
import { inject, NgZone } from "@angular/core";
import { MessageService } from "primeng/api";
import { Router } from "@angular/router";
import { APP_TOAST_KEY } from "../constants/toats.constants";
import { catchError, throwError } from "rxjs";

const AUTH_ENDPOINTS = ['login', 'register'] as const

const apiResponseInterpector: HttpInterceptorFn = (request, next) => {
    const ngZone = inject(NgZone)
    const messageService = inject(MessageService)
    const router = inject(Router)

    return next(request).pipe(
        catchError((error: unknown) => {
            if (error instanceof HttpErrorResponse) {
                ngZone.run(() => {
                    handleHttpError(error, request.url, messageService, router)
                })
            }

            return throwError(() => error)
        })
    )
}

function handleHttpError(
    error: HttpErrorResponse,
    requestUrl: string,
    messageService: MessageService,
    router: Router
) {
    let isAuthEndpoint = false

    for (const endpoints of AUTH_ENDPOINTS) {
        if (requestUrl.includes(endpoints)) {
            isAuthEndpoint = true
            break
        }
    }

    if (error.status === 401 && !isAuthEndpoint) {
        messageService.add({
            key: APP_TOAST_KEY,
            severity: 'warn',
            summary: 'Сессия истекла',
            detail: 'Пожалуйста, авторизуйтесь заново'
        })

        router.navigate(['/login'])
    }
    else {
        if (error?.error?.errors?.length > 0) {
            for (const err of error?.error.errors) {
                messageService.add({
                    key: APP_TOAST_KEY,
                    severity: 'error',
                    summary: 'Ошибка',
                    detail: err?.message || 'Произошла неизвестная ошибка',
                });
            }
        }
        else {
            messageService.add({
                key: APP_TOAST_KEY,
                severity: 'error',
                summary: 'Ошибка',
                detail: error?.error?.message || 'Произошла неизвестная ошибка',
            });
        }
    }
}

export default apiResponseInterpector