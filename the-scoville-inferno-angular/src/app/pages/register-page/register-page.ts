import { Component, inject } from '@angular/core';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MessageModule } from 'primeng/message';
import { PasswordModule } from 'primeng/password';
import { RouterLink } from '@angular/router';
import { AuthApi } from '../../modules/auth/services/auth-api';
import { mustMatch } from '../../shared/validators/must-watch.validator';

@Component({
  selector: 'app-register-page',
  imports: [ReactiveFormsModule, CardModule, InputTextModule, ButtonModule, MessageModule, PasswordModule, RouterLink],
  templateUrl: './register-page.html',
  styleUrl: './register-page.scss',
})
export class RegisterPage {
  private readonly formBuilder = inject(NonNullableFormBuilder);
  private readonly authApi = inject(AuthApi);
  private readonly router = inject(Router);

  readonly registerForm = this.formBuilder.group({
    fullName: ['', []],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]],
    password_confirmation: ['', [Validators.required]]
  }, { validators: mustMatch('password', 'password_confirmation') })

  onSubmit() {
    if (this.registerForm.invalid) {
      return;
    }

    this.authApi.register(this.registerForm.getRawValue()).subscribe({
      next: () => {
        this.router.navigate(['/login']);
      }
    });
  }
}
