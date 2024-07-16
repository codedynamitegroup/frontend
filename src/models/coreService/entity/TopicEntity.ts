import { ProgrammingLanguageEntity } from "./ProgrammingLanguageEntity";
import { UserEntity } from "./UserEntity";

export interface TopicEntity {
  topicId: string;
  name: string;
  description: string;
  isSingleProgrammingLanguage: boolean;
  programmingLanguages: ProgrammingLanguageEntity[];
  numOfCertificateCourses: number;
  thumbnailUrl: string;
  createdBy: UserEntity;
  createdAt: string;
  updatedAt: string;
  updatedBy: UserEntity;
}

export interface PostTopicEntity {
  name: string;
  description: string;
  thumbnailUrl: string;
  isSingleProgrammingLanguage: boolean;
  programmingLanguageIds: string[];
  createdBy: string;
  updatedBy: string;
}
