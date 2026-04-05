import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Review } from '../../core/models/media.models';

export interface ReviewDialogData {
  existingReview?: Review;
}

export interface ReviewDialogResult {
  rating: number;
  review_text: string;
}

@Component({
  selector: 'app-review-dialog',
  standalone: true,
  imports: [CommonModule, FormsModule, MatDialogModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatIconModule],
  templateUrl: './review-dialog.component.html',
  styleUrl: './review-dialog.component.scss',
})
export class ReviewDialogComponent {
  private dialogRef = inject(MatDialogRef<ReviewDialogComponent>);
  data: ReviewDialogData = inject(MAT_DIALOG_DATA, { optional: true }) || {};

  rating = signal(this.data.existingReview?.rating || 0);
  reviewText = signal(this.data.existingReview?.review_text || '');
  hoverRating = signal(0);

  stars = [1, 2, 3, 4, 5];

  setRating(value: number): void {
    this.rating.set(value);
  }

  onSubmit(): void {
    if (this.rating() < 1) return;
    this.dialogRef.close({
      rating: this.rating(),
      review_text: this.reviewText(),
    } as ReviewDialogResult);
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
