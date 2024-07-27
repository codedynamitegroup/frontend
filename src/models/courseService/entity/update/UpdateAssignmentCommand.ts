export interface UpdateAssignmentCommand {
  title: string;
  sectionId: string;
  intro?: string;
  activity?: string;
  wordLimit?: string;
  maxUploadFiles: string;
  maxFileSize: string;
  maxScore: number;
  timeOpen: string;
  timeClose: string;
  type: string;
  visible: boolean;
  allowSubmitLate: boolean;
}
