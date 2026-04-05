import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MediaService } from '../core/services/media.service';
import { GenreService } from '../core/services/genre.service';
import { MediaStore } from '../core/stores/media.store';
import { GenreStore } from '../core/stores/genre.store';
import { MediaCardComponent } from './media-card/media-card.component';
import { MediaFormComponent } from '../media-form/media-form.component';

@Component({
  selector: 'app-browse',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    MatSnackBarModule,
    MatProgressSpinnerModule,
    MediaCardComponent,
  ],
  templateUrl: './browse.component.html',
  styleUrl: './browse.component.scss',
})
export class BrowseComponent implements OnInit {
  private mediaService = inject(MediaService);
  private genreService = inject(GenreService);
  private mediaStore = inject(MediaStore);
  private genreStore = inject(GenreStore);
  private dialog = inject(MatDialog);
  private snackBar = inject(MatSnackBar);

  media = this.mediaStore.media;
  genres = this.genreStore.genres;
  loading = this.mediaStore.loading;

  searchQuery = signal('');
  selectedType = signal('');
  selectedGenre = signal<number | null>(null);

  ngOnInit(): void {
    this.loadGenres();
    this.loadMedia();
  }

  loadGenres(): void {
    if (this.genres().length === 0) {
      this.genreService.getGenres().subscribe({
        next: (response) => this.genreStore.setGenres(response.results),
      });
    }
  }

  loadMedia(): void {
    this.mediaStore.setLoading(true);
    const params: { type?: string; genre?: number; search?: string } = {};
    if (this.selectedType()) params.type = this.selectedType();
    if (this.selectedGenre()) params.genre = this.selectedGenre()!;
    if (this.searchQuery()) params.search = this.searchQuery();

    this.mediaService.getMedia(params).subscribe({
      next: (response) => {
        this.mediaStore.setMedia(response.results);
        this.mediaStore.setLoading(false);
      },
      error: () => {
        this.mediaStore.setLoading(false);
      },
    });
  }

  onSearch(): void {
    this.loadMedia();
  }

  onFilterChange(): void {
    this.loadMedia();
  }

  openAddDialog(): void {
    const dialogRef = this.dialog.open(MediaFormComponent, {
      width: '600px',
      data: { genres: this.genres() },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.mediaService.createMedia(result).subscribe({
          next: (response) => {
            this.mediaStore.addMedia(response.results);
            this.snackBar.open('Media created successfully', 'Close', { duration: 3000 });
          },
          error: () => {
            this.snackBar.open('Failed to create media', 'Close', { duration: 3000 });
          },
        });
      }
    });
  }
}
