export interface ContestQuestionEntity {
  questionId: string;
  codeQuestionId: string;
  difficulty: string;
  name: string;
  questionText: string;
  defaultMark: number;
  maxGrade: number;
  grade?: number;
  numOfSubmissions?: number;
  doTime?: number;
}
