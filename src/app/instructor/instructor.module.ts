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
import { CoursesExamComponent } from './components/core/courses-exam/courses-exam.component';
import { EditExamComponent } from './components/core/edit-exam/edit-exam.component';
import { ViewExamQuestionsComponent } from './components/view-exam-questions/view-exam-questions.component';
import { EditQuestionComponent } from './components/edit-question/edit-question.component';
import { NotFoundComponent } from './components/shared/not-found/not-found.component';
import { EventComponent } from './components/core/event/event.component';


const instructorRoutes: Routes = [
  {path: '', redirectTo: 'shared', pathMatch: 'full'},
  {path:'shared', component: TrialComponent,
  children: [
    { path: 'home', component: HomeComponent },
    { path: 'addExam/:courseId', component: AddExamComponent },
    { path: 'addExam/addQuestion/:exam_Id', component: AddQuestionComponent },
    { path: 'InstructorCourses', component: InstructorCoursesComponent },
    { path: 'CoursesExam/:courseId', component: CoursesExamComponent },
    { path: 'profile', component: ProfileComponent },
    {path:'editExam/:examId',component:EditExamComponent},
    {path:'addQuestion/:examId',component:AddQuestionComponent},
    {path:'editQuestion/:questionId',component:EditQuestionComponent},
    {path:'viewQuestions/:examId',component:ViewExamQuestionsComponent},
    {path:'Events',component:EventComponent},

    {path:'notFound',component:NotFoundComponent},
    {path: '', redirectTo: 'home', pathMatch: 'full'},

    
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
    NotFoundComponent,
    EventComponent,
    
  ],
  imports: [
    CommonModule,
    FormsModule,
    
    ReactiveFormsModule,
    RouterModule.forChild(instructorRoutes),
  ]
})
export class InstructorModule { }
