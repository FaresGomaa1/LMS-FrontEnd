import { InstructorService } from '../generalServices/instructor.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IInstructor } from '../Interfaces/instructor';

@Component({
  selector: 'app-instructor-profile',
  templateUrl: './instructor-profile.component.html',
  styleUrls: ['./instructor-profile.component.scss'],
})
export class InstructorProfileComponent implements OnInit {
  instructorId!: number;
  instructor!: any;

  constructor(
    private route: ActivatedRoute,
    private instructorService: InstructorService
  ) {}

  ngOnInit(): void {
    this.getInstructorId();
  }
  getInstructorId() {
    const paramMap = this.route.snapshot.paramMap;
    if (paramMap) {
      const idString = paramMap.get('id');
      if (idString) {
        this.instructorId = +idString;
        this.instructorService
          .getInstructorById(this.instructorId)
          .subscribe((ins) => {
            this.instructor = ins;
          });
      } else {
        console.error('No id parameter found in URL');
      }
    } else {
      console.error('paramMap is null');
    }
  }
}
