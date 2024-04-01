export interface ICourse {
      id: number;
    name: string;
    description: string;
    start_Date: Date;
    end_Date: Date;
    numOfExam: number;
    material: string;
    userAttachmentPath?: string;
    imageFile: File;
}
