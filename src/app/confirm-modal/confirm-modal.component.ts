import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-confirmation-dialog',
  template: `
    <h1 mat-dialog-title>Confirmation</h1>
    <div mat-dialog-content>{{ data.message }}</div>
    <div mat-dialog-actions>
      <button mat-button (click)="onNoClick()">No</button>
      <button mat-button color="warn" (click)="onYesClick()">Yes</button>
    </div>
  `,
  styles: `
    mat-dialog-content {
      font-size: 1rem;
      color: #555;
      padding: 20px;
    }

    mat-dialog-actions {
      display: flex;
      justify-content: flex-end;
      padding: 16px;

      button {
        font-size: 1rem;
        padding: 8px 16px;
        border-radius: 4px;

        &.mat-raised-button {
          font-weight: bold;
        }

        &.mat-raised-button.color-primary {
          background-color: #3f51b5;
          color: white;
          &:hover {
            background-color: #303f9f;
          }
        }
      }
    }
  `,
})
export class ConfirmationDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<ConfirmationDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { message: string },
  ) {}

  onNoClick(): void {
    this.dialogRef.close('no');
  }

  onYesClick(): void {
    this.dialogRef.close('yes');
  }
}
