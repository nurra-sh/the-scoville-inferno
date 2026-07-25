import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { environment } from "../../../../environments/environment";
import { GetBrandsResponse } from "../types/brands.types";

@Injectable({
  providedIn: 'root'
})
export class BrandsApiService {
  private readonly http = inject(HttpClient)

  getBrands() {
    return this.http.get<GetBrandsResponse>(`${environment.apiUrl}/brands`)
  }
}