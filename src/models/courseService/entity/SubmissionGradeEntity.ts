export interface SubmissionGradeEntity {
  id: string;
  grade: number;
  timeCreated: Date;
  timeModified: Date;
}

export interface GradeSubmission {
  examSubmissionId: string;
  questionId: string;
  grade: number;
  rightAnswer: string;
}