import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { environment } from "../../../../environments/environment";
import { AddToCartBody, GetCartResponse, UpdateCartItemBody } from "../types/cart.types";

@Injectable({
    providedIn: 'root',
})
export class CartApiService {
    private readonly http = inject(HttpClient)
    private readonly baseUrl = `${environment.apiUrl}/cart`

    getCart() {
        return this.http.get<GetCartResponse>(this.baseUrl)
    }

    addToCart(body: AddToCartBody) {
        return this.http.post<GetCartResponse>(this.baseUrl, body)
    }

    updateItem(id: number, body: UpdateCartItemBody) {
        return this.http.patch<GetCartResponse>(`${this.baseUrl}/${id}`, body)
    }

    removeItem(id: number) {
        return this.http.delete<GetCartResponse>(`${this.baseUrl}/${id}`)
    }

    clear() {
        return this.http.delete<GetCartResponse>(`${this.baseUrl}/clear`)
    }
}