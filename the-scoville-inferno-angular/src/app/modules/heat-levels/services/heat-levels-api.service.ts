import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { environment } from "../../../../environments/environment";
import { GetHeatLevelsResponse } from "../types/heat-levels.types";

@Injectable({
  providedIn: 'root'
})
export class HeatLevelsApiService {
  private readonly http = inject(HttpClient)

  getHeatLevels() {
    return this.http.get<GetHeatLevelsResponse>(`${environment.apiUrl}/heat-levels`)
  }
}