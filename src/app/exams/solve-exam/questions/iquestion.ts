export interface IQuestion {
    id: number;
    question: string;
    questionType: string;
    correctAnswer: string;
    exam_ID: number;
    examName: string;
    choosesIDs: number[];
    choosesName: string[];
}
