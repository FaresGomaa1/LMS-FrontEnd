import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { ICourse } from 'src/app/instructor/interface/i-course';
import { IExam } from 'src/app/instructor/interface/i-exam';
import { IInstructor } from 'src/app/instructor/interface/i-instructor';
import { ExamService } from 'src/app/instructor/service/exam.service';

@Component({
  selector: 'app-all-exams',
  templateUrl: './all-exams.component.html',
  styleUrls: ['./all-exams.component.scss']
})
export class AllExamsComponent implements OnInit {

  exams: IExam[] | undefined;
  tokenKey = 'auth_token';
  userId: number = 0;
  constructor(private route: ActivatedRoute, private examService: ExamService) { }

  ngOnInit(): void {
    const token = localStorage.getItem(this.tokenKey);
    if (token) {
      const helper = new JwtHelperService();
      const decodedToken = helper.decodeToken(token);
      this.userId = decodedToken.nameid;
    }
    this.loadExams();
  }


  

  deleteExam(id: number) {
    if (confirm('Are you sure you want to delete this question?')) {
    this.examService.deleteExam(id)
      .subscribe(() => {
        console.log(`Exam with ID ${id} deleted successfully.`);
        
        this.loadExams();
      }, error => {
        console.error('Error deleting question:', error);
      });}
  }

 
  public instructor: IInstructor | undefined;
  loadExams() {
    const examsForInstructor = getExamsForInstructor(this.userId);
    console.log(examsForInstructor);
  }
  
  }

  const instructors: IInstructor[] = [];  
const courses: ICourse[] = [];  
const exams: IExam[] = [];  

// Function to get all exams for a given instructor ID
function getExamsForInstructor(instructorId: number): IExam[] {
    const instructor = instructors.find(instructor => instructor.id == instructorId);
    if (!instructor) return []; 
    
    const instructorCourseNames = instructor.courseName;
    const instructorExams: IExam[] = [];
    
    instructorCourseNames.forEach(courseName => {
        const course = courses.find(course => course.name == courseName);
        if (course) {
            const examsForCourse = exams.filter(exam => exam.course_ID == course.id);
            instructorExams.push(...examsForCourse);
        }
    });
    
    return instructorExams;
}
