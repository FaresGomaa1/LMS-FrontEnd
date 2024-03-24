import { Component, OnInit } from '@angular/core';
import { EventService } from './event.service';
import { IEvent } from './ievent';

@Component({
  selector: 'app-events',
  templateUrl: './events.component.html',
  styleUrls: ['./events.component.scss']
})
export class EventsComponent implements OnInit {
  event!: IEvent;

  constructor(private eventService: EventService) { }

  ngOnInit(): void {
    this.loadEventData();
  }

  loadEventData(): void {
    const eventId = 1; // You need to fetch event ID from somewhere
    this.eventService.getEventById(eventId)
      .subscribe(event => this.event = event);
  }
}
