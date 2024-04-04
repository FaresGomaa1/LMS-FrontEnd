import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatPaginatorModule } from '@angular/material/paginator';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ExamsComponent } from './exams/exams.component';
import { EventsComponent } from './events/events.component';
import { LogInComponent } from './log-in/log-in.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { HomeComponent } from './home/home.component';
import { SharedViewComponent } from './shared-view/shared-view.component';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { CourseComponent } from './course/course.component';
import { CourseDetailsComponent } from './course/course-details/course-details.component';
import { ProfileComponent } from './profile/profile.component';
import { DurationToMinutesPipe } from './exams/duration-to-minutes.pipe';
import { SolveExamComponent } from './exams/solve-exam/solve-exam.component';
import { QuestionsComponent } from './exams/solve-exam/questions/questions.component';
import { SignUpComponent } from './log-in/sign-up/sign-up.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatMenuModule } from '@angular/material/menu';
import { StudentEditComponent } from './profile/student-edit/student-edit.component';
import { AllCoursesComponent } from './course/all-courses/all-courses.component';
import { InstructorProfileComponent } from './instructor-profile/instructor-profile.component';
import { NoneEnrolledCoursesComponent } from './course/none-enrolled-courses/none-enrolled-courses.component';
import { LandingPageComponent } from './landing-page/landing-page.component';
@NgModule({
  declarations: [
    AppComponent,
    ExamsComponent,
    EventsComponent,
    LogInComponent,
    NotFoundComponent,
    HomeComponent,
    SharedViewComponent,
    HeaderComponent,
    FooterComponent,
    CourseComponent,
    CourseDetailsComponent,
    ProfileComponent,
    DurationToMinutesPipe,
    SolveExamComponent,
    QuestionsComponent,
    SignUpComponent,
    StudentEditComponent,
    AllCoursesComponent,
    InstructorProfileComponent,
    NoneEnrolledCoursesComponent,
    LandingPageComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    MatMenuModule,
    FormsModule,
    MatSnackBarModule,
    MatPaginatorModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
