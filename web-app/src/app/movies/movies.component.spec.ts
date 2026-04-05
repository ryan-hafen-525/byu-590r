import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';
import { MoviesComponent } from './movies.component';
import { MoviesStore } from '../core/stores/movies.store';
import { Movie } from '../core/services/movies.service';

describe('MoviesComponent', () => {
  let moviesStore: InstanceType<typeof MoviesStore>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MoviesComponent],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        provideRouter([]),
      ],
    }).compileComponents();

    moviesStore = TestBed.inject(MoviesStore);
  });

  it('should create', () => {
    const fixture = TestBed.createComponent(MoviesComponent);
    const component = fixture.componentInstance;
    expect(component).toBeTruthy();
  });

  it('should render movie rows from store', () => {
    const mockMovies: Movie[] = [
      { id: 1, name: 'Movie One', description: 'Desc one', movie_picture: 'http://example.com/one.jpg' },
      { id: 2, name: 'Movie Two', description: 'Desc two', movie_picture: 'http://example.com/two.jpg' },
      { id: 3, name: 'Movie Three', description: 'Desc three', movie_picture: 'http://example.com/three.jpg' },
    ];

    moviesStore.setMovies(mockMovies);

    const fixture = TestBed.createComponent(MoviesComponent);
    fixture.detectChanges();

    const rows = fixture.nativeElement.querySelectorAll('tbody tr');
    expect(rows.length).toBe(3);

    expect(rows[0].textContent).toContain('Movie One');
    expect(rows[1].textContent).toContain('Movie Two');
    expect(rows[2].textContent).toContain('Movie Three');
  });

  it('should bind image src correctly', () => {
    const mockMovies: Movie[] = [
      { id: 1, name: 'Movie One', description: 'Desc one', movie_picture: 'http://example.com/poster.jpg' },
    ];

    moviesStore.setMovies(mockMovies);

    const fixture = TestBed.createComponent(MoviesComponent);
    fixture.detectChanges();

    const img = fixture.nativeElement.querySelector('img.movie-poster') as HTMLImageElement;
    expect(img).toBeTruthy();
    expect(img.src).toBe('http://example.com/poster.jpg');
  });

  it('should show fallback icon when movie_picture is empty', () => {
    const mockMovies: Movie[] = [
      { id: 1, name: 'No Poster Movie', description: 'Desc', movie_picture: '' },
    ];

    moviesStore.setMovies(mockMovies);

    const fixture = TestBed.createComponent(MoviesComponent);
    fixture.detectChanges();

    const img = fixture.nativeElement.querySelector('img.movie-poster');
    expect(img).toBeNull();

    const icon = fixture.nativeElement.querySelector('.poster-cell mat-icon');
    expect(icon).toBeTruthy();
    expect(icon.textContent).toContain('movie');
  });
});
