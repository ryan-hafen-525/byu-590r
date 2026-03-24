import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { AuthService } from './auth.service';

export interface Movie {
  id: number;
  name: string;
  description: string;
  movie_picture: string;
}

@Injectable({
  providedIn: 'root'
})
export class MoviesService {
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

  getMovies(): Observable<{ success: boolean; results: Movie[]; message: string }> {
    return this.http.get<{ success: boolean; results: Movie[]; message: string }>(
      `${this.apiUrl}movies`,
      { headers: this.getAuthHeaders() }
    );
  }
}
