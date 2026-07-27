import { computed, effect, inject, Injectable, signal } from "@angular/core";
import { CartItem, CartSummary, GetCartResponse } from "../types/cart.types";
import { Auth } from "../../auth/services/auth";
import { CartApiService } from "../services/cart-api.service";
import { MessageService } from "primeng/api";
import { finalize } from "rxjs";
import { APP_TOAST_KEY } from "../../../core/constants/toats.constants";

const EMPTY_SUMMARY: CartSummary = {
    totalItems: 0,
    totalQuantity: 0,
    subtotal: 0,
}

@Injectable({
    providedIn: 'root',
})
export class CartStore {
    private readonly cartApi = inject(CartApiService)
    private readonly auth = inject(Auth)
    private readonly messageService = inject(MessageService)

    private readonly itemsSignal = signal<CartItem[]>([])
    private readonly summarySignal = signal<CartSummary>(EMPTY_SUMMARY)
    private readonly loadingSignal = signal<boolean>(false)
    private readonly mutatingSignal = signal<boolean>(false)

    readonly items = this.itemsSignal.asReadonly()
    readonly summary = this.summarySignal.asReadonly()
    readonly loading = this.loadingSignal.asReadonly()
    readonly mutating = this.mutatingSignal.asReadonly()

    readonly totalQuantity = computed(() => this.summarySignal().totalQuantity)
    readonly isEmpty = computed(() => this.itemsSignal().length === 0)

    constructor() {
        effect(() => {
            if (this.auth.isAuthenticated()) {
                this.load()
            } else {
                this.reset()
            }
        })
    }

    getCartItem(productId: number) {
        return (this.items() ?? []).find(i => i.productId === productId)
    }

    load() {
        this.loadingSignal.set(true)
        this.cartApi
            .getCart()
            .pipe(finalize(() => this.loadingSignal.set(false)))
            .subscribe((response) => this.setCart(response))
    }

    add(productId: number, quantity = 1) {
        this.mutatingSignal.set(true)
        this.cartApi
            .addToCart({ productId, quantity })
            .pipe(finalize(() => this.mutatingSignal.set(false)))
            .subscribe((response) => {
                this.setCart(response)
                this.messageService.add({
                    key: APP_TOAST_KEY,
                    severity: 'success',
                    summary: 'В корзине',
                    detail: 'Товар добавлен в корзину',
                })
            })
    }

    updateQuantity(id: number, quantity: number) {
        this.mutatingSignal.set(true)
        this.cartApi
            .updateItem(id, { quantity })
            .pipe(finalize(() => this.mutatingSignal.set(false)))
            .subscribe((response) => this.setCart(response))
    }

    remove(id: number) {
        this.mutatingSignal.set(true)
        this.cartApi
            .removeItem(id)
            .pipe(finalize(() => this.mutatingSignal.set(false)))
            .subscribe((response) => {
                this.setCart(response)
                this.messageService.add({
                    key: APP_TOAST_KEY,
                    severity: 'info',
                    summary: 'Корзина',
                    detail: 'Товар удалён из корзины',
                })
            })
    }

    clear() {
        this.mutatingSignal.set(true)
        this.cartApi
            .clear()
            .pipe(finalize(() => this.mutatingSignal.set(false)))
            .subscribe((response) => {
                this.setCart(response)
                this.messageService.add({
                    key: APP_TOAST_KEY,
                    severity: 'info',
                    summary: 'Корзина',
                    detail: 'Корзина очищена',
                })
            })
    }

    private setCart(response: GetCartResponse) {
        this.itemsSignal.set(response.data)
        this.summarySignal.set(response.summary)
    }

    private reset() {
        this.itemsSignal.set([])
        this.summarySignal.set(EMPTY_SUMMARY)
    }
}