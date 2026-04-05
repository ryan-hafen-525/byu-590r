import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { AuthService } from './auth.service';
import { Genre, ApiResponse } from '../models/media.models';

@Injectable({
  providedIn: 'root'
})
export class GenreService {
  private http = inject(HttpClient);
  private authService = inject(AuthService);
  private apiUrl = environment.apiUrl;

  private getAuthHeaders(): { [key: string]: string } {
    const user = this.authService.getStoredUser();
    if (user && user.token) {
      return { Authorization: `Bearer ${user.token}` };
    }
    return {};
  }

  getGenres(): Observable<ApiResponse<Genre[]>> {
    return this.http.get<ApiResponse<Genre[]>>(
      `${this.apiUrl}genres`,
      { headers: this.getAuthHeaders() }
    );
  }
}
