import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { TrialComponent } from './trial/trial.component';

const instructorRoutes: Routes = [
{path:'trial', component: TrialComponent}
];

@NgModule({
  declarations: [
    TrialComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(instructorRoutes),
  ]
})
export class InstructorModule { }
