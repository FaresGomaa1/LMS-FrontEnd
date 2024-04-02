import { InstructorService } from 'src/app/instructor/service/instructor.service';
import { InstructorModule } from './../../../instructor.module';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { JwtHelperService } from '@auth0/angular-jwt';
import { IInstructor } from 'src/app/instructor/interface/i-instructor';
import { CourseService } from 'src/app/instructor/service/course.service';
import { ICourse } from 'src/app/instructor/interface/i-course';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { Subject, Subscription } from 'rxjs';
declare var $: any;
@Component({
  selector: 'app-add-course',
  templateUrl: './add-course.component.html',
  styleUrls: ['./add-course.component.scss']
})
export class AddCourseComponent implements OnInit , OnDestroy {
    CourseForm!: FormGroup;
    private myActionSub: Subscription | undefined;
    start: Date = new Date();
    getDate: Date = new Date();
    getEndDate: Date = new Date();
    today: Date = new Date();
    selectedFile!: File;
    

    private unsubscribe$ = new Subject<void>();
  
    ngOnDestroy(): void {
      this.unsubscribe$.next();
      this.unsubscribe$.complete();
    }

    constructor(
        private CourseService: CourseService,
        private router: Router,
        private actRoute: ActivatedRoute,
        private instructorService : InstructorService , private fb: FormBuilder, 
    ) {
        // this.CourseForm = new FormGroup({
        //     name: new FormControl('', [
        //         Validators.required,
        //         Validators.minLength(3),
        //     ]),
        //     description: new FormControl('', Validators.required),
        //     start_Date: new FormControl('', [
        //         Validators.required,
        //         this.futureStartDateValidator()
                
        //     ]),
        //     end_Date: new FormControl('', [
        //         Validators.required
             
        //     ]),
        //     material: new FormControl('', [Validators.required , this.urlValidator ]),
        //     imageFile: new FormControl(null, [
        //         Validators.required, 
        //         Validators.pattern(/\.(jpg|jpeg|png|gif)$/i)
        //     ]),
        // });
    }


