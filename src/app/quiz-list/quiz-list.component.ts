import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  Input,
  Output,
  ViewEncapsulation,
} from '@angular/core';
import { QuizService } from '../services/quiz.service';
import { IQuiz } from '../interfaces/interfaces';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list'; // For list
import { MatTableModule } from '@angular/material/table'; // For the table
import { MatPaginatorModule } from '@angular/material/paginator'; // For pagination (optional)
import { MatSortModule } from '@angular/material/sort'; // For sorting (optional)
import { ConfirmDialogService } from '../services/confirm-dialog.service';

@Component({
  selector: 'app-quiz-list',
  templateUrl: './quiz-list.component.html',
  styleUrls: ['./quiz-list.component.scss'],
  imports: [
    CommonModule,
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    MatListModule, // Add MatListModule
    MatTableModule, // Import MatTableModule for tables
    MatPaginatorModule, // Import MatPaginatorModule for pagination (optional)
    MatSortModule,
  ],
  providers: [QuizService],
  encapsulation: ViewEncapsulation.None,
})
export class QuizListComponent {
  @Input() quizzes: IQuiz[] = [];

  @Output() delete = new EventEmitter<string>();
  @Output() start = new EventEmitter<IQuiz>();

  displayedColumns: string[] = ['title', 'description', 'actions'];

  constructor(private confirmDialog: ConfirmDialogService) {}

  deleteQuiz(id: string) {
    this.confirmDialog
      .openConfirmDialog('Да ли сте сигурни да желите да избришете овај квиз?')
      .subscribe((confirmed) => {
        if (confirmed) {
          this.delete.emit(id);
        }
      });
  }

  viewQuiz(quiz: IQuiz) {
    this.start.emit(quiz);
  }
}
