
import { Component, OnDestroy, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { IInstructor } from 'src/app/instructor/interface/i-instructor';
import { InstructorService } from 'src/app/instructor/service/instructor.service';

@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.component.html',
  styleUrls: ['./edit-profile.component.scss']
})
export class EditProfileComponent implements OnInit , OnDestroy {


  profileForm!: FormGroup;
  private myActionSub: Subscription | undefined;
 
  selectedFile!: File;
  constructor(
      private instuctorServce : InstructorService,
      private router: Router,
      private actRoute: ActivatedRoute
  ) {
      this.profileForm = new FormGroup({
          name: new FormControl('', [
              Validators.required,
              Validators.minLength(3),Validators.pattern('^[a-zA-Z]+\\s[a-zA-Z]+(\\s[a-zA-Z]+)*$')
          ]),
          address: new FormControl('', [Validators.required, Validators.minLength(5)]),
          experience: new FormControl('', [
              Validators.required , Validators.minLength(4)
          ]),
          ssn: new FormControl('', [
              Validators.required , Validators.minLength(14) , Validators.maxLength(14)
          ]),
          specialization: new FormControl('', [
            Validators.required  , Validators.minLength(4)
        ]),
        password: new FormControl('', [
          Validators.required,
          Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&#^()_]{8,}$/)
      ]),
      email: new FormControl('', [
        Validators.required ,   Validators.email
    ]),
 
          phone: new FormControl('', [Validators.required ,Validators.minLength(11),Validators.maxLength(11),
            Validators.pattern('^01[0152]+[0-9]{8,}$')]),

          imageFile: new FormControl(null, [
              Validators.required, Validators.pattern(/\.(jpg|jpeg|png|gif)$/i)
              //this.validateFileType(),
          ]),
      });
  }

 
 

  onFileSelected(event: any) {
      this.selectedFile = <File>event.target.files[0];
      console.log(this.selectedFile);
  }

  getFormControl(name: string): FormControl {
      return this.profileForm.get(name) as FormControl;
  } 
  ngOnInit(): void {

     
    this.actRoute.paramMap.subscribe(params => {
          this.instructorId = Number(params.get('instructorId'));
          this.getInstructorById( )
  
              this.instuctorServce.getById(this.instructorId).subscribe(
                  (instructor: IInstructor) => {
                    this.profileForm.controls['name'].setValue(instructor.name);

                                        this.profileForm.controls['address'].setValue(
                                          instructor.address
                                        );
                                        this.profileForm.controls['email'].setValue(
                                          instructor.email
                                        );
                                        this.profileForm.controls['ssn'].setValue(
                                          instructor.ssn
                                        );
                                        this.profileForm.controls['password'].setValue(
                                          instructor.password
                                        );
                                        this.profileForm.controls['experience'].setValue(
                                          instructor.experience
                                        );
                                        this.profileForm.controls['specialization'].setValue(
                                          instructor.specialization
                                        );
                                        // courses: instructor.courseName.join(','),
                                        this.profileForm.controls['phone'].setValue(
                                          instructor.phone
                                        );
                      this.selectedFile = instructor.imageFile;
                      this.courses = instructor.courseIDs;
                  }
              );
          })
      } 
 
  
 

  courses: number[] = [];
  getInstructorById(): void {
    this.myActionSub = this.instuctorServce.getById(this.instructorId).subscribe(
      (instructor: IInstructor) => {
        this.profileForm.patchValue({
          name: instructor.name,
          address: instructor.address,
          experience: instructor.experience,
          ssn: instructor.ssn,
          specialization: instructor.specialization,
          password: instructor.password,
          email: instructor.email,
          // courses: instructor.courseName,  
          phone: instructor.phone,
       //   imageFile: instructor.userAttachmentPath
        });
        // this.courses = instructor.courseName;  
        this.selectedFile = instructor.imageFile;
        this.courses = instructor.courseIDs;
      },
      error => {
        console.error('Error fetching instructor:', error);
      }
    );
  }
   


onSubmit(): void {
  if (this.profileForm.valid) {
    const formData = new FormData();
    formData.append('name', this.profileForm.value.name);
    formData.append('address', this.profileForm.value.address);
    formData.append('experience', this.profileForm.value.experience);
    formData.append('ssn', this.profileForm.value.ssn);
    formData.append('specialization', this.profileForm.value.specialization);
    formData.append('password', this.profileForm.value.password);
    formData.append('email', this.profileForm.value.email);
    // formData.append('courses', this.profileForm.value.courses); 
    formData.append('phone', this.profileForm.value.phone);
    formData.append('imageFile', this.selectedFile);

    for (const course of this.courses) {
      formData.append('courseIDs[]', course.toString());
  }
    this.instuctorServce.Update(this.instructorId, formData).subscribe(
      () => {
        console.log('Instructor profile updated successfully');
        this.router.navigate(['/instructor/shared/profile']);
      },
      error => {
        console.error('Error updating instructor profile:', error);
      }
    );
  } else {
    this.profileForm.markAllAsTouched();
  }


}

ngOnDestroy(): void {
  this.myActionSub?.unsubscribe();
}


instructorId!: number;
}


 


 
//   profileForm!: FormGroup;
//   instructorId!: number;
  // instructor!: IInstructor;

