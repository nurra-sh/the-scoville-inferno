import { computed, Injectable, signal } from '@angular/core';
import { RolesEnum, RolesIdEnum, User } from '../types/auth.types';
import { TOKEN_KEY } from '../../../core/constants/auth.constants';

@Injectable({
    providedIn: 'root',
})
export class Auth {
    private readonly tokenSignal = signal<string | null>(this.getTokenFromLocalStorage())
    private readonly currentUserSignal = signal<User | null>(null)
    readonly token = this.tokenSignal.asReadonly()
    readonly currentUser = this.currentUserSignal.asReadonly()

    readonly isAuthenticated = computed(() => {
        return Boolean(this.token()) && Boolean(this.currentUser())
    })

    hasRoles(roles: RolesEnum[]) {
        let hasRole = false

        if (this.isAuthenticated()) {
            for (const role of roles) {
                if (this.currentUser()?.roleId === RolesIdEnum[role]) {
                    hasRole = true
                }
            }
        }

        return hasRole
    }

    setToken(token: string) {
        this.tokenSignal.set(token)
        this.addTokenToLocalStorage(token)
    }

    clearToken() {
        this.tokenSignal.set(null)
    }

    setCurrentUser(user: User) {
        this.currentUserSignal.set(user)
    }

    clearCurrentUser() {
        this.currentUserSignal.set(null)
    }

    clearSession() {
        this.clearToken()
        this.clearCurrentUser()
        this.removeTokenFromLocalStorage()
    }

    private addTokenToLocalStorage(token: string) {
        return localStorage.setItem(TOKEN_KEY, token)
    }

    private getTokenFromLocalStorage() {
        return localStorage.getItem(TOKEN_KEY) || null
    }

    private removeTokenFromLocalStorage() {
        return localStorage.removeItem(TOKEN_KEY)
    }
}