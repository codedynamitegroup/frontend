export interface CreateAnnoucementCommand {
  courseId: string;
  content: string;
  title: string;
  isPublished: boolean;
  createdBy: string;
}
