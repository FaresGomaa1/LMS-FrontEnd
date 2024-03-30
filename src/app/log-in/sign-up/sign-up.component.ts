import { InstructorService } from '../../generalServices/instructor.service';
import { StudentService } from './../../generalServices/student.service';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms'; // Import Validators
import { CourseService } from '../../course/course.service';
import { ICourse } from 'src/app/instructor/interface/i-course';

interface IStudent {
  name: string;
  age: number;
  title: string;
  phone: string;
  address: string;
  email: string;
  password: string;
  photo: string;
  courseName: string[];
}

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss', '../log-in.component.scss'],
})
export class SignUpComponent implements OnInit {
  signUpForm: FormGroup = new FormGroup({});
  coursesNames: ICourse[] = [];
  allEmails: string[] = [];
  check = 1;

  constructor(
    private formBuilder: FormBuilder,
    private courseService: CourseService,
    private studentService: StudentService,
    private InstructorService: InstructorService
  ) {}

  ngOnInit(): void {
    this.getAllCoursesNames();
    this.signUpForm = this.formBuilder.group({
      name: ['', [Validators.required, Validators.pattern(/^[a-zA-Z]{3,}\s[a-zA-Z]{3,}$/)]],
      age: ['', [Validators.required, Validators.min(1)]],
      title: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: [
        '',
        [
          Validators.required,
          Validators.minLength(8),
          Validators.pattern('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d).+$'),
        ],
      ],
      confirmPassword:[],
      phoneNumber: [
        '',
        [Validators.required, Validators.pattern('^(010|011|012)\\d{8}$')],
      ],
      address: ['', [Validators.required]],
      photoUrl: [[Validators.required]],
      selectedCourses: [[]],
    });
  }

  getAllCoursesNames(): void {
    this.courseService.getAllCourses().subscribe({
      next: (courses) => {
        this.coursesNames = courses;
      },
      error: (error) => {
        console.error('Error fetching courses:', error);
      },
    });
  }

  openCourseDetails(courseId: number): void {
    window.open(`http://localhost:4200/coursedetails/${courseId}`, '_blank');
  }

  onSubmit(): void {
    event?.preventDefault();
    if (this.signUpForm.valid) {
      // Call the method to retrieve all emails
      this.getAllEmails(() => {
        const enteredEmail = this.signUpForm.value.email.toLowerCase();
        for (let i = 0; i < this.allEmails.length; i++) {
          if (this.allEmails[i] === enteredEmail) {
            alert('The Email is Already Exist');
            this.check = 0;
            return;
          } 
        }
        
        // If email is unique, proceed to add the new student
        let newStudent: IStudent = {
          name: this.signUpForm.value.name,
          age: this.signUpForm.value.age,
          title: this.signUpForm.value.title,
          phone: this.signUpForm.value.phoneNumber,
          address: this.signUpForm.value.address,
          email: enteredEmail, 
          password: this.signUpForm.value.password,
          photo:this.signUpForm.value.photo || 'testimonial-3.jpg',
          courseName: this.signUpForm.value.selectedCourses,
        };
        // Add logic to call service method to add the new student
        this.studentService.addStudent(newStudent).subscribe({
          next: (response) => {
            if (this.check == 0){
              return;
            } else {
              this.signUpForm.reset();
              alert("Registration Successful!");
              this.check++;
            }
          },
          error: (error) => {
            console.error('Error adding student:', error);
          },
        });
      });
    } else {
      // Handle invalid form
    }
  }
  
  getAllEmails(callback: () => void): void {
    this.allEmails = []; // Initialize allEmails array before fetching emails
    this.studentService.getAllStudents().subscribe((stds) => {
      for (let i = 0; i < stds.length; i++) {
        this.allEmails.push(stds[i].email.toLowerCase()); // Store emails in lowercase for comparison
      }
      callback(); // Call the callback function to proceed after fetching emails
    });
    this.InstructorService.getAllInstructors().subscribe((ins) => {
      for (let i = 0; i < ins.length; i++) {
        this.allEmails.push(ins[i].email.toLowerCase()); // Store emails in lowercase for comparison
      }
      callback(); // Call the callback function to proceed after fetching emails
    });
  }
}
