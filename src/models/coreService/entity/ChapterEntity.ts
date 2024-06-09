import { ChapterResourceEntity } from "./ChapterResourceEntity";
import { UserEntity } from "./UserEntity";

export interface ChapterEntity {
  chapterId: string;
  certificateCourseId: string;
  no: number;
  title: string;
  description: string;
  resources: ChapterResourceEntity[];
  createdBy: UserEntity;
  createdAt: string;
  updatedAt: string;
  updatedBy: UserEntity;
}
