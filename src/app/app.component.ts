import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { QuizListComponent } from './quiz-list/quiz-list.component';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { QuizService } from './services/quiz.service';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { IQuiz } from './interfaces/interfaces';
import { MatDialog } from '@angular/material/dialog';
import { NewQuizComponent } from './new-quiz/new-quiz.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner'; // Import the spinner module

@Component({
  selector: 'app-root',
  imports: [
    CommonModule,
    RouterOutlet,
    QuizListComponent,
    MatProgressSpinnerModule,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  providers: [HttpClient, QuizService],
})
export class AppComponent implements OnInit {
  title = 'jejka-quiz';

  quizzes = new BehaviorSubject<IQuiz[]>([]);
  loading = new BehaviorSubject<boolean>(true);

  constructor(
    private quizService: QuizService,
    private dialog: MatDialog,
  ) {}

  ngOnInit(): void {
    this.loadQuizzes();
  }

  getQuizzes(): Observable<IQuiz[]> {
    return this.quizService.getQuizzes();
  }

  loadQuizzes() {
    this.getQuizzes().subscribe({
      next: (quizzes) => {
        console.log('Loaded quizzes', quizzes);
        this.quizzes.next(quizzes);
        this.loading.next(false);
      },
    });
  }

  deleteQuiz(id: string) {
    this.quizService.deleteQuiz(id).pipe(
      tap(() => {
        this.loadQuizzes();
      }),
    );
  }

  newQuiz() {
    const dialogRef = this.dialog.open(NewQuizComponent, {
      width: '400px',
    });

    dialogRef.afterClosed().subscribe((quiz) => {
      if (quiz) {
        console.log('Dialog closed with result:', quiz);
        this.quizService.addQuizzes(quiz).subscribe({
          next: () => {
            this.loadQuizzes();
          },
          error: (error) => {
            console.error('Quiz not saved', error);
          },
        });
      }
    });
  }
}
