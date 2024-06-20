import { TopicEntity } from "../entity/TopicEntity";
import { SkillLevelEnum } from "../enum/SkillLevelEnum";

export interface CreateCertificateCourseCommand {
  name: string;
  description: string;
  skillLevel: SkillLevelEnum;
  thumbnailUrl: string;
  startTime: string;
  endTime?: string;
  topic: TopicEntity;
}

export interface CreateCertificateCourseWithAllAttributeCommand {
  name: string;
  email: string;
  description?: string;
  skillLevel: string;
  topicId: string;
  startTime: string;
  endTime?: string;
  chapters: CreateCertificateCourseChapter[];
}

interface CreateCertificateCourseChapter {
  title: string;
  no: number;
  description?: string;
  resources: CreateCertificateCourseChapterResource[];
}

interface CreateCertificateCourseChapterResource {
  no: number;
  title: string;
  resourceType: string;
  questionId?: string;
  lessonHtml?: string;
  lessonVideo?: string;
}
