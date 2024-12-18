import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-quiz-list',
  templateUrl: './quiz-list.component.html',
  styleUrls: ['./quiz-list.component.scss'],
  imports: [CommonModule],
})
export class QuizListComponent {
  // Sample quizzes data
  quizzes = [
    { name: 'Quiz 1', description: 'Description of Quiz 1' },
    { name: 'Quiz 2', description: 'Description of Quiz 2' },
    { name: 'Quiz 3', description: 'Description of Quiz 3' },
  ];

  // Method to handle adding a quiz
  onAddQuiz() {
    // For simplicity, we're adding a new quiz when the add button is clicked
    const newQuiz = {
      name: `Quiz ${this.quizzes.length + 1}`,
      description: `Description of Quiz ${this.quizzes.length + 1}`,
    };
    this.quizzes.push(newQuiz);
  }
}
