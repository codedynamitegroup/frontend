import { GetQuestion, PostAnswer } from "./QuestionEntity";

export interface PostMultipleChoiceQuestion {
  organizationId: string;
  createdBy: string;
  updatedBy: string;
  difficulty: string;
  name: string;
  questionText: string;
  generalFeedback: string | null | undefined;
  defaultMark: number;
  qType: string;
  answers?: PostAnswer[];
  questionBankCategoryId?: string;
  isOrgQuestionBank?: boolean;
  single: boolean;
  shuffleAnswers?: boolean;
  correctFeedback?: string;
  partiallyCorrectFeedback?: string;
  incorrectFeedback?: string;
  answerNumbering?: string;
  showNumCorrect?: number;
  showStandardInstructions?: string;
}

export enum MultichoiceNumbering {
  abc = 1,
  ABC = 2,
  n123 = 3
}

export interface MultiChoiceQuestion {
  id: string;
  single: boolean;
  question: GetQuestion;
  shuffleAnswers?: boolean | null | undefined;
  correctFeedback?: string | null | undefined;
  partiallyCorrectFeedback?: string | null | undefined;
  incorrectFeedback?: string | null | undefined;
  answerNumbering?: string | null | undefined;
  showNumCorrect?: number | null | undefined;
  showStandardInstructions?: string | null | undefined;
}
