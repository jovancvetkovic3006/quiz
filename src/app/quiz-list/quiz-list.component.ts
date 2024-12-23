import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewEncapsulation,
} from '@angular/core';
import { QuizService } from '../services/quiz.service';
import { IQuiz } from '../interfaces/interfaces';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatCardModule } from '@angular/material/card';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmationDialogComponent } from '../confirm-modal/confirm-modal.component';

@Component({
  selector: 'app-quiz-list',
  templateUrl: './quiz-list.component.html',
  styleUrls: ['./quiz-list.component.scss'],
  imports: [CommonModule, MatButtonModule, MatToolbarModule, MatCardModule],
  providers: [QuizService],
})
export class QuizListComponent {
  @Input() quizzes: IQuiz[] | null = [];

  @Output() delete = new EventEmitter<string>();
  @Output() start = new EventEmitter<string>();

  constructor(public dialog: MatDialog) {}

  deleteQuiz(id: string) {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      data: { message: 'Are you sure you want to delete this quiz?' },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result === 'yes') {
        this.delete.emit(id);
      }
    });
  }

  startQuiz(id: string) {
    this.start.emit(id);
  }
}
