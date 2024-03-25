import { Component } from '@angular/core';
import { IInstructor } from 'src/app/instructor/interface/i-instructor';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent {
 public instructor: IInstructor;

constructor() {
  // Assigning static values to the instructor object
  this.instructor = {
    id:1,
    password: 'adad',
    email:'Marina@gmail.com',
    name: 'Marina',
    specialization: 'Software Engineer',
    phone: '123 456 789',
    address: 'miamy',
    courseName: ['PHP', 'DotNet']
  };
}
}
