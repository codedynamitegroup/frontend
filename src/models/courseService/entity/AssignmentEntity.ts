import { AssignmentResourceEntity } from "./AssignmentResourceEntity";

export interface AssignmentEntity {
  id: string;
  moodleId: number;
  title: string;
  intro?: string;
  introAttachments: AssignmentResourceEntity[];
  activity?: string;
  score: number;
  maxScore: number;
  wordLimit: string;
  maxUploadFiles: string;
  maxFileSize: string;
  timeOpen: Date;
  timeClose: Date;
  timeLimit: Date;
  type: string;
  visible: boolean;
}
