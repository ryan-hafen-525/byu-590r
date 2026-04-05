import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { AuthService } from './auth.service';
import { Season, ApiResponse } from '../models/media.models';

@Injectable({
  providedIn: 'root'
})
export class SeasonService {
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

  getSeasons(mediaId: number): Observable<ApiResponse<Season[]>> {
    return this.http.get<ApiResponse<Season[]>>(
      `${this.apiUrl}media/${mediaId}/seasons`,
      { headers: this.getAuthHeaders() }
    );
  }

  createSeason(mediaId: number, seasonNumber: number): Observable<ApiResponse<Season>> {
    return this.http.post<ApiResponse<Season>>(
      `${this.apiUrl}media/${mediaId}/seasons`,
      { season_number: seasonNumber },
      { headers: this.getAuthHeaders() }
    );
  }

  updateSeason(seasonId: number, seasonNumber: number): Observable<ApiResponse<Season>> {
    return this.http.put<ApiResponse<Season>>(
      `${this.apiUrl}seasons/${seasonId}`,
      { season_number: seasonNumber },
      { headers: this.getAuthHeaders() }
    );
  }

  deleteSeason(seasonId: number): Observable<ApiResponse<null>> {
    return this.http.delete<ApiResponse<null>>(
      `${this.apiUrl}seasons/${seasonId}`,
      { headers: this.getAuthHeaders() }
    );
  }
}
