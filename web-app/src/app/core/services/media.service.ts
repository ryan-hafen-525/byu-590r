import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { AuthService } from './auth.service';
import { Media, ApiResponse } from '../models/media.models';

@Injectable({
  providedIn: 'root'
})
export class MediaService {
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

  getMedia(params?: { type?: string; genre?: number; search?: string }): Observable<ApiResponse<Media[]>> {
    let url = `${this.apiUrl}media`;
    const queryParts: string[] = [];
    if (params?.type) queryParts.push(`type=${params.type}`);
    if (params?.genre) queryParts.push(`genre=${params.genre}`);
    if (params?.search) queryParts.push(`search=${encodeURIComponent(params.search)}`);
    if (queryParts.length) url += '?' + queryParts.join('&');

    return this.http.get<ApiResponse<Media[]>>(url, { headers: this.getAuthHeaders() });
  }

  getMediaById(id: number): Observable<ApiResponse<Media>> {
    return this.http.get<ApiResponse<Media>>(
      `${this.apiUrl}media/${id}`,
      { headers: this.getAuthHeaders() }
    );
  }

  createMedia(data: {
    title: string;
    synopsis?: string;
    media_type: string;
    genre_ids?: number[];
    release_date?: string;
    runtime_minutes?: number;
    image?: File;
  }): Observable<ApiResponse<Media>> {
    const formData = new FormData();
    formData.append('title', data.title);
    if (data.synopsis) formData.append('synopsis', data.synopsis);
    formData.append('media_type', data.media_type);
    if (data.genre_ids) {
      data.genre_ids.forEach(id => formData.append('genre_ids[]', id.toString()));
    }
    if (data.release_date) formData.append('release_date', data.release_date);
    if (data.runtime_minutes) formData.append('runtime_minutes', data.runtime_minutes.toString());
    if (data.image) formData.append('image', data.image);

    return this.http.post<ApiResponse<Media>>(
      `${this.apiUrl}media`,
      formData,
      { headers: this.getAuthHeaders() }
    );
  }

  updateMedia(id: number, data: {
    title?: string;
    synopsis?: string;
    genre_ids?: number[];
    release_date?: string;
    runtime_minutes?: number;
    image?: File;
  }): Observable<ApiResponse<Media>> {
    const formData = new FormData();
    formData.append('_method', 'PUT');
    if (data.title) formData.append('title', data.title);
    if (data.synopsis !== undefined) formData.append('synopsis', data.synopsis || '');
    if (data.genre_ids) {
      data.genre_ids.forEach(gid => formData.append('genre_ids[]', gid.toString()));
    }
    if (data.release_date) formData.append('release_date', data.release_date);
    if (data.runtime_minutes) formData.append('runtime_minutes', data.runtime_minutes.toString());
    if (data.image) formData.append('image', data.image);

    return this.http.post<ApiResponse<Media>>(
      `${this.apiUrl}media/${id}`,
      formData,
      { headers: this.getAuthHeaders() }
    );
  }

  generateSynopsis(title: string, mediaType: string): Observable<ApiResponse<{ synopsis: string }>> {
    return this.http.post<ApiResponse<{ synopsis: string }>>(
      `${this.apiUrl}media/generate-synopsis`,
      { title, media_type: mediaType },
      { headers: this.getAuthHeaders() }
    );
  }

  deleteMedia(id: number): Observable<ApiResponse<null>> {
    return this.http.delete<ApiResponse<null>>(
      `${this.apiUrl}media/${id}`,
      { headers: this.getAuthHeaders() }
    );
  }
}
