import { Component, Inject } from '@angular/core';
import { MatDialogRef , MAT_DIALOG_DATA  } from '@angular/material/dialog';
 
@Component({
  selector: 'app-popup-question',
  templateUrl: './popup-question.component.html',
  styleUrls: ['./popup-question.component.scss']
})
export class PopupQuestionComponent {
  constructor(
    private dialogRef: MatDialogRef<PopupQuestionComponent>,

    @Inject(MAT_DIALOG_DATA) public data: any
) {}

closePopup() {
    this.dialogRef.close(false);
}

confirmAddAnother() {
    this.dialogRef.close(true);
}
}
