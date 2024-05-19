export interface QuestionEntity {
  id: string;
  organizationId: string;
  difficulty: string;
  name: string;
  questionText: string;
  generalFeedback: string;
  defaultMark: number;
  createdAt: string;
  updatedAt: string;
  message: string;
}
