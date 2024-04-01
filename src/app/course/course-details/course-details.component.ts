import { InstructorService } from './../../generalServices/instructor.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CourseService } from './../course.service';
import { ICourses } from '../icourses';
import { IInstructor } from '../../Interfaces/instructor';

@Component({
  selector: 'app-course-details',
  templateUrl: './course-details.component.html',
  styleUrls: ['./course-details.component.scss'],
})
export class CourseDetailsComponent implements OnInit {
  selectedCourse!: ICourses;
  instructor!: IInstructor | undefined;

  constructor(
    private route: ActivatedRoute,
    private courseService: CourseService,
    private router: Router,
    private instructorService: InstructorService
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      const courseId = Number(params.get('id'));
      if (courseId) {
        this.getCourseDetails(courseId);
      } else {
        this.router.navigateByUrl('/not-found');
      }
    });
  }

  getCourseDetails(courseId: number): void {
    this.courseService.getCourseById(courseId).subscribe((course: ICourses) => {
      this.selectedCourse = course;
      this.getInstructorToCourse();
    });
  }
  getInstructorToCourse(): void {
    this.instructorService
      .getAllInstructors()
      .subscribe((instructors: IInstructor[]) => {
        this.instructor = instructors.find((instructor) =>
          instructor.courseName.includes(this.selectedCourse.name)
        );
      });
  }
}
