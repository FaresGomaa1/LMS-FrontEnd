import { InstructorService } from 'src/app/instructor/service/instructor.service';
import { InstructorModule } from './../../../instructor.module';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { JwtHelperService } from '@auth0/angular-jwt';
import { IInstructor } from 'src/app/instructor/interface/i-instructor';
import { CourseService } from 'src/app/instructor/service/course.service';
import { ICourse } from 'src/app/instructor/interface/i-course';
import { ActivatedRoute, Route, Router } from '@angular/router';

@Component({
  selector: 'app-add-course',
  templateUrl: './add-course.component.html',
  styleUrls: ['./add-course.component.scss']
})
export class AddCourseComponent implements OnInit {
  courseForm!: FormGroup;
  tokenKey = 'auth_token';
  instructorId: number = 0;  

  
  constructor(private fb: FormBuilder, 
              private courseService: CourseService,
              private instructorService: InstructorService , private active : Router) { }  

  ngOnInit(): void {
    this.courseForm = this.fb.group({
      name: ['', Validators.required],
      start_Date: ['', [Validators.required, this.startDateValidator.bind(this)]],  
      end_Date: ['', Validators.required],
      description: ['', Validators.required]
    }, {
      validators: this.endDateAfterStartDate('start_Date', 'end_Date')
    });
    const token = localStorage.getItem(this.tokenKey);
    if (token) {
      const helper = new JwtHelperService();
      const decodedToken = helper.decodeToken(token);
      this.instructorId = decodedToken.nameid;  
    }
  }
  
 

  endDateAfterStartDate(startDateControlName: string, endDateControlName: string) {
    return (formGroup: FormGroup) => {
      const startDate = formGroup.controls[startDateControlName];
      const endDate = formGroup.controls[endDateControlName];

      if (endDate.errors && !endDate.hasError('endDateInvalid')) {

        return;
      }

      if (startDate.value >= endDate.value) {
        endDate.setErrors({ endDateInvalid: true });
      } else {
        endDate.setErrors(null);
      }
    };
  }
  
  startDateValidator(control: any) {
    const selectedDate = new Date(control.value);
    const currentDate = new Date();
    if (selectedDate <= currentDate) {
      return { startDateInvalid: true };
    }
    return null;
  }

  onSubmit(): void {
    if (this.courseForm.valid) { 
      this.courseService.addCourse(this.courseForm.value, this.instructorId).subscribe(
        (res) => {
          console.log('Course added successfully:', res);
          this.instructorService.updateInstructorCourses(this.instructorId, this.courseForm.value.name).subscribe(
            () => {
              console.log('Instructor courses updated successfully.');
              this.active.navigate(['/instructor/shared/InstructorCourses']); 
              this.courseForm.reset();
            },
            (err) => {
              console.error('Error updating instructor courses:', err);
            }
          );
        },
        (err) => {
          console.error('Error adding course:', err);
        }
      );
    } else {
      alert('Please Enter valid inputs');
      this.courseForm.markAllAsTouched();
    }
  }}