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
  createdAt: Date;
  updatedAt: Date;
}

interface GetOrganization {
  id: string;
  name: string;
}
interface GetUser {
  userId: string;
  firstName: string;
  lastName: string;
}
export interface GetQuestion {
  id: string;
  organization: GetOrganization;
  difficulty: string;
  name: string;
  questionText: string;
  generalFeedback: string;
  defaultMark: number;
  createdBy: GetUser;
  updatedBy: GetUser;
  qtype: string;
  answers?: AnswerOfQuestion[];
  createdAt: string;
  updatedAt: string;
}

export interface PutQuestion {
  difficulty?: string;
  name: string;
  questionText: string;
  generalFeedback?: string;
  defaultMark?: number;
  updatedBy: string;
  answers: PutAnswer[];
}

export interface PutAnswer {
  answerId: string;
  feedback: string;
  answer: string;
  fraction: number;
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
  questionBankCategoryId?: string;
  isOrgQuestionBank?: boolean;
  answers: PostAnswer[];
  caseSensitive: boolean;
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

export interface ShortAnswerQuestion {
  id: string;
  question: GetQuestion;
  caseSensitive: boolean;
}

export interface PostQuestionDetail {
  questionId: string;
  qtype: string;
}

export interface PostQuestionDetailList {
  questionCommands: PostQuestionDetail[];
}

export interface QuestionClone {
  questionId: string;
  qtype?: string;
}

export interface QuestionCloneRequest {
  questions: QuestionClone[];
}

export interface CodeQuestion {
  id: string;
  question: GetQuestion;
  dslTemplate: string;
  isPublic: boolean;
  maxGrade: number;
}
