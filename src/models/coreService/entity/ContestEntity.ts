import { ContestQuestionEntity } from "./ContestQuestionEntity";
import { UserEntity } from "./UserEntity";

export interface ContestEntity {
  contestId: string;
  name: string;
  description: string;
  thumbnailUrl: string;
  startTime: string;
  endTime: string;
  questions: ContestQuestionEntity[];
  numOfParticipants: number;
  isRegistered?: boolean;
  createdBy: UserEntity;
  createdAt: string;
  updatedAt: string;
  updatedBy: UserEntity;
}
