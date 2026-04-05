import { computed } from '@angular/core';
import {
  signalStore,
  withState,
  withComputed,
  withMethods,
  patchState,
} from '@ngrx/signals';
import { WatchlistItem } from '../models/media.models';

export interface WatchlistState {
  watchlistItems: WatchlistItem[];
}

const initialState: WatchlistState = {
  watchlistItems: [],
};

export const WatchlistStore = signalStore(
  { providedIn: 'root' },
  withState<WatchlistState>(initialState),
  withComputed(({ watchlistItems }) => ({
    items: computed(() => watchlistItems()),
    mediaIds: computed(() => watchlistItems().map(w => w.media_id)),
  })),
  withMethods((store) => ({
    setItems(items: WatchlistItem[]): void {
      patchState(store, { watchlistItems: items });
    },
    addItem(item: WatchlistItem): void {
      patchState(store, { watchlistItems: [...store.watchlistItems(), item] });
    },
    removeItem(id: number): void {
      patchState(store, {
        watchlistItems: store.watchlistItems().filter(w => w.watchlist_id !== id),
      });
    },
    removeByMediaId(mediaId: number): void {
      patchState(store, {
        watchlistItems: store.watchlistItems().filter(w => w.media_id !== mediaId),
      });
    },
  }))
);
