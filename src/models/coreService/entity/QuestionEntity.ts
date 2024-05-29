import { QuestionDifficultyEnum } from "../enum/QuestionDifficultyEnum";
import { QuestionTypeEnum } from "../enum/QuestionTypeEnum";
import { AnswerOfQuestion } from "./AnswerOfQuestionEntity";
import { OrganizationEntity } from "./OrganizationEntity";
import { UserEntity } from "./UserEntity";

export interface QuestionEntity {
  id: string;
  organization: OrganizationEntity;
  difficulty: QuestionDifficultyEnum;
  name: string;
  questionText: string;
  generalFeedback: string;
  defaultMark: number;
  pass?: boolean;
  createdBy: UserEntity;
  updatedBy: UserEntity;
  qtype: QuestionTypeEnum;
  answers: AnswerOfQuestion[];
  failureMessages: string[];
  createdAt: Date;
  updatedAt: Date;
}

interface PostAnswer {
  feedback: string;
  fraction: number;
  answer: string;
}

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

  answers: PostAnswer[];

  caseSensitive: boolean;
}

export interface PostEssayQuestion {
  organizationId: string;
  createdBy: string;
  updatedBy: string;
  difficulty: string;
  name: string;
  questionText: string;
  generalFeedback: string | null | undefined;
  defaultMark: number;
  qType: string;

  responseFormat: string;
  responseRequired?: number;
  responseFieldLines: number;
  attachments: number;
  attachmentsRequired?: number;
  graderInfo?: string;
  graderInfoFormat?: number;
  responseTemplate?: string;
  responseTemplateFormat?: number;
  fileTypesList?: string;
  minWordLimit: number;
  maxWordLimit: number;
  maxBytes?: number;
}

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
  single: boolean;
  shuffleAnswers?: boolean;
  correctFeedback?: string;
  partiallyCorrectFeedback?: string;
  incorrectFeedback?: string;
  answerNumbering?: string;
  showNumCorrect?: number;
  showStandardInstructions?: string;
}

export enum MultichocieNumbering {
  abc = 1,
  ABC = 2,
  n123 = 3
}

export interface MultiChoiceQuestion {
  id: string;
  single: boolean;
  question: QuestionEntity;
  shuffleAnswers?: boolean | null | undefined;
  correctFeedback?: string | null | undefined;
  partiallyCorrectFeedback?: string | null | undefined;
  incorrectFeedback?: string | null | undefined;
  answerNumbering?: MultichocieNumbering | null | undefined;
  showNumCorrect?: number | null | undefined;
  showStandardInstructions?: string | null | undefined;
}
