import { Component, Inject } from '@angular/core';

import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms'; // Import required Angular Form classes
import { ImageUploadComponent } from '../image-upload/image-upload.component';
import { IQuiz } from '../interfaces/interfaces';
import { BehaviorSubject } from 'rxjs';
import { CommonModule } from '@angular/common';
import { MatDialogRef } from '@angular/material/dialog';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-new-quiz',
  templateUrl: './new-quiz.component.html',
  styleUrls: ['./new-quiz.component.scss'],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ImageUploadComponent,
    MatProgressSpinnerModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
  ],
})
export class NewQuizComponent {
  form: FormGroup;
  quiz = new BehaviorSubject<IQuiz | null>(null);
  loading = new BehaviorSubject<boolean>(false);

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<NewQuizComponent>,
  ) {
    this.form = this.fb.group({
      description: [''],
    });
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onCreating() {
    this.loading.next(true);
  }

  onSubmit(): void {
    if (this.form.valid) {
      console.log('Form Submitted:', this.form.value);
      this.dialogRef.close({
        ...this.quiz.value,
        description: this.form.get('description')?.value || '',
      });
    }
  }

  onQuizAdded(quiz: IQuiz) {
    this.quiz.next(quiz);
    this.loading.next(false);
  }
}
