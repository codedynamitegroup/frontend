export interface AssignmentEntity {
  id: string;
  title: string;
  intro: string;
  introFiles: string[];
  introAttachments: string[];
  activity: string;
  activityAttachments: string[];
  score: number;
  maxScore: number;
  timeOpen: string;
  timeClose: string;
  timeLimit: string;
  type: string;
  visible: boolean;
}
