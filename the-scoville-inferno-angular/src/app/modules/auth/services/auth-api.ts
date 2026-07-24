import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { LoginBody, LoginResponse, RegisterBody, RegisterResponse } from '../types/auth.types';
import { environment } from '../../../../environments/environment';
import { tap } from 'rxjs';
import { MessageService } from 'primeng/api';

@Injectable({
  providedIn: 'root',
})
export class AuthApi {
  private readonly http = inject(HttpClient);
  private readonly messageService = inject(MessageService);

  login(body: LoginBody) {
    return this.http.post<LoginResponse>(`${environment.apiUrl}/auth/login`, this.normalizeLoginBody(body)).pipe(
      tap((response) => {
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