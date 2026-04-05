import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { AuthService } from './auth.service';
import { Review, ApiResponse } from '../models/media.models';

@Injectable({
  providedIn: 'root'
})
export class ReviewService {
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

  getReviews(mediaId: number): Observable<ApiResponse<Review[]>> {
    return this.http.get<ApiResponse<Review[]>>(
      `${this.apiUrl}media/${mediaId}/reviews`,
      { headers: this.getAuthHeaders() }
    );
  }

  saveReview(mediaId: number, rating: number, reviewText?: string): Observable<ApiResponse<Review>> {
    return this.http.post<ApiResponse<Review>>(
      `${this.apiUrl}media/${mediaId}/reviews`,
      { rating, review_text: reviewText },
      { headers: this.getAuthHeaders() }
    );
  }

  deleteReview(reviewId: number): Observable<ApiResponse<null>> {
    return this.http.delete<ApiResponse<null>>(
      `${this.apiUrl}reviews/${reviewId}`,
      { headers: this.getAuthHeaders() }
    );
  }
}
