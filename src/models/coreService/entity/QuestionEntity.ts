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

export interface PostAnswer {
  feedback: string;
  fraction: number;
  answer: string;
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
