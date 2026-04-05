import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MoviesService, Movie } from '../core/services/movies.service';
import { MoviesStore } from '../core/stores/movies.store';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MovieFormDialogComponent, MovieFormDialogResult } from './movie-form-dialog/movie-form-dialog.component';

@Component({
  selector: 'app-movies',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatButtonModule, MatDialogModule, MatSnackBarModule],
  templateUrl: './movies.component.html',
  styleUrl: './movies.component.scss',
})
export class MoviesComponent implements OnInit {
  private moviesService = inject(MoviesService);
  private moviesStore = inject(MoviesStore);
  private dialog = inject(MatDialog);
  private snackBar = inject(MatSnackBar);

  movies = this.moviesStore.movies;

  ngOnInit(): void {
    this.loadMovies();
  }

  loadMovies(): void {
    this.moviesService.getMovies().subscribe({
      next: (response) => {
        this.moviesStore.setMovies(response.results);
      },
      error: (error) => {
        console.error('Error fetching movies:', error);
      },
    });
  }

  openAddDialog(): void {
    const dialogRef = this.dialog.open(MovieFormDialogComponent, {
      width: '500px',
    });

    dialogRef.afterClosed().subscribe((result: MovieFormDialogResult | undefined) => {
      if (result) {
        this.moviesService.createMovie(result.name, result.description, result.file).subscribe({
          next: (response) => {
            this.moviesStore.addMovie(response.results);
            this.snackBar.open('Movie created successfully', 'Close', { duration: 3000 });
          },
          error: () => {
            this.snackBar.open('Failed to create movie', 'Close', { duration: 3000 });
          },
        });
      }
    });
  }

  openEditDialog(movie: Movie): void {
    const dialogRef = this.dialog.open(MovieFormDialogComponent, {
      width: '500px',
      data: { movie },
    });

    dialogRef.afterClosed().subscribe((result: MovieFormDialogResult | undefined) => {
      if (result) {
        this.moviesService.updateMovie(movie.id, result.name, result.description, result.file).subscribe({
          next: (response) => {
            this.moviesStore.updateMovie(response.results);
            this.snackBar.open('Movie updated successfully', 'Close', { duration: 3000 });
          },
          error: () => {
            this.snackBar.open('Failed to update movie', 'Close', { duration: 3000 });
          },
        });
      }
    });
  }

  deleteMovie(movie: Movie): void {
    if (confirm(`Are you sure you want to delete "${movie.name}"?`)) {
      this.moviesService.deleteMovie(movie.id).subscribe({
        next: () => {
          this.moviesStore.removeMovie(movie.id);
          this.snackBar.open('Movie deleted successfully', 'Close', { duration: 3000 });
        },
        error: () => {
          this.snackBar.open('Failed to delete movie', 'Close', { duration: 3000 });
        },
      });
    }
  }
}
