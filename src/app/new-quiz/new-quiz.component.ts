import {
  ChangeDetectionStrategy,
  Component,
  Inject,
  ViewEncapsulation,
} from '@angular/core';
import {
  MatDialogRef,
  MAT_DIALOG_DATA,
  MatDialogModule,
} from '@angular/material/dialog';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms'; // Import required Angular Form classes
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ImageUploadComponent } from '../image-upload/image-upload.component';
import { IQuiz } from '../interfaces/interfaces';
import { BehaviorSubject } from 'rxjs';
import { CommonModule } from '@angular/common';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-new-quiz',
  templateUrl: './new-quiz.component.html',
  styleUrls: ['./new-quiz.component.scss'],
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    ImageUploadComponent,
    MatProgressSpinnerModule,
  ],
})
export class NewQuizComponent {
  form: FormGroup;
  quiz = new BehaviorSubject<IQuiz | null>(null);
  loading = new BehaviorSubject<boolean>(false);

  constructor(
    public dialogRef: MatDialogRef<NewQuizComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
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
