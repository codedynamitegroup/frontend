import { ProgrammingLanguageEntity } from "./ProgrammingLanguageEntity";
import { UserEntity } from "./UserEntity";

export interface TopicEntity {
  topicId: string;
  name: string;
  description: string;
  programmingLanguages: ProgrammingLanguageEntity[];
  numOfCertificateCourses: number;
  thumbnailUrl: string;
  createdBy: UserEntity;
  createdAt: string;
  updatedAt: string;
  updatedBy: UserEntity;
}