    urlValidator(control: AbstractControl): { [key: string]: any } | null {
        if (!control.value || /^(ftp|http|https):\/\/[^ "]+$/.test(control.value)) {
          return null;  
        }
        return { 'invalidUrl': true };  
      }
       
    
    
    

    endDateAfterStartDateValidator(startDateControlName: string): ValidatorFn {
        return (control: AbstractControl): { [key: string]: any } | null => {
          const endDate = control.value;
          const startDate = control.root.get(startDateControlName)?.value;
          if (startDate && endDate && new Date(endDate) <= new Date(startDate)) {
            return { 'endDateBeforeStartDate': true };  
          }
          return null;  
        };
      }

    futureStartDateValidator(): ValidatorFn {
        return (control: AbstractControl): { [key: string]: any } | null => {
          const startDate = control.value;
          const currentDate = new Date();
          if (startDate && startDate instanceof Date && startDate < currentDate) {
            return { 'futureStartDate': true };  
          }
          return null;  
        };
      }
    startValidator(start: Date): ValidatorFn {
        return (control: AbstractControl): ValidationErrors | null => {
            const selectedDate: Date = new Date(control.value);
            if (selectedDate < start) return { minDate: true };
            if (control.value >= this.getEndDate) return { sDate: true };
            return null;
        };
    }

    getValue(e: any) {
        this.getDate = e.target.value;
    }

    getEndValue(e: any) {
        this.getEndDate = e.target.value;
    }

    endValidator(start: Date): ValidatorFn {
        return (control: AbstractControl): ValidationErrors | null => {
            const startDate: Date = start;
            if (control.value <= this.getDate)
                return { endDateBeforeStart: true };

            return null;
        };
    }


    

    onFileSelected(event: any) {
        this.selectedFile = <File>event.target.files[0];
        console.log(this.selectedFile);
    }

    getFormControl(name: string): FormControl {
        return this.CourseForm.get(name) as FormControl;
    }

    id: number = 0;
    ngOnInit(): void {
      const token = localStorage.getItem(this.tokenKey);
        if (token) {
          const helper = new JwtHelperService();
          const decodedToken = helper.decodeToken(token);
          this.instructorId = decodedToken.nameid;  
        }


        this.CourseForm = this.fb.group({
          name: ['', [Validators.required , Validators.minLength(3)]],
          start_Date: ['', [Validators.required, this.startDateValidator.bind(this)]],  
          end_Date: ['', Validators.required],
          description: ['', Validators.required],
          material: ['', [Validators.required , this.urlValidator ]],
              imageFile:[null, [
                  Validators.required, 
                  Validators.pattern(/\.(jpg|jpeg|png|gif)$/i)]]

        }, {
          validators: this.endDateAfterStartDate('start_Date', 'end_Date')
        });
       
    }

    
  startDateValidator(control: any) {
    const selectedDate = new Date(control.value);
    const currentDate = new Date();
    if (selectedDate <= currentDate) {
      return { startDateInvalid: true };
    }
    return null;
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

 
  
    onSubmit(e: Event) {
        e.preventDefault();
        const formData = new FormData();
        formData.append('name', this.CourseForm.value.name);
        formData.append('description', this.CourseForm.value.description);
        formData.append('start_Date', this.CourseForm.value.start_Date);
        formData.append('end_Date', this.CourseForm.value.end_Date);
        formData.append('material', this.CourseForm.value.material);
        if (this.selectedFile) {
            formData.append(
                'imageFile',
                this.selectedFile,
                this.selectedFile.name
            );
        }

        console.log(formData);

        if (this.CourseForm.valid) {
            this.CourseService.addCourse(formData, this.instructorId).subscribe(() => {
              console.log('Success');
              this.instructorService.addCourseToInstructor(this.instructorId, this.CourseForm.value.name)
                .subscribe(() => {
                  console.log('Instructor course list updated');
                 
                });
            });
          }
          else {
                this.CourseForm.markAllAsTouched();
              }

    }

    // ngOnDestroy(): void {
    //     this.myActionSub?.unsubscribe();
    // }

    
  // endDateAfterStartDate(startDateControlName: string, endDateControlName: string) {
  //   return (formGroup: FormGroup) => {
  //     const startDate = formGroup.controls[startDateControlName];
  //     const endDate = formGroup.controls[endDateControlName];

  //     if (endDate.errors && !endDate.hasError('endDateInvalid')) {

  //       return;
  //     }

  //     if (startDate.value >= endDate.value) {
  //       endDate.setErrors({ endDateInvalid: true });
  //     } else {
  //       endDate.setErrors(null);
  //     }
  //   };
  // }
  
  // startDateValidator(control: any) {
  //   const selectedDate = new Date(control.value);
  //   const currentDate = new Date();
  //   if (selectedDate <= currentDate) {
  //     return { startDateInvalid: true };
  //   }
  //   return null;
  // }


     tokenKey = 'auth_token';
  instructorId: number = 0;  

  }

  
  // courseForm!: FormGroup;
  // tokenKey = 'auth_token';
  // instructorId: number = 0;  

  
  // constructor(private fb: FormBuilder, 
  //             private courseService: CourseService,
  //             private instructorService: InstructorService , private active : Router) { }  

  // ngOnInit(): void {
  //   this.courseForm = this.fb.group({
  //     name: ['', Validators.required],
  //     start_Date: ['', [Validators.required, this.startDateValidator.bind(this)]],  
  //     end_Date: ['', Validators.required],
  //     description: ['', Validators.required],
  //     material: ['', Validators.required],
  //     imageFile: ['', Validators.required],
  //     userAttachmentPath: [null],

  //   }, {
  //     validators: this.endDateAfterStartDate('start_Date', 'end_Date')
  //   });
  //   const token = localStorage.getItem(this.tokenKey);
  //   if (token) {
  //     const helper = new JwtHelperService();
  //     const decodedToken = helper.decodeToken(token);
  //     this.instructorId = decodedToken.nameid;  
  //   }
  // }
  
 

  // endDateAfterStartDate(startDateControlName: string, endDateControlName: string) {
  //   return (formGroup: FormGroup) => {
  //     const startDate = formGroup.controls[startDateControlName];
  //     const endDate = formGroup.controls[endDateControlName];

  //     if (endDate.errors && !endDate.hasError('endDateInvalid')) {

  //       return;
  //     }

  //     if (startDate.value >= endDate.value) {
  //       endDate.setErrors({ endDateInvalid: true });
  //     } else {
  //       endDate.setErrors(null);
  //     }
  //   };
  // }
  
  // startDateValidator(control: any) {
  //   const selectedDate = new Date(control.value);
  //   const currentDate = new Date();
  //   if (selectedDate <= currentDate) {
  //     return { startDateInvalid: true };
  //   }
  //   return null;
  // }

  // onSubmit(): void {
  //   console.log(this.courseForm.value)
  //   if (this.courseForm.valid) { 
  //     this.courseService.addCourse(this.courseForm.value, this.instructorId).subscribe(
  //       (res) => {
  //         console.log('Course added successfully:', res);
  //         this.instructorService.updateInstructorCourses(this.instructorId, this.courseForm.value.name).subscribe(
  //           () => {
  //             console.log('Instructor courses updated successfully.');
  //             this.active.navigate(['/instructor/shared/InstructorCourses']); 
  //             this.courseForm.reset();
  //           },
  //           (err) => {
  //             console.error('Error updating instructor courses:', err);
  //           }
  //         );
  //       },
  //       (err) => {
  //         console.error('Error adding course:', err);
  //       }
  //     );
  //   } else {
  //     alert('Please Enter valid inputs');
  //     this.courseForm.markAllAsTouched();
  //   }
  // }}
