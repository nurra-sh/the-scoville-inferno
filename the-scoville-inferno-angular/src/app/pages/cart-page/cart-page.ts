import { ChangeDetectionStrategy, Component, inject } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { Router, RouterLink } from "@angular/router";
import { ButtonModule } from "primeng/button";
import { CardModule } from "primeng/card";
import { DividerModule } from "primeng/divider";
import { InputNumberModule } from "primeng/inputnumber";
import { SkeletonModule } from "primeng/skeleton";
import { TagModule } from "primeng/tag";
import { CartStore } from "../../modules/cart/store/cart-store";
import { CartItem } from "../../modules/cart/types/cart.types";
import { environment } from "../../../environments/environment";

@Component({
    selector: 'app-cart-page',
    imports: [
        FormsModule,
        RouterLink,
        ButtonModule,
        CardModule,
        DividerModule,
        InputNumberModule,
        SkeletonModule,
        TagModule,
    ],
    templateUrl: './cart-page.html',
    styleUrl: './cart-page.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CartPage {
    private readonly cartStore = inject(CartStore)
    private readonly router = inject(Router)

    readonly items = this.cartStore.items
    readonly summary = this.cartStore.summary
    readonly loading = this.cartStore.loading
    readonly mutating = this.cartStore.mutating
    readonly isEmpty = this.cartStore.isEmpty

    readonly skeletons = [1, 2, 3]

    onQuantityChange(item: CartItem, quantity: number | null) {
        if (quantity === null || quantity < 1 || quantity === item.quantity) {
            return
        }
        this.cartStore.updateQuantity(item.id, quantity)
    }

    removeItem(item: CartItem) {
        this.cartStore.remove(item.id)
    }

    clearCart() {
        this.cartStore.clear()
    }

    checkout() {
        this.router.navigate(['/checkout'])
    }

    lineTotal(item: CartItem): number {
        return Number(item.product.price) * item.quantity
    }

    formatPrice(value: number): string {
        return value.toFixed(2)
    }

    tagLabel(item: CartItem): string {
        return item.product.heatLevel?.name ?? item.product.category.name
    }

    generatePublicImageUrl(imageUrl: string) {
        return `${environment.baseApiUrl}${imageUrl}`
    }
}