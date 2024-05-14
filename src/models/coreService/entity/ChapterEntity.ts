import { UserEntity } from "./UserEntity";

export interface ChapterEntity {
  chapterId: string;
  certificateCourseId: string;
  no: number;
  title: string;
  description: string;
  questions: [];
  createdBy: UserEntity;
  createdAt: string;
  updatedAt: string;
  updatedBy: UserEntity;
}
