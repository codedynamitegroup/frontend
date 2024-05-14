import { QuestionDifficultyEnum } from "../enum/QuestionDifficultyEnum";
import { QuestionTypeEnum } from "../enum/QuestionTypeEnum";
import { OrganizationEntity } from "./OrganizationEntity";
import { UserEntity } from "./UserEntity";

export interface QuestionEntity {
  id: string;
  // TODO: Add missing properties
  organization: OrganizationEntity;
  difficulty: QuestionDifficultyEnum;
  name: string;
  questionText: string;
  generalFeedback: string;
  defaultMark: number;
  createdBy: UserEntity;
  updatedBy: UserEntity;
  qtype: QuestionTypeEnum;
  failureMessages: string[];
  createdAt: string;
  updatedAt: string;
}
