import { InstructorService } from './../generalServices/instructor.service';
import { Component, OnInit } from '@angular/core';
import { StudentService } from '../generalServices/student.service';
import { JwtHelperService } from '@auth0/angular-jwt';
import { IStudent } from '../Interfaces/istudent';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent implements OnInit {
  tokenKey = 'auth_token';
  student: IStudent | undefined;
  profileForm!: FormGroup;
  instructorId!: number

  constructor(
    private studentService: StudentService,
    private formBuilder: FormBuilder,
    private instructorService: InstructorService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.getStudentById();
  }

  initializeForm(student: IStudent): void {
    this.student = student;
    this.instructorService.getAllInstructors().subscribe((ins)=>{
      for (let  i = 0; i < ins.length ; i++){
        for (let  j = 0; j < ins[i].courseName.length ; j++){
          if (ins[i].courseName[j] === this.student?.courseName[0]){
              this.instructorId = ins[i].id;
          }
        }
      }
    })
    this.profileForm = this.formBuilder.group({
      name: [this.student?.name, [Validators.required]],
      age: [this.student?.age, [Validators.required,Validators.min(1)]],
      title: [this.student?.title,Validators.required],
      phone: [this.student?.phone, Validators.pattern('^(010|011|012)\\d{8}$')],
      address: [this.student?.address, Validators.required],
      email: [this.student?.email, [Validators.required, Validators.email]],
      password: [
        this.student.password,
        [Validators.required,
          Validators.minLength(8),
          Validators.pattern('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d).+$'),
        ],
      ],
      photo: ['../../assets/img/testimonial-2.jpg',Validators.required],
      courseName: [[this.student?.courseName[0]]],
      instructorIDs: [[this.instructorId]],
    });
  }

  // submitForm() {
  //   if (this.profileForm.valid) {
  //     const formData = this.profileForm.value;
  //     console.log(formData);
  //     const updatedStudent1 = {
  //       name: formData.name || this.student?.name , 
  //       age: formData.age || this.student?.age,
  //       title: formData.title || this.student?.title ,
  //       phone: formData.phone || this.student?.phone ,
  //       address: formData.address || this.student?.address,
  //       email: formData.email || this.student?.email ,
  //       password: formData.password || this.student?.password ,
  //       photo: formData.photo || this.student?.photo ,
  //       courseName: ["alkwdnpon"],
  //       instructorIDs: [1],
  //     };
  //     console.log(updatedStudent1)
  //     this.studentService.updateStudent(updatedStudent1).subscribe(
  //       (updatedStudent) => {
  //         console.log("Student updated successfully:", updatedStudent);
  //       },
  //       (error) => {
  //         console.error("Error updating student:", error);
  //       }
  //     );
  //   } else {
  //     // Form is invalid, do something like displaying error messages or preventing submission
  //   }
  // }
  
  navigateToEditProfile() {
    // Assuming you have the student object available
    const studentId = this.student?.id;
    if (studentId) {
      window.location.href = `/shared/editProfile/${studentId}`;
    } else {
      console.error('Student ID is missing.');
    }
  }

  getStudentById(): void {
    const token = localStorage.getItem(this.tokenKey);
    if (token) {
      const helper = new JwtHelperService();
      const decodedToken = helper.decodeToken(token);
      const userId = decodedToken.nameid;
      if (userId) {
        this.studentService
          .getStudentById(userId)
          .subscribe((student: IStudent) => {
            this.initializeForm(student);
          });
      }
    }
  }
}
