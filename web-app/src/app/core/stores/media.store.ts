import { computed } from '@angular/core';
import {
  signalStore,
  withState,
  withComputed,
  withMethods,
  patchState,
} from '@ngrx/signals';
import { Media } from '../models/media.models';

export interface MediaState {
  mediaList: Media[];
  selectedMedia: Media | null;
  loading: boolean;
}

const initialState: MediaState = {
  mediaList: [],
  selectedMedia: null,
  loading: false,
};

export const MediaStore = signalStore(
  { providedIn: 'root' },
  withState<MediaState>(initialState),
  withComputed(({ mediaList }) => ({
    media: computed(() => mediaList()),
  })),
  withMethods((store) => ({
    setMedia(media: Media[]): void {
      patchState(store, { mediaList: media });
    },
    addMedia(item: Media): void {
      patchState(store, { mediaList: [...store.mediaList(), item] });
    },
    updateMedia(item: Media): void {
      patchState(store, {
        mediaList: store.mediaList().map((m) => (m.media_id === item.media_id ? item : m)),
        selectedMedia: store.selectedMedia()?.media_id === item.media_id ? item : store.selectedMedia(),
      });
    },
    removeMedia(id: number): void {
      patchState(store, {
        mediaList: store.mediaList().filter((m) => m.media_id !== id),
      });
    },
    setSelectedMedia(media: Media | null): void {
      patchState(store, { selectedMedia: media });
    },
    setLoading(loading: boolean): void {
      patchState(store, { loading });
    },
  }))
);
