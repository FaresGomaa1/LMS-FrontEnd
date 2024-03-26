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
import { StudentExamFormComponent } from './student-exam-form/student-exam-form.component';
import { AuthGuard } from './guard/auth.guard';

const routes: Routes = [
<<<<<<< HEAD
 // { path: '', redirectTo: 'login', pathMatch: 'full' },
=======
  { path: '', redirectTo: 'shared', pathMatch: 'full' },
>>>>>>> 141bc0baa990e0efb2a4311b7f9e481658c0d790
  {
    path: 'shared',
    component: SharedViewComponent,
    //canActivate: [AuthGuard],

    children: [
      { path: '', redirectTo: 'home', pathMatch: 'full' },
      { path: 'home', component: HomeComponent },
      { path: 'exam', component: ExamsComponent },
      { path: 'event', component: EventsComponent },
      { path: 'course', component: CourseComponent },
    ],
  },
  { path: 'login', component: LogInComponent },
  {
    path: 'coursedetails/:id',
    component: CourseDetailsComponent,
   // canActivate: [AuthGuard],
  },
  {
    path: 'instructor',
    loadChildren: () =>
      import('./instructor/instructor.module').then((m) => m.InstructorModule),
   // canActivate: [AuthGuard],
  },
  { path: 'studentexamform', component: StudentExamFormComponent },
  { path: '**', component: NotFoundComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
