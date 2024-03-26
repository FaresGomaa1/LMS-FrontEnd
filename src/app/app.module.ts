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
import { StudentExamFormComponent } from './student-exam-form/student-exam-form.component';
import { ProfileComponent } from './profile/profile.component';

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
    StudentExamFormComponent,
    ProfileComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    ReactiveFormsModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
