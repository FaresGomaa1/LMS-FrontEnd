import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ExamsComponent } from './exams/exams.component';
import { EventsComponent } from './events/events.component';
import { LogInComponent } from './log-in/log-in.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { HomeComponent } from './home/home.component';
import { SharedViewComponent } from './shared-view/shared-view.component';

const routes: Routes = [
  { path: '', redirectTo: 'shared', pathMatch: 'full' },
  { 
    path: 'shared', 
    component: SharedViewComponent, 
    children: [
      { path: '', redirectTo: 'home', pathMatch: 'full' },
      { path: 'home', component: HomeComponent },
      { path: 'exam', component: ExamsComponent },
      { path: 'event', component: EventsComponent }, 
    ]
  },
  { path: 'login', component: LogInComponent }, 
  { path: '**', component: NotFoundComponent },
];
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
