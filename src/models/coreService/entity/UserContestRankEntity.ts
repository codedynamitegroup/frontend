import { ContestQuestionEntity } from "./ContestQuestionEntity";
import { UserEntity } from "./UserEntity";

export interface UserContestRankEntity {
  contestId: string;
  user: UserEntity;
  rank: number;
  totalTime: number;
  totalScore: number;
  contestQuestions: ContestQuestionEntity[];
  isCompleted: boolean;
  createdAt: string;
}
