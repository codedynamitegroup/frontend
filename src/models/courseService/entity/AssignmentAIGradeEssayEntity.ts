export interface AssignmentAIGradeEssayEntity {
  id: string;
  question: string;
  status: AssignmentAIGradeEssayStatus;
  feedbackLanguage: string;
  feedbackSubmissions: string;
  createdAt: string;
}

export enum AssignmentAIGradeEssayStatus {
  PENDING = "PENDING",
  SUCCESS = "SUCCESS",
  FAILED = "FAILED"
}
