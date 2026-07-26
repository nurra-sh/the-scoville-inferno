import { HttpClient, HttpParams } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { AdminProductsFilters, CreateProductBody, GetProductResponse, GetProductsResponse, MutateProductResponse, ProductsFilters, UpdateProductBody, UploadImageResponse } from "../types/products.types";
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

  // ADMIN
  adminGetProducts(filters: AdminProductsFilters = {}) {
    let params = new HttpParams()

    for (const [key, value] of Object.entries(filters)) {
      if (value !== undefined && value !== null && value !== '') {
        params = params.set(key, String(value))
      }
    }

    return this.http.get<GetProductsResponse>(`${environment.adminApiUrl}/products`, { params })
  }
  adminGetProduct(id: string) {
    return this.http.get<GetProductResponse>(`${environment.adminApiUrl}/products/${id}`)
  }

  createProduct(body: CreateProductBody) {
    return this.http.post<MutateProductResponse>(`${environment.adminApiUrl}/products`, body)
  }

  deleteProduct(id: number) {
    return this.http.delete<MutateProductResponse>(`${environment.adminApiUrl}/products/${id}`)
  }

  updateProduct(id: number, body: UpdateProductBody) {
    return this.http.patch<MutateProductResponse>(`${environment.adminApiUrl}/products/${id}`, body)
  }
  uploadProductImage(file: File) {
    const formData = new FormData()
    formData.append('image', file)

    return this.http.post<UploadImageResponse>(`${environment.adminApiUrl}/products/upload-image`, formData)
  }
}