import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { QuizListComponent } from './quiz-list/quiz-list.component';
import { CommonModule } from '@angular/common';
import { ImageUploadComponent } from './image-upload/image-upload.component';

@Component({
  selector: 'app-root',
  imports: [
    CommonModule,
    RouterOutlet,
    QuizListComponent,
    ImageUploadComponent,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'jejka-quiz';
}
