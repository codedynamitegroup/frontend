export interface UpdateCertificateCourseCommand {
  certificateCourseId: string;
  name?: string;
  description?: string;
  skillLevel?: string;
  topicId?: string;
  startTime?: string;
  endTime?: string;
  chapters: UpdateCertificateCourseChapter[];
  email: string;
}

interface UpdateCertificateCourseChapter {
  title: string;
  no: number;
  description: string;
  resources: UpdateCertificateCourseResource[]
}

interface UpdateCertificateCourseResource {
  no: number;
  title: string;
  resourceType: string;
  questionId: string;
  lessonHtml: string;
  lessonVideo: string;
}
