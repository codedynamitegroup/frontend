import { UserEntity } from "./UserEntity";

export interface ReviewEntity {
  reviewId: string;
  certificateCourseId: string;
  content: string;
  rating: number;
  createdBy: UserEntity;
  updatedBy: UserEntity;
  createdAt: string;
  updatedAt: string;
}
