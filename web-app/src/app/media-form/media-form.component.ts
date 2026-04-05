import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Media, Genre } from '../core/models/media.models';
import { SeasonEpisodeManagerComponent } from './season-episode-manager/season-episode-manager.component';

export interface MediaFormDialogData {
  media?: Media;
  genres: Genre[];
}

@Component({
  selector: 'app-media-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    SeasonEpisodeManagerComponent,
  ],
  templateUrl: './media-form.component.html',
  styleUrl: './media-form.component.scss',
})
export class MediaFormComponent {
  private fb = inject(FormBuilder);
  private dialogRef = inject(MatDialogRef<MediaFormComponent>);
  data: MediaFormDialogData = inject(MAT_DIALOG_DATA, { optional: true }) || { genres: [] };

  form: FormGroup;
  selectedFile: File | null = null;
  imagePreview: string | null = null;
  isEditMode: boolean;

  constructor() {
    const m = this.data.media;
    this.isEditMode = !!m;

    this.form = this.fb.group({
      title: [m?.title || '', Validators.required],
      synopsis: [m?.synopsis || ''],
      media_type: [m?.media_type || 'movie', Validators.required],
      genre_ids: [m?.genres?.map(g => g.genre_id) || []],
      release_date: [m?.movie?.release_date || ''],
      runtime_minutes: [m?.movie?.runtime_minutes || ''],
    });

    if (m?.poster_url) {
      this.imagePreview = m.poster_url;
    }
  }

  get mediaType(): string {
    return this.form.get('media_type')?.value;
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      this.selectedFile = input.files[0];
      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreview = reader.result as string;
      };
      reader.readAsDataURL(this.selectedFile);
    }
  }

  onSubmit(): void {
    if (!this.form.valid) return;

    const val = this.form.value;
    const result: any = {
      title: val.title,
      synopsis: val.synopsis,
      media_type: val.media_type,
      genre_ids: val.genre_ids,
    };

    if (val.media_type === 'movie') {
      if (val.release_date) result.release_date = val.release_date;
      if (val.runtime_minutes) result.runtime_minutes = Number(val.runtime_minutes);
    }

    if (this.selectedFile) {
      result.image = this.selectedFile;
    }

    this.dialogRef.close(result);
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
