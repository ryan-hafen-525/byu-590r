export interface Media {
  media_id: number;
  title: string;
  synopsis: string | null;
  poster_url: string | null;
  media_type: 'movie' | 'tv_show';
  created_at: string;
  updated_at: string;
  movie?: MovieDetail | null;
  genres?: Genre[];
  seasons?: Season[];
  reviews?: Review[];
  avg_rating?: number | null;
}

export interface MovieDetail {
  movie_id: number;
  media_id: number;
  release_date: string | null;
  runtime_minutes: number | null;
}

export interface Genre {
  genre_id: number;
  genre_name: string;
}

export interface Review {
  review_id: number;
  media_id: number;
  user_id: number;
  rating: number;
  review_text: string | null;
  created_at: string;
  updated_at: string;
  user?: { id: number; name: string; avatar?: string | null };
}

export interface WatchlistItem {
  watchlist_id: number;
  media_id: number;
  user_id: number;
  added_at: string;
  media?: Media;
}

export interface Season {
  season_id: number;
  media_id: number;
  season_number: number;
  episodes?: Episode[];
}

export interface Episode {
  episode_id: number;
  season_id: number;
  episode_number: number;
  title: string;
  runtime_minutes: number | null;
}

export interface ApiResponse<T> {
  success: boolean;
  results: T;
  message: string;
}
