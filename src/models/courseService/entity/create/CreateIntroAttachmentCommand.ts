export interface CreateIntroAttachmentCommand {
  assignmentId?: string;
  fileName: string;
  fileSize: number;
  fileUrl: string;
  mimeType: string;
  timeModified: string;
}
