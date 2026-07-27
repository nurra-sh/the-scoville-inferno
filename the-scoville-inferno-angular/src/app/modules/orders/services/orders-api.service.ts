import { HttpClient } from "@angular/common/http"
import { inject, Injectable } from "@angular/core"
import { CheckoutFormValue, CreateCodOrderResponse, CreateStripeSessionResponse, HandleWebhookResponse, Order } from "../types/orders.types"
import { Observable } from "rxjs"
import { environment } from "../../../../environments/environment"

@Injectable({ providedIn: 'root' })
export class OrdersApiService {
  private readonly http = inject(HttpClient)

  createStripeSession(body: CheckoutFormValue): Observable<CreateStripeSessionResponse> {
    return this.http.post<CreateStripeSessionResponse>(
      `${environment.apiUrl}/orders/checkout-session`,
      body
    )
  }

  createCodOrder(body: CheckoutFormValue): Observable<CreateCodOrderResponse> {
    return this.http.post<CreateCodOrderResponse>(`${environment.apiUrl}/orders/cod`, body)
  }

  getOrders(): Observable<Order[]> {
    return this.http.get<Order[]>(`${environment.apiUrl}/orders`)
  }
}