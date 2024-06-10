import { SkillLevelEnum } from "../enum/SkillLevelEnum";
import { ChapterResourceEntity } from "./ChapterResourceEntity";
import { TopicEntity } from "./TopicEntity";
import { UserEntity } from "./UserEntity";

export interface CertificateCourseEntity {
  certificateCourseId: string;
  name: string;
  description: string;
  skillLevel: SkillLevelEnum;
  avgRating: number;
  startTime: string;
  endTime: string;
  topic: TopicEntity;
  numOfStudents: number;
  numOfResources: number;
  numOfCompletedResources?: number;
  numOfReviews: number;
  currentResource?: ChapterResourceEntity;
  isRegistered?: boolean;
  createdBy: UserEntity;
  createdAt: string;
  updatedAt: string;
  updatedBy: UserEntity;
}
