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
  qtype: string;
}

export interface GetQuestionExam {
  id: string;
  difficulty: string;
  name: string;
  questionText: string;
  page: number;
  qtype: string;
}
