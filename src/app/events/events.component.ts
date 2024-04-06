import { StudentService } from './../generalServices/student.service';
import { CourseService } from '../course/course.service';
import { Component, OnInit } from '@angular/core';
import { EventService } from './event.service';
import { IEvent } from './ievent';
import { ICourses } from '../course/icourses';
import { JwtHelperService } from '@auth0/angular-jwt';

@Component({
  selector: 'app-events',
  templateUrl: './events.component.html',
  styleUrls: ['./events.component.scss'],
})
export class EventsComponent implements OnInit {
  tokenKey = 'auth_token';
  events: IEvent[] = [];
  // studentEventIds: number[] = [1,2];
  courses: ICourses[] = [];

  constructor(
    private eventService: EventService,
    private courseService: CourseService,
    private studentService: StudentService
  ) {}

  ngOnInit(): void {
    this.getStudent();
  }

  getAllEvents(): void {
    this.eventService.getEvents().subscribe((events: IEvent[]) => {
      this.events = events;
    });
  }

  getStudent() {
    this.getAllEvents();
    const token = localStorage.getItem(this.tokenKey); 
    if (token) {
        const helper = new JwtHelperService();
        const decodedToken = helper.decodeToken(token);
        const userId = decodedToken.nameid; 
        this.studentService.getStudentById(userId).subscribe((std) => { 
            
            this.events = this.events.filter((event) => {
                return std.courseIDs.some(courseId => event.coursesIDs.includes(courseId));
               
            });
        });
    }
}
  openEventLink(event: IEvent): void {
    if (!this.isEventFuture(event)) {
      window.open(event.hyperLink, '_blank');
    }
  }
  isEventFuture(event: IEvent): boolean {
    const currentDate = new Date();
    const startDate = new Date(event.start_Date); 
    return startDate > currentDate;
  }
  
  isEventPast(event: IEvent): boolean {
    const currentDate = new Date();
    const endDate = new Date(event.end_Date);
    return endDate < currentDate;
  }
}
