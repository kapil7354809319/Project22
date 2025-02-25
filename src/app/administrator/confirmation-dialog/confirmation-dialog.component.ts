import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';


@Component({
  selector: 'app-confirmation-dialog',
  templateUrl: './confirmation-dialog.component.html',
  styleUrls: ['./confirmation-dialog.component.scss']
})

export class ConfirmationDialogComponent {
  reason !: any;

  constructor(public dialogRef: MatDialogRef<ConfirmationDialogComponent>, @Inject(MAT_DIALOG_DATA) public data: any) { }

  onCancelClick(): void {
    this.dialogRef.close(false); // Close the dialog with a result of false (cancel)
  }

  onDeleteClick(): void {
    this.dialogRef.close(true); // Close the dialog with a result of true (delete)
  }

  onYesClick(): void {
    this.dialogRef.close({ reason: this.reason });
  }
}
