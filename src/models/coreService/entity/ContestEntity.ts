import { QuestionEntity } from "./QuestionEntity";
import { UserEntity } from "./UserEntity";

export interface ContestEntity {
  contestId: string;
  name: string;
  description: string;
  thumbnailUrl: string;
  startTime: string;
  endTime: string;
  questions: QuestionEntity[];
  createdBy: UserEntity;
  createdAt: string;
  updatedAt: string;
  updatedBy: UserEntity;
}
