import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { QuizService } from '../services/quiz.service';
import { IQuiz } from '../interfaces/interfaces';
import { BehaviorSubject } from 'rxjs';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-image-upload',
  templateUrl: './image-upload.component.html',
  styleUrls: ['./image-upload.component.scss'],
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
  ],
  providers: [QuizService],
})
export class ImageUploadComponent {
  imagePreviews: string[] = [];

  loading = new BehaviorSubject<boolean>(false);

  @Output() added = new EventEmitter<IQuiz>();
  @Output() creating = new EventEmitter<boolean>();

  constructor(private quizService: QuizService) {}

  onFilesSelected(event: any): void {
    this.creating.emit();
    this.loading.next(true);
    const files = event.target.files;
    const formData = new FormData();

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const reader = new FileReader();

      reader.onload = (e: any) => {
        this.imagePreviews.push(e.target.result);
      };

      reader.readAsDataURL(file);

      // Prepare the form data to send
      formData.append('file', file);
    }

    // Upload the file to the server
    this.uploadFile(formData);
  }

  uploadFile(formData: FormData): void {
    this.quizService.uploadFile(formData).subscribe({
      next: (quiz: IQuiz) => {
        console.log('File uploaded successfully', quiz);
        this.added.emit(quiz);
        this.loading.next(false);
      },
      error: (error) => console.error('Error uploading file', error),
    });
  }

  removeImage(preview: string): void {
    const index = this.imagePreviews.indexOf(preview);
    if (index >= 0) {
      this.imagePreviews.splice(index, 1);
    }
  }
}
