import { UserResponseEntity } from "models/courseService/entity/UserResponseEntity";
import { QuestionDifficultyEnum } from "../enum/QuestionDifficultyEnum";
import { QuestionTypeEnum } from "../enum/QuestionTypeEnum";

export interface ChapterQuestionEntity {
  id: string;
  codeQuestionId: string;
  difficulty: QuestionDifficultyEnum;
  name: string;
  questionText: string;
  generalFeedback: string;
  defaultMark: number;
  pass: boolean;
  createdBy: UserResponseEntity;
  updatedBy: UserResponseEntity;
  qtype: QuestionTypeEnum;
  createdAt: string;
  updatedAt: string;
}
