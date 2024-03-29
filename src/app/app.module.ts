import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';

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
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    MatMenuModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
