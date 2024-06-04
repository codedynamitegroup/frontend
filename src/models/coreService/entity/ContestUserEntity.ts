import { UserEntity } from "./UserEntity";

export interface ContestUserEntity {
  contestId: string;
  user: UserEntity;
  isCompleted?: boolean;
  createdAt: string;
}
