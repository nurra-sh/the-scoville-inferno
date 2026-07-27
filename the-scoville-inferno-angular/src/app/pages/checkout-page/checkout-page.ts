import { Component, effect, inject, signal } from "@angular/core";
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from "@angular/forms";
import { DecimalPipe } from "@angular/common";
import { Router } from "@angular/router";
import { ButtonModule } from "primeng/button";
import { InputTextModule } from "primeng/inputtext";
import { TextareaModule } from "primeng/textarea";
import { Auth } from "../../modules/auth/services/auth";
import { CartStore } from "../../modules/cart/store/cart-store";
import { OrdersApiService } from "../../modules/orders/services/orders-api.service";
import { PaymentMethod } from "../../modules/orders/types/orders.types";

@Component({
    selector: 'app-checkout-page',
    imports: [ReactiveFormsModule, InputTextModule, TextareaModule, ButtonModule, DecimalPipe],
    templateUrl: './checkout-page.html',
    styleUrl: './checkout-page.scss',
})
export class CheckoutPage {
    private readonly fb = inject(NonNullableFormBuilder)
    private readonly auth = inject(Auth)
    private readonly cartStore = inject(CartStore)
    private readonly ordersApi = inject(OrdersApiService)
    private readonly router = inject(Router)

    readonly summary = this.cartStore.summary
    readonly submitting = signal(false)

    readonly form = this.fb.group({
        fullName: ['', [Validators.required]],
        phone: ['', Validators.required],
        city: ['', Validators.required],
        shippingAddress: ['', Validators.required],
        paymentMethod: ['debit_card' as PaymentMethod, Validators.required],
    })

    constructor() {
        effect(() => {
            const user = this.auth.currentUser()
            if (!user) return
            this.form.patchValue({
                fullName: user.fullName ?? '',
                phone: user.phone ?? '',
                city: user.city ?? '',
                shippingAddress: user.shippingAddress ?? '',
            })
        })
    }

    onSubmit(): void {
        if (this.form.invalid) {
            this.form.markAllAsTouched()
            return
        }

        const value = this.form.getRawValue()
        this.submitting.set(true)

        if (value.paymentMethod === 'cash_on_delivery') {
            this.ordersApi.createCodOrder(value).subscribe({
                next: () => {
                    this.cartStore.load()
                    this.router.navigate(['/order-success'])
                },
                complete: () => this.submitting.set(false),
            })
        }
        else {
            this.ordersApi.createStripeSession(value).subscribe({
                next: ({ url }) => {
                    globalThis.window.location.href = url  // уходим на страницу Stripe
                },
                complete: () => this.submitting.set(false),
            })
        }
    }
}