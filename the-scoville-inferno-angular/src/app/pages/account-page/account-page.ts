import { ChangeDetectionStrategy, Component, effect, inject } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { Auth } from '../../modules/auth/services/auth';
import { UsersApiService } from '../../modules/users/services/users-api.service';
import { Router } from '@angular/router';
import { InputMaskModule } from 'primeng/inputmask';

@Component({
  selector: 'app-account-page',
  imports: [
    ReactiveFormsModule,
    ButtonModule,
    InputTextModule,
    TextareaModule,
    InputMaskModule,
  ],
  standalone: true,
  templateUrl: './account-page.html',
  styleUrl: './account-page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AccountPage {
  private readonly fb = inject(NonNullableFormBuilder);
  private readonly auth = inject(Auth);
  private readonly usersApiService = inject(UsersApiService);
  private readonly router = inject(Router);

  readonly form = this.fb.group({
    fullName: ['', Validators.required],
    phone: [''],
    city: [''],
    shippingAddress: [''],
  });

  constructor() {
    // as soon as the user is available, the form is populated
    effect(() => {
      const user = this.auth.currentUser();
      if (!user) {
        return;
      }

      this.form.reset({
        fullName: user.fullName ?? '',
        phone: user.phone ?? '',
        city: user.city ?? '',
        shippingAddress: user.shippingAddress ?? '',
      });
    });
  }

  onSave(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const payload = this.form.getRawValue();

    this.usersApiService.updateProfile(payload).subscribe(() => {
      this.form.markAsPristine();
    });
  }
}
