import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { AuthService } from './auth.service';
import { Episode, ApiResponse } from '../models/media.models';

@Injectable({
  providedIn: 'root'
})
export class EpisodeService {
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

  getEpisodes(seasonId: number): Observable<ApiResponse<Episode[]>> {
    return this.http.get<ApiResponse<Episode[]>>(
      `${this.apiUrl}seasons/${seasonId}/episodes`,
      { headers: this.getAuthHeaders() }
    );
  }

  createEpisode(seasonId: number, data: { episode_number: number; title: string; runtime_minutes?: number }): Observable<ApiResponse<Episode>> {
    return this.http.post<ApiResponse<Episode>>(
      `${this.apiUrl}seasons/${seasonId}/episodes`,
      data,
      { headers: this.getAuthHeaders() }
    );
  }

  updateEpisode(episodeId: number, data: { episode_number?: number; title?: string; runtime_minutes?: number }): Observable<ApiResponse<Episode>> {
    return this.http.put<ApiResponse<Episode>>(
      `${this.apiUrl}episodes/${episodeId}`,
      data,
      { headers: this.getAuthHeaders() }
    );
  }

  deleteEpisode(episodeId: number): Observable<ApiResponse<null>> {
    return this.http.delete<ApiResponse<null>>(
      `${this.apiUrl}episodes/${episodeId}`,
      { headers: this.getAuthHeaders() }
    );
  }
}
