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
import { InstructorProfileComponent } from './instructor-profile/instructor-profile.component';
import { AllCoursesComponent } from './course/all-courses/all-courses.component';
import { NoneEnrolledCoursesComponent } from './course/none-enrolled-courses/none-enrolled-courses.component';
import { LandingPageComponent } from './landing-page/landing-page.component';
import { InstructorSignUpComponent } from './log-in/instructor-sign-up/instructor-sign-up.component';
import { checkUserRoleGuard } from './guard/check-user-role.guard';

const routes: Routes = [
  { path: '', redirectTo: 'landingPage', pathMatch: 'full' },
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
      { path: 'instructorProfile/:id', component: InstructorProfileComponent },
      { path: 'allCourses', component: AllCoursesComponent },
    ],
  },
  { path: 'login', component: LogInComponent },
  { path: 'instructorSignUp', component: InstructorSignUpComponent },
  { path: 'instructions/:id', component: SolveExamComponent },
  { path: 'startExam/:id', component: QuestionsComponent,canActivate: [AuthGuard] },
  { path: 'landingPage', component: LandingPageComponent },
  {
    path: 'coursedetails/:id',
    component: CourseDetailsComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'nonEnrolledCourses/:id',
    component: NoneEnrolledCoursesComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'instructor',
    loadChildren: () =>
      import('./instructor/instructor.module').then((m) => m.InstructorModule),
    canActivate: [AuthGuard],
  },
 { path: '**', component: NotFoundComponent , canActivate: [checkUserRoleGuard] },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
