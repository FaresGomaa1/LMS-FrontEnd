import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { TrialComponent } from './trial/trial.component';
import { NavbarComponent } from './components/shared/navbar/navbar.component';
import { FooterComponent } from './components/shared/footer/footer.component';
import { HomeComponent } from './components/core/home/home.component';
import { InstructorCoursesComponent } from './components/core/instructor-courses/instructor-courses.component';
import { ProfileComponent } from './components/core/profile/profile.component';

const instructorRoutes: Routes = [
{path:'trial', component: TrialComponent}

];

@NgModule({
  declarations: [
    TrialComponent,
    NavbarComponent,
    FooterComponent,
    HomeComponent,
    InstructorCoursesComponent,
    ProfileComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(instructorRoutes),
  ]
})
export class InstructorModule { }
