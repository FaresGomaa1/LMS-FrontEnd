import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ICourse } from '../interface/i-course';
import { IInstructor } from '../interface/i-instructor'; // Import the instructor interface
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class InstructorService {
  //baseURL :string = '';
  courses: ICourse[] = [
    {
      id: 1,
      name: 'DotNET',
      start_Date: new Date('2024-03-24'),
      end_Date: new Date('2024-04-24'),
      discription: 'THis is Dotnet Course'
    }, {
      id: 2,
      name: 'PHP',
      start_Date: new Date('2024-03-30'),
      end_Date: new Date('2024-04-12'),
      discription: 'THis is PHP Course'
    },
  ];

  instructors: IInstructor[] = [
    {
      id: 1,
      name: 'Marina',
      phone: '1234567890',
      address: 'miamy',
      email: 'marina@example.com',
      password: '13142fs',
      photo: 'marina.jpg',
      specialization: 'ITII',
      courseName: ['DotNET', 'PHP'] 
    }]
  loggedInInstructorId: number = 1; 

  constructor(private HttpClient :HttpClient , private myRoute : Router , private act : ActivatedRoute) { }
    
  setLoggedInInstructorId(id: number) {
  //  this.loggedInInstructorId = this.act.snapshot.params['id'];
    this.loggedInInstructorId = id;
  }

  getInstructorCourses(): ICourse[] {
    const instructor = this.instructors.find(instructor => instructor.id === this.loggedInInstructorId);
      
    if (instructor) {
      const filteredCourses = this.courses.filter(course => instructor.courseName.includes(course.name));
      return filteredCourses;
    }
    return [];
  }
}
