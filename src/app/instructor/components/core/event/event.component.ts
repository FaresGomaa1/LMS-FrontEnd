import { Component } from '@angular/core';
import { IEvent } from 'src/app/instructor/interface/i-event';
import { EventService } from 'src/app/instructor/service/event.service';

@Component({
  selector: 'app-event',
  templateUrl: './event.component.html',
  styleUrls: ['./event.component.scss']
})
export class EventComponent {
 

  constructor(private eventService: EventService) { }

  ngOnInit(): void {
    this.loadEvents();
  }

  events: IEvent[] | undefined; 
  loadEvents() {  
    this.eventService.getEvents().subscribe(
      events => {  
        this.events = events;  
        console.log(this.events);
      },
      error => {
        console.log("error");
      }
    );
  }
}
