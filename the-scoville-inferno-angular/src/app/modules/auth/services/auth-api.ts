import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { GetMeResponse, LoginBody, LoginResponse, RegisterBody, RegisterResponse } from '../types/auth.types';
import { environment } from '../../../../environments/environment';
import { tap } from 'rxjs';
import { MessageService } from 'primeng/api';
import { Auth } from './auth';

@Injectable({
  providedIn: 'root',
})
export class AuthApi {
  private readonly http = inject(HttpClient);
  private readonly messageService = inject(MessageService);
  private readonly authService = inject(Auth)

  login(body: LoginBody) {
    return this.http.post<LoginResponse>(`${environment.apiUrl}/auth/login`, this.normalizeLoginBody(body)).pipe(
      tap((response) => {
        if (response.token) {
          this.authService.setToken(response.token)
        }
        if (response.user) {
          this.authService.setCurrentUser(response.user)
        }
        this.messageService.add({ key: 'app', severity: 'success', summary: 'Success', detail: response.message || 'Login successful' })
      })
    )
  }

  register(body: RegisterBody) {
    return this.http.post<RegisterResponse>(`${environment.apiUrl}/auth/register`, this.normalizeRegisterBody(body)).pipe(
      tap((response) => {
        this.messageService.add({ key: 'app', severity: 'success', summary: 'Success', detail: response.message || 'Registration successful' })
      })
    )
  }

  me() {
    return this.http.get<GetMeResponse>(`${environment.apiUrl}/auth/me`, {
      headers: {
        Authorization: `Bearer ${this.authService.token()}`
      }
    }).pipe(
      tap((response) => {
        this.authService.setCurrentUser(response.user)
      })
    )
  }

  private normalizeLoginBody(body: LoginBody) {
    return {
      email: body.email.trim().toLowerCase(),
      password: body.password.trim(),
    }
  }

  private normalizeRegisterBody(body: RegisterBody) {
    return {
      email: body.email.trim().toLowerCase(),
      password: body.password.trim(),
      password_confirmation: body.password_confirmation.trim(),
      fullName: body.fullName.trim(),
    }
  }
}