import { Component, Inject } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';

@Component({
  selector: 'app-info-modal',
  templateUrl: './info-dialog.component.html',
  styleUrls: ['./info-dialog.component.scss'],
  imports: [MatDialogModule],
})
export class ModalComponent {
  constructor(
    public dialogRef: MatDialogRef<ModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { message: string },
  ) {}

  onClose(): void {
    this.dialogRef.close();
  }
}
