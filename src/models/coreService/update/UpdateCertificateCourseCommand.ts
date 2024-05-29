import { TopicEntity } from "../entity/TopicEntity";
import { UserEntity } from "../entity/UserEntity";
import { SkillLevelEnum } from "../enum/SkillLevelEnum";

export interface UpdateCertificateCourseCommand {
  name?: string;
  description?: string;
  skillLevel?: SkillLevelEnum;
  startTime?: string;
  endTime?: string;
  topic?: TopicEntity;
  updatedBy?: UserEntity;
}
