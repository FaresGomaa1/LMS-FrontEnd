import { EventService } from './../../../service/event.service';
import { QuestionService } from './../../../service/question.service';
import { CourseService } from './../../../service/course.service';
import { ExamService } from './../../../service/exam.service';
import { InstructorService } from './../../../service/instructor.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Component, EventEmitter, Inject } from '@angular/core';

@Component({
  selector: 'app-popup',
  templateUrl: './popup.component.html',
  styleUrls: ['./popup.component.scss']
})
export class PopupComponent {
  id: any;
  objectType: string;
  itemDeleted: EventEmitter<void> = new EventEmitter<void>();
  constructor(
      private dialogRef: MatDialogRef<PopupComponent>,
      private instructorService: InstructorService,
      private examServices: ExamService,
      private courseService: CourseService,
      private quesServices: QuestionService,
      private eventServices: EventService,
      @Inject(MAT_DIALOG_DATA) public data: any
  ) {
      this.id = data.id;
      this.objectType = data.objectType;
  }

  closePopup() {
      this.dialogRef.close();
  }

  confirmDelete() {
      switch (this.objectType) {
        
         
          case 'exam':
              this.examServices.deleteExam(this.id).subscribe(() => {
                  this.itemDeleted.emit();
              });
              break;
       
          case 'question':
              this.quesServices.deleteQuestion(this.id).subscribe(() => {
                  this.itemDeleted.emit();
              });
              break;
        
          default:
              break;
      }
      this.closePopup();
  }
}
