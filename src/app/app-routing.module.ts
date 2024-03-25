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
// import { AuthGuard } from './guard/auth.guard';

const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  {
    path: 'shared',
    component: SharedViewComponent,
<<<<<<< HEAD
    // canActivate: [AuthGuard],
=======
    canActivate: [AuthGuard],
>>>>>>> 10982a15a856117093fe29a76ece16742c6b7b7c
    children: [
      { path: '', redirectTo: 'home', pathMatch: 'full' },
      { path: 'home', component: HomeComponent },
      { path: 'exam', component: ExamsComponent },
      { path: 'event', component: EventsComponent },
      { path: 'course', component: CourseComponent },
    ],
<<<<<<< HEAD
  },
  { path: 'login', component: LogInComponent },
  { path: 'coursedetails/:id', component: CourseDetailsComponent },
  {
    path: 'instructor',
    loadChildren: () =>
      import('./instructor/instructor.module').then((m) => m.InstructorModule),
  },
  { path: 'studentexamform', component: StudentExamFormComponent },
=======
  },
  { path: 'login', component: LogInComponent},
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
>>>>>>> 10982a15a856117093fe29a76ece16742c6b7b7c
  { path: '**', component: NotFoundComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
