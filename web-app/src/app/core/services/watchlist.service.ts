import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { AuthService } from './auth.service';
import { WatchlistItem, ApiResponse } from '../models/media.models';

@Injectable({
  providedIn: 'root'
})
export class WatchlistService {
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

  getWatchlist(): Observable<ApiResponse<WatchlistItem[]>> {
    return this.http.get<ApiResponse<WatchlistItem[]>>(
      `${this.apiUrl}watchlist`,
      { headers: this.getAuthHeaders() }
    );
  }

  addToWatchlist(mediaId: number): Observable<ApiResponse<WatchlistItem>> {
    return this.http.post<ApiResponse<WatchlistItem>>(
      `${this.apiUrl}watchlist`,
      { media_id: mediaId },
      { headers: this.getAuthHeaders() }
    );
  }

  removeFromWatchlist(watchlistId: number): Observable<ApiResponse<null>> {
    return this.http.delete<ApiResponse<null>>(
      `${this.apiUrl}watchlist/${watchlistId}`,
      { headers: this.getAuthHeaders() }
    );
  }
}
