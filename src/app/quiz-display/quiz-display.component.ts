import { CommonModule } from '@angular/common';
import { Component, Input, Output, EventEmitter, Inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatRadioChange, MatRadioModule } from '@angular/material/radio'; // Add this
import { IQuestion, IQuiz } from '../interfaces/interfaces';

interface Question {
  text: string;
  options: string[];
  answer: string;
}

@Component({
  selector: 'app-quiz-display',
  templateUrl: './quiz-display.component.html',
  styleUrls: ['./quiz-display.component.scss'],
  imports: [MatButtonModule, MatRadioModule, CommonModule, FormsModule],
})
export class QuizDisplayComponent {
  quizTitle: string = '';
  quizDescription: string = '';
  questions: IQuestion[] = [];
  @Output() quizCompleted = new EventEmitter<boolean>();

  currentQuestionIndex: number = 0;
  selectedOption: string | null = null;
  selectedOptions: string[] = [];

  get currentQuestion(): IQuestion {
    return this.questions[this.currentQuestionIndex];
  }

  constructor(
    public dialogRef: MatDialogRef<QuizDisplayComponent>,
    @Inject(MAT_DIALOG_DATA) public quiz: IQuiz,
  ) {
    this.quizTitle = quiz.title;
    this.quizDescription = quiz.description;
    this.questions = quiz.questions;
  }

  onClose() {
    this.dialogRef.close();
  }

  selectOption(option: MatRadioChange): void {
    this.selectedOption = option.value;
    this.selectedOptions.push(option.value);
  }

  nextQuestion(): void {
    if (this.currentQuestionIndex < this.questions.length - 1) {
      this.currentQuestionIndex++;
      this.selectedOption = null;
    } else {
      this.completeQuiz();
    }
  }

  completeQuiz(): void {
    this.dialogRef.close(this.selectedOptions);
  }
}
