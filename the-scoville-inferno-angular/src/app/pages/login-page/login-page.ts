import { Component, inject } from '@angular/core';
import { ReactiveFormsModule, NonNullableFormBuilder, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { MessageModule } from 'primeng/message';
import { PasswordModule } from 'primeng/password';
import { AuthApi } from '../../modules/auth/services/auth-api';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-login-page',
  imports: [CardModule, ButtonModule, InputTextModule, ButtonModule, MessageModule, PasswordModule, ReactiveFormsModule, RouterLink],
  templateUrl: './login-page.html',
  styleUrl: './login-page.scss',
})
export class LoginPage {
  private readonly formBuilder = inject(NonNullableFormBuilder)
  private readonly authApi = inject(AuthApi)

  readonly loginForm = this.formBuilder.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]]
  })

  onSubmit() {
    if (this.loginForm.invalid) {
      return;
    }

    this.authApi.login(this.loginForm.getRawValue()).subscribe({
      next: (response) => {
        console.log(response)
      }
    })
  }
}