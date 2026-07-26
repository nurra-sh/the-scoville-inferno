import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { Auth } from "../../auth/services/auth";
import { MessageService } from "primeng/api";
import { UpdateProfileBody, UpdateProfileResponse } from "../types/users.types";
import { environment } from "../../../../environments/environment";
import { tap } from "rxjs";

@Injectable({ providedIn: 'root' })
export class UsersApiService {
  private readonly http = inject(HttpClient)
  private readonly authService = inject(Auth)
  private readonly messageService = inject(MessageService)

  updateProfile(body: UpdateProfileBody) {
    return this.http.patch<UpdateProfileResponse>(`${environment.apiUrl}/profile`, body).pipe(
      tap((response) => {
        this.authService.setCurrentUser(response.user)
        this.messageService.add({ key: 'app', severity: 'success', summary: 'Success', detail: response.message || 'Profile updated' })
      })
    )
  }
}