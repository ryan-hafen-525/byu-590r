import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MediaService } from '../core/services/media.service';
import { WatchlistService } from '../core/services/watchlist.service';
import { GenreService } from '../core/services/genre.service';
import { MediaStore } from '../core/stores/media.store';
import { WatchlistStore } from '../core/stores/watchlist.store';
import { GenreStore } from '../core/stores/genre.store';
import { UserStore } from '../core/stores/user.store';
import { Media } from '../core/models/media.models';
import { ReviewSectionComponent } from './review-section/review-section.component';
import { MediaFormComponent } from '../media-form/media-form.component';

@Component({
  selector: 'app-media-detail',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatDialogModule,
    MatSnackBarModule,
    MatProgressSpinnerModule,
    ReviewSectionComponent,
  ],
  templateUrl: './media-detail.component.html',
  styleUrl: './media-detail.component.scss',
})
export class MediaDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private mediaService = inject(MediaService);
  private watchlistService = inject(WatchlistService);
  private genreService = inject(GenreService);
  private mediaStore = inject(MediaStore);
  private watchlistStore = inject(WatchlistStore);
  private genreStore = inject(GenreStore);
  private userStore = inject(UserStore);
  private dialog = inject(MatDialog);
  private snackBar = inject(MatSnackBar);

  media = signal<Media | null>(null);
  loading = signal(true);

  get currentUserId(): number | null {
    return this.userStore.user()?.id ?? null;
  }

  get isOnWatchlist(): boolean {
    const m = this.media();
    if (!m) return false;
    return this.watchlistStore.mediaIds().includes(m.media_id);
  }

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.loadMedia(id);
    this.loadWatchlist();
    if (this.genreStore.genres().length === 0) {
      this.genreService.getGenres().subscribe({
        next: (res) => this.genreStore.setGenres(res.results),
      });
    }
  }

  loadMedia(id: number): void {
    this.loading.set(true);
    this.mediaService.getMediaById(id).subscribe({
      next: (response) => {
        this.media.set(response.results);
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
        this.router.navigate(['/browse']);
      },
    });
  }

  loadWatchlist(): void {
    if (this.watchlistStore.items().length === 0) {
      this.watchlistService.getWatchlist().subscribe({
        next: (res) => this.watchlistStore.setItems(res.results),
      });
    }
  }

  toggleWatchlist(): void {
    const m = this.media();
    if (!m) return;

    if (this.isOnWatchlist) {
      const item = this.watchlistStore.items().find(w => w.media_id === m.media_id);
      if (item) {
        this.watchlistService.removeFromWatchlist(item.watchlist_id).subscribe({
          next: () => {
            this.watchlistStore.removeItem(item.watchlist_id);
            this.snackBar.open('Removed from watchlist', 'Close', { duration: 3000 });
          },
        });
      }
    } else {
      this.watchlistService.addToWatchlist(m.media_id).subscribe({
        next: (res) => {
          this.watchlistStore.addItem(res.results);
          this.snackBar.open('Added to watchlist', 'Close', { duration: 3000 });
        },
      });
    }
  }

  openEditDialog(): void {
    const m = this.media();
    if (!m) return;

    const dialogRef = this.dialog.open(MediaFormComponent, {
      width: '600px',
      data: { media: m, genres: this.genreStore.genres() },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.mediaService.updateMedia(m.media_id, result).subscribe({
          next: (response) => {
            this.media.set(response.results);
            this.mediaStore.updateMedia(response.results);
            this.snackBar.open('Media updated', 'Close', { duration: 3000 });
          },
          error: () => {
            this.snackBar.open('Failed to update media', 'Close', { duration: 3000 });
          },
        });
      }
    });
  }

  deleteMedia(): void {
    const m = this.media();
    if (!m) return;

    if (confirm(`Delete "${m.title}"?`)) {
      this.mediaService.deleteMedia(m.media_id).subscribe({
        next: () => {
          this.mediaStore.removeMedia(m.media_id);
          this.snackBar.open('Media deleted', 'Close', { duration: 3000 });
          this.router.navigate(['/browse']);
        },
      });
    }
  }

  goBack(): void {
    this.router.navigate(['/browse']);
  }
}
