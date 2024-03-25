import { Component, OnInit } from '@angular/core';
import { EventService } from './event.service';
import { IEvent } from './ievent';

@Component({
  selector: 'app-events',
  templateUrl: './events.component.html',
  styleUrls: ['./events.component.scss']
})
export class EventsComponent implements OnInit {
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