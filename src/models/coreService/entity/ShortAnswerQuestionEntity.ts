import { GetQuestion, PostAnswer, PutQuestion } from "./QuestionEntity";

export interface PostShortAnswerQuestion {
  organizationId: string;
  createdBy: string;
  updatedBy: string;
  difficulty: string;
  name: string;
  questionText: string;
  generalFeedback: string | null | undefined;
  defaultMark: number;
  qType: string;
  questionBankCategoryId?: string;
  isOrgQuestionBank?: boolean;
  answers: PostAnswer[];
  caseSensitive: boolean;
}

export interface ShortAnswerQuestion {
  id: string;
  question: GetQuestion;
  caseSensitive: boolean;
}

export interface PutShortAnswerQuestion {
  qtShortanswerQuestionId: string;
  caseSensitive?: boolean;
  question?: PutQuestion;
}
