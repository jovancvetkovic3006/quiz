import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { ErrorHandler, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IQuiz } from '../interfaces/interfaces';

@Injectable({
  providedIn: 'root',
})
export class QuizService {
  constructor(private http: HttpClient) {}

  uploadFile(formData: FormData): Observable<any> {
    return this.http.post('http://192.168.1.9:5000/api/upload-image', formData);
  }

  getQuizzes(): Observable<IQuiz[]> {
    return this.http.get<IQuiz[]>('http://192.168.1.9:5000/api/quizzes');
  }

  addQuizzes(quiz: IQuiz): Observable<IQuiz> {
    return this.http.post<IQuiz>('http://192.168.1.9:5000/api/quizzes', {
      ...quiz,
    });
  }

  deleteQuiz(id: string): Observable<boolean> {
    return this.http.delete<boolean>(
      `http://192.168.1.9:5000/api/quizzes/${id}`,
    );
  }
}
