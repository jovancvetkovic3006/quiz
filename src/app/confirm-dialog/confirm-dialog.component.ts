import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-confirm-dialog',
  templateUrl: './confirm-dialog.component.html',
  styleUrls: ['./confirm-dialog.component.scss'],
  imports: [MatDialogModule, MatButtonModule],
})
export class ConfirmDialogComponent {
  message: string;

  constructor(@Inject(MAT_DIALOG_DATA) public data: any) {
    this.message = data.message;
  }
}
