import { Component, Input, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { SeasonService } from '../../core/services/season.service';
import { EpisodeService } from '../../core/services/episode.service';
import { Season, Episode } from '../../core/models/media.models';

@Component({
  selector: 'app-season-episode-manager',
  standalone: true,
  imports: [CommonModule, FormsModule, MatButtonModule, MatIconModule, MatFormFieldModule, MatInputModule, MatSnackBarModule],
  templateUrl: './season-episode-manager.component.html',
  styleUrl: './season-episode-manager.component.scss',
})
export class SeasonEpisodeManagerComponent {
  @Input({ required: true }) mediaId!: number;
  @Input() seasons: Season[] = [];

  private seasonService = inject(SeasonService);
  private episodeService = inject(EpisodeService);
  private snackBar = inject(MatSnackBar);

  newEpisode: { [seasonId: number]: { title: string; episode_number: number; runtime_minutes: number | null } } = {};

  addSeason(): void {
    const nextNum = this.seasons.length > 0
      ? Math.max(...this.seasons.map(s => s.season_number)) + 1
      : 1;

    this.seasonService.createSeason(this.mediaId, nextNum).subscribe({
      next: (res) => {
        this.seasons = [...this.seasons, { ...res.results, episodes: [] }];
        this.snackBar.open('Season added', 'Close', { duration: 2000 });
      },
    });
  }

  removeSeason(season: Season): void {
    if (confirm(`Delete Season ${season.season_number}?`)) {
      this.seasonService.deleteSeason(season.season_id).subscribe({
        next: () => {
          this.seasons = this.seasons.filter(s => s.season_id !== season.season_id);
          this.snackBar.open('Season deleted', 'Close', { duration: 2000 });
        },
      });
    }
  }

  initNewEpisode(seasonId: number): void {
    const season = this.seasons.find(s => s.season_id === seasonId);
    const nextNum = season?.episodes?.length
      ? Math.max(...season.episodes.map(e => e.episode_number)) + 1
      : 1;
    this.newEpisode[seasonId] = { title: '', episode_number: nextNum, runtime_minutes: null };
  }

  addEpisode(season: Season): void {
    const ep = this.newEpisode[season.season_id];
    if (!ep || !ep.title) return;

    this.episodeService.createEpisode(season.season_id, {
      episode_number: ep.episode_number,
      title: ep.title,
      runtime_minutes: ep.runtime_minutes ?? undefined,
    }).subscribe({
      next: (res) => {
        if (!season.episodes) season.episodes = [];
        season.episodes = [...season.episodes, res.results];
        delete this.newEpisode[season.season_id];
        this.snackBar.open('Episode added', 'Close', { duration: 2000 });
      },
    });
  }

  removeEpisode(season: Season, episode: Episode): void {
    this.episodeService.deleteEpisode(episode.episode_id).subscribe({
      next: () => {
        season.episodes = season.episodes?.filter(e => e.episode_id !== episode.episode_id);
      },
    });
  }
}
