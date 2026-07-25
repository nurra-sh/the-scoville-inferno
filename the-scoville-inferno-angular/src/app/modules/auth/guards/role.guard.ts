import { inject } from "@angular/core";
import { CanActivateFn, Router } from "@angular/router";
import { Auth } from "../services/auth";
import { RolesEnum } from "../types/auth.types";

export const roleGuard = (roles: RolesEnum[]): CanActivateFn => {
  return () => {
    const authService = inject(Auth)
    const router = inject(Router)

    if (!authService.isAuthenticated()) {
      return router.createUrlTree(['/'])
    }

    return authService.hasRoles(roles) ? true : router.createUrlTree(['/'])
  }
}