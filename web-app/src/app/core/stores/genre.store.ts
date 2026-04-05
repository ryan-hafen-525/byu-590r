import { computed } from '@angular/core';
import {
  signalStore,
  withState,
  withComputed,
  withMethods,
  patchState,
} from '@ngrx/signals';
import { Genre } from '../models/media.models';

export interface GenreState {
  genreList: Genre[];
}

const initialState: GenreState = {
  genreList: [],
};

export const GenreStore = signalStore(
  { providedIn: 'root' },
  withState<GenreState>(initialState),
  withComputed(({ genreList }) => ({
    genres: computed(() => genreList()),
  })),
  withMethods((store) => ({
    setGenres(genres: Genre[]): void {
      patchState(store, { genreList: genres });
    },
  }))
);
