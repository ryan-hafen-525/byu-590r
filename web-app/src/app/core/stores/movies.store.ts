import { computed } from '@angular/core';
import {
  signalStore,
  withState,
  withComputed,
  withMethods,
  patchState,
} from '@ngrx/signals';
import { Movie } from '../services/movies.service';

export interface MoviesState {
  moviesList: Movie[];
}

const initialState: MoviesState = {
  moviesList: [],
};

export const MoviesStore = signalStore(
  { providedIn: 'root' },
  withState<MoviesState>(initialState),
  withComputed(({ moviesList }) => ({
    movies: computed(() => moviesList()),
  })),
  withMethods((store) => ({
    setMovies(movies: Movie[]): void {
      patchState(store, {
        moviesList: movies,
      });
    },
  }))
);
