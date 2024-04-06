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
import { FormArray, FormsModule, ReactiveFormsModule } from '@angular/forms'; 

import { CoursesExamComponent } from './components/core/courses-exam/courses-exam.component';
import { EditExamComponent } from './components/core/edit-exam/edit-exam.component';
import { ViewExamQuestionsComponent } from './components/view-exam-questions/view-exam-questions.component';
import { EventComponent } from './components/core/event/event.component';
import { EditQuestionComponent } from './components/edit-question/edit-question.component';
import { AddCourseComponent } from './components/core/add-course/add-course.component';
import { EditProfileComponent } from './components/core/edit-profile/edit-profile.component';
import { CourseDetailsComponent } from './components/course-details/course-details.component';
import { AllExamsComponent } from './components/core/all-exams/all-exams.component';
import { NotFoundComponent } from './components/shared/not-found/not-found.component';
import { MatButtonModule } from '@angular/material/button';
 
import { MatDialogModule } from '@angular/material/dialog';
import { AddQuestionComponent } from './components/core/add-question/add-question.component';
import { AddNewQuesComponent } from './components/core/add-new-ques/add-new-ques.component';
import { CourseStudentsComponent } from './components/core/course-students/course-students.component';
import { PopupComponent } from './components/core/popup/popup.component';

const instructorRoutes: Routes = [
  {path: '', redirectTo: 'shared/profile', pathMatch: 'full'},
  {path:'shared', component: TrialComponent,
  children: [
    { path: 'home', component: HomeComponent },
    { path: 'addExam/:courseId', component: AddExamComponent },
    { path: 'InstructorCourses', component: InstructorCoursesComponent },
    { path: 'CoursesExam', component: CoursesExamComponent },
    { path: 'profile', component: ProfileComponent },
    {path:'editExam/:examId',component:EditExamComponent},
    {path:'addQuestion',component:AddQuestionComponent},
    {path:'viewQuestions/:examId',component:ViewExamQuestionsComponent},

    {path:'Events',component:EventComponent},
    {path:'AddCourse',component:AddCourseComponent},
    {path:'EditProfile/:instructorId' , component: EditProfileComponent},
    {path: 'courseDetails/:courseId' , component:CourseDetailsComponent},
    {path: 'Exams' , component:AllExamsComponent},
    {path: 'NotFound' , component: NotFoundComponent},
    {path: 'addQuestion' , component: AddQuestionComponent},

    {path:'editQuestions/:questionId',component:EditQuestionComponent},
    {path:'addNewQuestion/:examId',component:AddNewQuesComponent},
    {path:'courseStudent/:courseId',component:CourseStudentsComponent},


   {path: '**', redirectTo: 'NotFound', pathMatch: 'full'},
    
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
    AddQuestionComponent,
    CoursesExamComponent,
    EditExamComponent,
    ViewExamQuestionsComponent,
    EditQuestionComponent,
    EventComponent,
    AddCourseComponent,
    EditProfileComponent,
    CourseDetailsComponent,
    AllExamsComponent,
    AddNewQuesComponent,
    CourseStudentsComponent,
    PopupComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatDialogModule,
    RouterModule.forChild(instructorRoutes),
  ],
  bootstrap: [InstructorModule]
})
export class InstructorModule { }
