import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { WatchlistService } from '../core/services/watchlist.service';
import { WatchlistStore } from '../core/stores/watchlist.store';
import { WatchlistItem } from '../core/models/media.models';
import { MediaCardComponent } from '../browse/media-card/media-card.component';

@Component({
  selector: 'app-watchlist',
  standalone: true,
  imports: [CommonModule, RouterModule, MatButtonModule, MatIconModule, MatSnackBarModule, MatProgressSpinnerModule, MediaCardComponent],
  templateUrl: './watchlist.component.html',
  styleUrl: './watchlist.component.scss',
})
export class WatchlistComponent implements OnInit {
  private watchlistService = inject(WatchlistService);
  private watchlistStore = inject(WatchlistStore);
  private snackBar = inject(MatSnackBar);

  items = this.watchlistStore.items;
  loading = false;

  ngOnInit(): void {
    this.loadWatchlist();
  }

  loadWatchlist(): void {
    this.loading = true;
    this.watchlistService.getWatchlist().subscribe({
      next: (res) => {
        this.watchlistStore.setItems(res.results);
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      },
    });
  }

  removeItem(item: WatchlistItem): void {
    this.watchlistService.removeFromWatchlist(item.watchlist_id).subscribe({
      next: () => {
        this.watchlistStore.removeItem(item.watchlist_id);
        this.snackBar.open('Removed from watchlist', 'Close', { duration: 3000 });
      },
    });
  }
}
