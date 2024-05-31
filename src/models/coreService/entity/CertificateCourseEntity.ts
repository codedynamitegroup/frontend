import { SkillLevelEnum } from "../enum/SkillLevelEnum";
import { QuestionEntity } from "./QuestionEntity";
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
  numOfQuestions: number;
  numOfCompletedQuestions?: number;
  numOfReviews: number;
  currentQuestion?: QuestionEntity;
  isRegistered?: boolean;
  createdBy: UserEntity;
  createdAt: string;
  updatedAt: string;
  updatedBy: UserEntity;
}
