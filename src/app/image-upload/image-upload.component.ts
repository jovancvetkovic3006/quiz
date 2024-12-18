import { Component } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-image-upload',
  templateUrl: './image-upload.component.html',
  styleUrls: ['./image-upload.component.scss'],
  imports: [CommonModule, HttpClientModule],
})
export class ImageUploadComponent {
  imagePreviews: string[] = [];

  constructor(private http: HttpClient) {}

  onFilesSelected(event: any): void {
    const files = event.target.files;

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const reader = new FileReader();

      reader.onload = (e: any) => {
        this.imagePreviews.push(e.target.result);
      };

      reader.readAsDataURL(file);

      // Prepare the form data to send
      const formData = new FormData();
      formData.append('file', file);

      // Upload the file to the server
      this.uploadFile(formData);
    }
  }

  uploadFile(formData: FormData): void {
    this.http.post('YOUR_API_URL_HERE', formData).subscribe(
      (response) => {
        console.log('File uploaded successfully', response);
      },
      (error) => {
        console.error('Error uploading file', error);
      },
    );
  }

  removeImage(preview: string): void {
    const index = this.imagePreviews.indexOf(preview);
    if (index >= 0) {
      this.imagePreviews.splice(index, 1);
    }
  }
}
