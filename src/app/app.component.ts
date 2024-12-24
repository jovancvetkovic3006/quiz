import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { QuizListComponent } from './quiz-list/quiz-list.component';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { QuizService } from './services/quiz.service';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { IQuiz } from './interfaces/interfaces';

// Material
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog } from '@angular/material/dialog';
import { NewQuizComponent } from './new-quiz/new-quiz.component';
import { ConfirmDialogService } from './services/confirm-dialog.service';
import { QuizDisplayComponent } from './quiz-display/quiz-display.component';
import { ResultsModalComponent } from './results-modal/results-modal.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  providers: [HttpClient, QuizService, ConfirmDialogService],
  imports: [
    CommonModule,
    RouterOutlet,
    QuizListComponent,
    MatToolbarModule,
    MatButtonModule,
    MatCardModule,
    MatIconModule,
  ],
})
export class AppComponent implements OnInit {
  title = 'jejka-quiz';

  quizzes = new BehaviorSubject<IQuiz[]>([]);
  loading = new BehaviorSubject<boolean>(true);

  constructor(
    private quizService: QuizService,
    public dialog: MatDialog,
    private confirmDialog: ConfirmDialogService,
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

  startQuiz(quiz: IQuiz) {
    const dialogRef = this.dialog.open(QuizDisplayComponent, {
      data: quiz,
      width: '500px',
    });
    dialogRef.afterClosed().subscribe((results: string[]) => {
      if (results) {
        let correctCount = 0;
        results.forEach((result, index) => {
          if (quiz.questions[index].answer === result) {
            correctCount++;
          }
        });

        // Calculate the percentage of correct answers
        const correctPercentage = (correctCount / quiz.questions.length) * 100;

        // Open the results modal with the necessary data
        this.dialog.open(ResultsModalComponent, {
          data: {
            questions: quiz.questions,
            userAnswers: results,
            correctCount: correctCount,
            correctPercentage: correctPercentage,
          },
        });
      }
    });
  }

  deleteQuiz(quizId: string) {
    this.quizService.deleteQuiz(quizId).subscribe(() => {
      this.loadQuizzes();
    });
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
