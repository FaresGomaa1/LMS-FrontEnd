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
    this.loadEvents(); // Corrected method name
  }

  events: IEvent[] | undefined; // Corrected property name

  loadEvents() { // Corrected method name
    this.eventService.getEvents().subscribe(
      events => { // Corrected variable name
        this.events = events; // Corrected variable name
        console.log(this.events);
      },
      error => {
        console.log("error");
      }
    );
  }
}
