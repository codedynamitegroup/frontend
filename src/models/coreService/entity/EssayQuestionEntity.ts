import { GetQuestion, PutQuestion } from "./QuestionEntity";

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
  questionBankCategoryId?: string;
  isOrgQuestionBank?: boolean;
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

export interface EssayQuestion {
  id: string;
  question: GetQuestion;

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

export interface PutEssayQuestion {
  qtEssayQuestionId: string;
  responseFormat?: string;
  responseRequired?: number;
  responseFieldLines?: number;
  minWordLimit?: number;
  maxWordLimit?: number;
  attachments?: number;
  attachmentsRequired?: number;
  graderInfo?: string;
  graderInfoFormat?: string;
  responseTemplate?: string;
  maxBytes?: number;
  fileTypesList?: string;
  question?: PutQuestion;
}
