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
