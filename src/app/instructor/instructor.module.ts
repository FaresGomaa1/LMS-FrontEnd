import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { TrialComponent } from './trial/trial.component';
import { NavbarComponent } from './components/shared/navbar/navbar.component';
import { FooterComponent } from './components/shared/footer/footer.component';
import { HomeComponent } from './components/core/home/home.component';
import { InstructorCoursesComponent } from './components/core/instructor-courses/instructor-courses.component';
import { ProfileComponent } from './components/core/profile/profile.component';
import { AddExamComponent } from './components/core/add-exam/add-exam.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AddQuestionComponent } from './components/core/add-question/add-question.component';

const instructorRoutes: Routes = [
  {path: '', redirectTo: 'shared', pathMatch: 'full'},
  {path:'shared', component: TrialComponent,
  children: [
    { path: 'home', component: HomeComponent },
    { path: 'addExam/:courseId', component: AddExamComponent },
    { path: 'addExam/addQuestion/:exam_Id', component: AddQuestionComponent },
    { path: 'InstructorCourse', component: InstructorCoursesComponent },
  ]},

 
];

@NgModule({
  declarations: [
    TrialComponent,
    NavbarComponent,
    FooterComponent,
    HomeComponent,
    InstructorCoursesComponent,
    ProfileComponent,
    AddExamComponent,
    AddQuestionComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forChild(instructorRoutes),
  ]
})
export class InstructorModule { }
