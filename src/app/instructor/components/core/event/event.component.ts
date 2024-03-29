import { Component, OnInit } from '@angular/core';
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
  constructor(private eventService: EventService) { }

  ngOnInit(): void {
    this.loadEvents();
  }

  isEventPast(event: IEvent): boolean {
    const currentDate = new Date();
    const endDate = new Date(event.end_Date);
    return endDate < currentDate;
  }

  loadEvents() {  
    this.eventService.getEvents().subscribe(
      events => {  
        this.events = events; 
        
    this.sortedEvents = this.events.sort((a, b) => new Date(b.start_Date).getTime() - new Date(a.start_Date).getTime()); 
        console.log(this.events);
      },
      error => {
        console.log("error");
      }
    );
  }

  
}
