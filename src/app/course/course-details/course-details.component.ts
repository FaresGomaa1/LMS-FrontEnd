import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router'; // Import ActivatedRoute
import { CourseService } from './../course.service';
import { ICourses } from '../icourses';

@Component({
  selector: 'app-course-details',
  templateUrl: './course-details.component.html',
  styleUrls: ['./course-details.component.scss']
})
export class CourseDetailsComponent implements OnInit {
  selectedCourse!: ICourses;

  constructor(
    private route: ActivatedRoute,
    private courseService: CourseService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const courseId = Number(params.get('id')); 
      console.log(courseId);
      if (courseId) {
        this.getCourseDetails(courseId);
      }else {
        this.router.navigateByUrl('/not-found');
      }
    });
  }

  getCourseDetails(courseId: number): void {
    this.courseService.getCourseById(courseId).subscribe(
      (course: ICourses) => {
        this.selectedCourse = course;
        console.log(this.selectedCourse)
      }
    );
  }
}