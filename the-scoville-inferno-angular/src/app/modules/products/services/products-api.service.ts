import { HttpClient, HttpParams } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { GetProductResponse, GetProductsResponse, ProductsFilters } from "../types/products.types";
import { environment } from "../../../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class ProductsApiService {
  private readonly http = inject(HttpClient)

  getProducts(filters: ProductsFilters = {}) {
    let params = new HttpParams()

    for (const [key, value] of Object.entries(filters)) {
      if (value !== undefined && value !== null && value !== '') {
        params = params.set(key, String(value))
      }
    }

    return this.http.get<GetProductsResponse>(`${environment.apiUrl}/products`, { params })
  }

  getProductDetails(id: string) {
    return this.http.get<GetProductResponse>(`${environment.apiUrl}/products/${id}`)
  }
}