import { Component, Input, inject, OnChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { ReviewService } from '../../core/services/review.service';
import { ReviewStore } from '../../core/stores/review.store';
import { Review } from '../../core/models/media.models';
import { ReviewDialogComponent, ReviewDialogResult } from '../review-dialog/review-dialog.component';

@Component({
  selector: 'app-review-section',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatIconModule, MatDialogModule, MatSnackBarModule],
  templateUrl: './review-section.component.html',
  styleUrl: './review-section.component.scss',
})
export class ReviewSectionComponent implements OnChanges {
  @Input({ required: true }) mediaId!: number;
  @Input() currentUserId: number | null = null;

  private reviewService = inject(ReviewService);
  private reviewStore = inject(ReviewStore);
  private dialog = inject(MatDialog);
  private snackBar = inject(MatSnackBar);

  reviews = this.reviewStore.reviews;

  ngOnChanges(): void {
    this.loadReviews();
  }

  loadReviews(): void {
    this.reviewService.getReviews(this.mediaId).subscribe({
      next: (response) => this.reviewStore.setReviews(response.results),
    });
  }

  get userReview(): Review | undefined {
    if (!this.currentUserId) return undefined;
    return this.reviews().find(r => r.user_id === this.currentUserId);
  }

  openReviewDialog(): void {
    const dialogRef = this.dialog.open(ReviewDialogComponent, {
      width: '500px',
      data: { existingReview: this.userReview },
    });

    dialogRef.afterClosed().subscribe((result: ReviewDialogResult | undefined) => {
      if (result) {
        this.reviewService.saveReview(this.mediaId, result.rating, result.review_text).subscribe({
          next: (response) => {
            this.reviewStore.addOrUpdateReview(response.results);
            this.snackBar.open('Review saved', 'Close', { duration: 3000 });
          },
          error: () => {
            this.snackBar.open('Failed to save review', 'Close', { duration: 3000 });
          },
        });
      }
    });
  }

  deleteReview(review: Review): void {
    if (confirm('Delete your review?')) {
      this.reviewService.deleteReview(review.review_id).subscribe({
        next: () => {
          this.reviewStore.removeReview(review.review_id);
          this.snackBar.open('Review deleted', 'Close', { duration: 3000 });
        },
      });
    }
  }

  getStars(rating: number): number[] {
    return [1, 2, 3, 4, 5].map(i => i <= rating ? 1 : 0);
  }
}
