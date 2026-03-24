import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MoviesService, Movie } from '../core/services/movies.service';
import { MoviesStore } from '../core/stores/movies.store';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-movies',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  templateUrl: './movies.component.html',
  styleUrl: './movies.component.scss',
})
export class MoviesComponent implements OnInit {
  private moviesService = inject(MoviesService);
  private moviesStore = inject(MoviesStore);

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
}
