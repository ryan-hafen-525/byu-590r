import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { Media } from '../../core/models/media.models';

@Component({
  selector: 'app-media-card',
  standalone: true,
  imports: [CommonModule, RouterModule, MatCardModule, MatChipsModule, MatIconModule],
  templateUrl: './media-card.component.html',
  styleUrl: './media-card.component.scss',
})
export class MediaCardComponent {
  @Input({ required: true }) media!: Media;

  get typeBadge(): string {
    return this.media.media_type === 'tv_show' ? 'TV Show' : 'Movie';
  }

  get ratingStars(): number[] {
    const avg = this.media.avg_rating || 0;
    return [1, 2, 3, 4, 5].map(i => i <= Math.round(avg) ? 1 : 0);
  }
}
