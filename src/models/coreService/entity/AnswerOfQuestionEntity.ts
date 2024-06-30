export interface AnswerOfQuestion {
  id: string;
  questionId: string;
  feedback: string;
  answer: string;
  fraction: number;
}

export interface PutAnswer {
  answerId: string;
  feedback: string;
  answer: string;
  fraction: number;
}
