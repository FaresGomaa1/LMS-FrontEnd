import { Component } from '@angular/core';
import { IEvent } from 'src/app/instructor/interface/i-event';
import { EventService } from 'src/app/instructor/service/event.service';

@Component({
  selector: 'app-event',
  templateUrl: './event.component.html',
  styleUrls: ['./event.component.scss']
})
export class EventComponent {
  events: IEvent[] = [];
  studentEventIds: number[] = [1,2];

  constructor(private eventService: EventService) { }

  ngOnInit(): void {
    this.getAllEvents();
  }

  getAllEvents(): void {
    this.eventService.getEvents().subscribe((events: IEvent[]) =>
      this.events = events.filter(event => this.studentEventIds.includes(event.id))
    );
  }
}