//   constructor(private fb: FormBuilder, private active : Router, private route: ActivatedRoute, private instructorService: InstructorService) { }

//   ngOnInit(): void {
//     this.initForm();
//     this.route.paramMap.subscribe(params => {
//       this.instructorId = Number(params.get('instructorId'));
//       this.getInstructorById();
//     });
//   }

//   initForm(): void {
//     this.profileForm = this.fb.group({
//       name: ['', [Validators.required , Validators.minLength(3) , Validators.pattern('^[a-zA-Z]+( [a-zA-Z]+)+$')]],
//       phone: ['',  [Validators.required, Validators.minLength(11),Validators.maxLength(11),
//         Validators.pattern('^01[0152]+[0-9]{8,}$')
//         ]],
//       email: ['', [Validators.required, Validators.email]],
//       password: ['', [Validators.required, Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/)]],
//       address: ['', [Validators.required,Validators.minLength(5)]],
//       specialization: ['',[Validators.required,Validators.minLength(4)]],
//       experience: ['',[Validators.required,Validators.minLength(4)]],
//       ssn: ['',[Validators.required,Validators.minLength(14), Validators.maxLength(14)]],
//       courseName : [''],
//       imageFile: [null,[Validators.required]]
//     })
//   }

//   getInstructorById(): void {
//     this.instructorService.getById(this.instructorId).subscribe(
//       (data: IInstructor) => {
//         this.instructor = data;
//         this.profileForm.patchValue({
//           id:this.instructorId ,
//           name: data.name,
//           phone: data.phone,
//           email: data.email,
//           password: data.password,
//           address: data.address,
//           specialization: data.specialization,
//           courseName : data.courseName,
//      //     photo:data.photo,
//           experience: data.experience,
//           ssn:data.ssn,
//           imageFile:data.userAttachmentPath
//         });
//       },
//       error => {
//         console.error('Error fetching instructor:', error);
//       }
//     );
//   }

//   onSubmit(): void {
//     console.log(this.profileForm.value)
//     if (this.profileForm.valid) {
//       console.log(1)
      
//       const updatedInstructor: IInstructor = { ...this.profileForm.value, id: this.instructorId };
//       this.instructorService.Update(this.instructorId, updatedInstructor).subscribe(
//         () => {
//           console.log('Instructor profile updated successfully'); 
          
//           this.active.navigate(['/instructor/shared/profile']); 
//         },
//         error => {
//           console.error('Error updating instructor profile:', error);
//         }
//       );
//     } else {
//       this.profileForm.markAllAsTouched();
//     }
//   }
// }
// instructorId!: number;
// profileForm!: FormGroup;
// private myActionSub: Subscription | undefined;
// start: Date = new Date();
// getDate: Date = new Date();
// getEndDate: Date = new Date();
// today: Date = new Date();
// selectedFile! : File;
// constructor(
//   private instructorService: InstructorService,
//     private router: Router,
//     private actRoute: ActivatedRoute 
// ) {
//     this.profileForm = new FormGroup({
//         name: new FormControl('', [
//             Validators.required,
//             Validators.minLength(3),
//         ]),
//         ssn: new FormControl('', Validators.required),
//         address: new FormControl('', [
//             Validators.required
//         ]),
//         experience: new FormControl('', [
//             Validators.required
//         ]),
//         phone: new FormControl('', [Validators.required]),
//         specialization: new FormControl('', [Validators.required]),
//         email: new FormControl('', [Validators.required]),
//         imageFile: new FormControl(null, [
//             Validators.required,
//             //this.validateFileType(),
//         ]),
//     });
// }

// getInstructorById(): void {
//       this.instructorService.getById(this.instructorId).subscribe(
//     (data: IInstructor) => {
//          this.instructor = data;
//           this.profileForm.patchValue({
//             id:this.instructorId ,
//             name: data.name,
//             phone: data.phone,
//             email: data.email,
//             password: data.password,
//             address: data.address,
//             specialization: data.specialization,
//             courseName : data.courseName,
//        //     photo:data.photo,
//             experience: data.experience,
//             ssn:data.ssn,
//             imageFile:data.userAttachmentPath
//           });
//         },
//         error => {
//           console.error('Error fetching instructor:', error);
//         }
//       );
//     }
