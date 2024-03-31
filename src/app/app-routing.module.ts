import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ExamsComponent } from './exams/exams.component';
import { EventsComponent } from './events/events.component';
import { LogInComponent } from './log-in/log-in.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { HomeComponent } from './home/home.component';
import { SharedViewComponent } from './shared-view/shared-view.component';
import { CourseComponent } from './course/course.component';
import { CourseDetailsComponent } from './course/course-details/course-details.component';
import { AuthGuard } from './guard/auth.guard';
import { ProfileComponent } from './profile/profile.component';
import { SolveExamComponent } from './exams/solve-exam/solve-exam.component';
import { QuestionsComponent } from './exams/solve-exam/questions/questions.component';
import { StudentEditComponent } from './profile/student-edit/student-edit.component';

const routes: Routes = [
  { path: '', redirectTo: 'shared', pathMatch: 'full' },
  {
    path: 'shared',
    component: SharedViewComponent,
    canActivate: [AuthGuard],

    children: [
      { path: '', redirectTo: 'home', pathMatch: 'full' },
      { path: 'home', component: HomeComponent },
      { path: 'exam', component: ExamsComponent },
      { path: 'event', component: EventsComponent },
      { path: 'course', component: CourseComponent },
      { path: 'profile', component: ProfileComponent },
      { path: 'editProfile/:id', component: StudentEditComponent },
    ],
  },
  { path: 'login', component: LogInComponent },
  { path: 'instructions/:id', component: SolveExamComponent },
  { path: 'startExam/:id', component: QuestionsComponent },
  {
    path: 'coursedetails/:id',
    component: CourseDetailsComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'instructor',
    loadChildren: () =>
      import('./instructor/instructor.module').then((m) => m.InstructorModule),
    canActivate: [AuthGuard],
  },
  { path: '**', component: NotFoundComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
