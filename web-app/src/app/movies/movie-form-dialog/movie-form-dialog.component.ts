import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { Movie } from '../../core/services/movies.service';

export interface MovieFormDialogData {
  movie?: Movie;
}

export interface MovieFormDialogResult {
  name: string;
  description: string;
  file?: File;
}

@Component({
  selector: 'app-movie-form-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
  ],
  templateUrl: './movie-form-dialog.component.html',
})
export class MovieFormDialogComponent {
  private fb = inject(FormBuilder);
  private dialogRef = inject(MatDialogRef<MovieFormDialogComponent>);
  data: MovieFormDialogData = inject(MAT_DIALOG_DATA, { optional: true }) || {};

  form: FormGroup;
  selectedFile: File | null = null;
  imagePreview: string | null = null;
  isEditMode: boolean;

  constructor() {
    this.isEditMode = !!this.data.movie;
    this.form = this.fb.group({
      name: [this.data.movie?.name || '', Validators.required],
      description: [this.data.movie?.description || '', Validators.required],
    });
    if (this.data.movie?.movie_picture) {
      this.imagePreview = this.data.movie.movie_picture;
    }
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
    if (this.form.valid) {
      const result: MovieFormDialogResult = {
        name: this.form.value.name,
        description: this.form.value.description,
      };
      if (this.selectedFile) {
        result.file = this.selectedFile;
      }
      this.dialogRef.close(result);
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
