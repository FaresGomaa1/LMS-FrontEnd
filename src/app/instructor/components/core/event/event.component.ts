import { Component, OnInit } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { ICourse } from 'src/app/instructor/interface/i-course';
import { IEvent } from 'src/app/instructor/interface/i-event';
import { EventService } from 'src/app/instructor/service/event.service';

@Component({
  selector: 'app-event',
  templateUrl: './event.component.html',
  styleUrls: ['./event.component.scss']
})
export class EventComponent implements OnInit {
  events: IEvent[] | undefined;
  sortedEvents : any;
  constructor(private eventService: EventService ) { }
  course!: ICourse;

  ngOnInit(): void {
    const token = localStorage.getItem(this.tokenKey);
    if (token) {
      const helper = new JwtHelperService();
      const decodedToken = helper.decodeToken(token);
      this.userId = decodedToken.nameid;}
    this.loadEvents();
  }

  isEventPast(event: IEvent): boolean {
    const currentDate = new Date();
    const endDate = new Date(event.end_Date);
    return endDate < currentDate;
  }

    tokenKey = 'auth_token';
    userId: number = 0;
  loadEvents() {  

    if (this.userId) {
      this.eventService.getEventsByInstructorCourses(this.userId).subscribe(  
        events => {
          this.events = events;
          
          this.sortedEvents = this.events.sort((a, b) => new Date(b.start_Date).getTime() - new Date(a.start_Date).getTime());
          console.log(this.events);
        },
        error => {
          console.log("error");
        }
      );
    } else {
      console.log("User ID not found");
    }

  }
  isEventFuture(event: IEvent): boolean {
    const currentDate = new Date();
    const startDate = new Date(event.start_Date); 
    return startDate > currentDate;
  }
  
  openEventLink(event: IEvent): void {
    if (!this.isEventFuture(event)) {
      window.open(event.hyperLink, '_blank');
    }
  }


  
}
