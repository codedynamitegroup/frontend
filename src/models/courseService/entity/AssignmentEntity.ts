import { AssignmentResourceEntity } from "./AssignmentResourceEntity";

export interface AssignmentEntity {
  id: string;
  moodleId: number;
  title: string;
  intro?: string;
  introFiles: AssignmentResourceEntity[];
  introAttachments: AssignmentResourceEntity[];
  activity?: string;
  activityAttachments: AssignmentResourceEntity[];
  score: number;
  maxScore: number;
  timeOpen: Date;
  timeClose: Date;
  timeLimit: Date;
  type: string;
  visible: boolean;
}
