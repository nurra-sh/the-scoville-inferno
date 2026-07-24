import { HttpInterceptorFn } from "@angular/common/http";
import { inject } from "@angular/core";
import { Auth } from "../../modules/auth/services/auth";

const apiRequestInterpector: HttpInterceptorFn = (request, next) => {
    const token = inject(Auth).token()

    if (!token) {
        return next(request)
    }

    return next(
        request.clone({
            setHeaders: {
                Authorization: `Bearer ${token}`
            }
        })
    )
}

export default apiRequestInterpector