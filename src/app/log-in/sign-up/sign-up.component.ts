import { InstructorService } from '../../generalServices/instructor.service';
import { StudentService } from './../../generalServices/student.service';
import { CourseService } from '../../course/course.service';
import { ICourse } from 'src/app/instructor/interface/i-course';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
// import { MessageService } from 'primeng/api';
import { ActivatedRoute, Router } from '@angular/router';
import {IStudent1} from "../../Interfaces/student-for-add"

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss', '../log-in.component.scss'],
})
export class SignUpComponent implements OnInit {
  StudentForm: FormGroup;
  selectedFile!: File;
  imagePreview: string | ArrayBuffer | null = null;
  check:number = 1;
  private myActionSub: Subscription | undefined;

  coursesNames: ICourse[] = [];
  allEmails: string[] = [];


  constructor(
    private formBuilder: FormBuilder,
    private courseService: CourseService,
    private studentService: StudentService,
    private InstructorService: InstructorService,
    private actRoute: ActivatedRoute,
    private router: Router,
  ) {
    this.StudentForm = new FormGroup({
      name: new FormControl('', [
          Validators.required,
          Validators.minLength(3),
          Validators.pattern('^[a-zA-Z]+( [a-zA-Z]+)+$'),
      ]),
      phone: new FormControl('', [
          Validators.required,
          Validators.minLength(11),
          Validators.maxLength(11),
          Validators.pattern('^01[0152]+[0-9]{8,}$'),
      ]),
      address: new FormControl('', [
          Validators.required,
          Validators.minLength(5),
      ]),
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [
          Validators.required,
          Validators.minLength(8),
          Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/)
      ]),
      imageFile: new FormControl(null, [
          Validators.required,
          //this.validateFileType(),
      ]),
      age: new FormControl('', [Validators.required, Validators.min(18)]),
      ssn: new FormControl('', [
          Validators.required,
          Validators.pattern(/^\d{14}$/),
      ]),
      title: new FormControl('', [
          Validators.required,
          Validators.minLength(4),
      ]),
  });
  }
  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0] as File;
    console.log(this.selectedFile);
  }
  
getFormControl(name: string): FormControl {
  return this.StudentForm.get(name) as FormControl;
}
id: number = 0;
ngOnInit(): void {
  this.actRoute.params.subscribe((params) => {
      this.id = params['id'];
      if (!this.id) {
          this.id = 0;
      }

      if (this.id != 0) {
          this.studentService.getById(this.id)
              .subscribe((student: IStudent1) => {
                  this.StudentForm.controls['name'].setValue(
                      student.name
                  );
                  this.StudentForm.controls['phone'].setValue(
                      student.phone
                  );
                  this.StudentForm.controls['address'].setValue(
                      student.address
                  );
                  this.StudentForm.controls['age'].setValue(student.age);
                  this.StudentForm.controls['title'].setValue(
                      student.title
                  );
                  this.StudentForm.controls['email'].setValue(
                      student.email
                  );
                  this.StudentForm.controls['password'].setValue(
                      student.password
                  );
                   this.StudentForm.controls['ssn'].setValue(
                       student.ssn
                   );
                  this.StudentForm.controls['age'].setValue(student.age);
                  this.StudentForm.controls['title'].setValue(
                      student.title
                  );
                  this.imagePreview = student.userAttachmentPath || null;
              });
      }
  });
}



  openCourseDetails(courseId: number): void {
    window.open(`http://localhost:4200/coursedetails/${courseId}`, '_blank');
  }

  onSubmit(e:Event): void {
    e.preventDefault();
    if (this.StudentForm.valid) {
      const formData = new FormData();
      formData.append('name', this.StudentForm.get('name')!.value);
      formData.append('phone', this.StudentForm.get('phone')!.value);
      formData.append('address', this.StudentForm.get('address')!.value);
      formData.append('email', this.StudentForm.get('email')!.value);
      formData.append('password', this.StudentForm.get('password')!.value);
      formData.append('age', this.StudentForm.get('age')!.value);
      formData.append('title', this.StudentForm.get('title')!.value);
      formData.append('ssn', this.StudentForm.get('ssn')!.value);
  
      if (this.selectedFile) {
        formData.append('imageFile', this.selectedFile, this.selectedFile.name);
      }
  
      // Now formData should contain all the form data correctly
  
      if (this.id) {
        this.studentService.Edit(this.id, formData).subscribe(() => {
          console.log('Edit Success');
        });
      } else {
        this.studentService.Add(formData).subscribe(() => {
          console.log('Add Success');
        });
      }
      this.router.navigate(['/student']);
    }
  }
  

  
  // getAllEmails(callback: () => void): void {
  //   this.allEmails = []; // Initialize allEmails array before fetching emails
  //   this.studentService.getAllStudents().subscribe((stds) => {
  //     for (let i = 0; i < stds.length; i++) {
  //       this.allEmails.push(stds[i].email.toLowerCase()); // Store emails in lowercase for comparison
  //     }
  //     callback(); // Call the callback function to proceed after fetching emails
  //   });
  //   this.InstructorService.getAllInstructors().subscribe((ins) => {
  //     for (let i = 0; i < ins.length; i++) {
  //       this.allEmails.push(ins[i].email.toLowerCase()); // Store emails in lowercase for comparison
  //     }
  //     callback(); // Call the callback function to proceed after fetching emails
  //   });
  // }
}
