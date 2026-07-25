import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { environment } from "../../../../environments/environment";
import { GetCategoriesResponse } from "../types/categories.types";

@Injectable({
  providedIn: 'root'
})
export class CategoriesApiService {
  private readonly http = inject(HttpClient)

  getCategories() {
    return this.http.get<GetCategoriesResponse>(`${environment.apiUrl}/categories`)
  }
}