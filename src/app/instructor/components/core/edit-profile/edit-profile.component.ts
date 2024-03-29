import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { IInstructor } from 'src/app/instructor/interface/i-instructor';
import { InstructorService } from 'src/app/instructor/service/instructor.service';

@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.component.html',
  styleUrls: ['./edit-profile.component.scss']
})
export class EditProfileComponent implements OnInit {
  profileForm!: FormGroup;
  instructorId!: number;
  instructor!: IInstructor;

  constructor(private fb: FormBuilder, private route: ActivatedRoute, private instructorService: InstructorService) { }

  ngOnInit(): void {
    this.initForm();
    this.route.paramMap.subscribe(params => {
      this.instructorId = Number(params.get('instructorId'));
      this.getInstructorById();
    });
  }

  initForm(): void {
    this.profileForm = this.fb.group({
      name: ['', [Validators.required , Validators.minLength(3) , Validators.pattern('^[a-zA-Z]+( [a-zA-Z]+)+$')]],
      phone: ['',  [Validators.required, Validators.minLength(11),Validators.maxLength(11),
        Validators.pattern('^01[0152]+[0-9]{8,}$')
        ]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [
        Validators.required, Validators.minLength(8),
        Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/)
       ]],
      address: ['', [Validators.required,Validators.minLength(5)]],
      specialization: ['',[Validators.required,Validators.minLength(4)]]
    });
  }

  getInstructorById(): void {
    this.instructorService.getById(this.instructorId).subscribe(
      (data: IInstructor) => {
        this.instructor = data;
        this.profileForm.patchValue({
          id:this.instructorId ,
          name: data.name,
          phone: data.phone,
          email: data.email,
          password: data.password,
          address: data.address,
          specialization: data.specialization,
          courseName : data.courseName,
          photo:data.photo
        });
      },
      error => {
        console.error('Error fetching instructor:', error);
      }
    );
  }

  onSubmit(): void {
    console.log(this.profileForm.value)
    if (this.profileForm.valid) {
      console.log(1)
      const updatedInstructor: IInstructor = { ...this.profileForm.value, id: this.instructorId };
      this.instructorService.Update(this.instructorId, updatedInstructor).subscribe(
        () => {
          console.log('Instructor profile updated successfully'); 
        },
        error => {
          console.error('Error updating instructor profile:', error);
        }
      );
    } else {
      this.profileForm.markAllAsTouched();
    }
  }
}