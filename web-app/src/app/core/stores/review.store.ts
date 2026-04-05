import { computed } from '@angular/core';
import {
  signalStore,
  withState,
  withComputed,
  withMethods,
  patchState,
} from '@ngrx/signals';
import { Review } from '../models/media.models';

export interface ReviewState {
  reviewList: Review[];
}

const initialState: ReviewState = {
  reviewList: [],
};

export const ReviewStore = signalStore(
  { providedIn: 'root' },
  withState<ReviewState>(initialState),
  withComputed(({ reviewList }) => ({
    reviews: computed(() => reviewList()),
  })),
  withMethods((store) => ({
    setReviews(reviews: Review[]): void {
      patchState(store, { reviewList: reviews });
    },
    addOrUpdateReview(review: Review): void {
      const existing = store.reviewList().find(r => r.review_id === review.review_id);
      if (existing) {
        patchState(store, {
          reviewList: store.reviewList().map(r => r.review_id === review.review_id ? review : r),
        });
      } else {
        patchState(store, { reviewList: [review, ...store.reviewList()] });
      }
    },
    removeReview(id: number): void {
      patchState(store, {
        reviewList: store.reviewList().filter(r => r.review_id !== id),
      });
    },
  }))
);
