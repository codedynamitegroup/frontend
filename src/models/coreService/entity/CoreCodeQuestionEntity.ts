import { GetQuestion } from "./QuestionEntity";

export interface CoreCodeQuestion {
  dslTemplate: string;
  id: string;
  isAllowedToImport: boolean;
  isPublic: boolean;
  maxGrade: number;
  question: GetQuestion;
}
