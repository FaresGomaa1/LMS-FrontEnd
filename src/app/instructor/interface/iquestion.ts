export interface IQuestion {
  id: number;               
  question: string;       
  questionType: string;     
  correctAnswer: string;    
  exam_ID: number;        
  examName?: string;       
  chooseOne: string;       
  chooseTwo: string;       
  chooseThree: string;     
  chooseFour: string;      
}
