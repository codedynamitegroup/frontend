export interface QuestionSubmission {
  userId: string;
  examSubmissionId: string;
  questionId: string;
  passStatus: number;
  grade: number;
  content: string;
  rightAnswer: string;
  numFile: number;
  flag: boolean;
  answerStatus: boolean;
}

// Submit all
export interface SubmitQuestionList {
  examId: string;
  userId: string;
  questionSubmissionCommands: SubmitQuestion[];
}

export interface SubmitQuestion {
  questionId: string;
  content: string;
  files: SubmitQuestionFile[];
  answerStatus: boolean;
  flag: boolean;
}

export interface SubmitQuestionFile {
  fileUrl: string;
  fileName: string;
  fileSize: number;
  fileType: string;
}

export interface GetSubmittedQuestionFile {
  id: string;
  fileName: string;
  fileSize: number;
  fileType: string;
}

export interface GetQuestionSubmissionCommand {
  examId: string;
  userId: string;
  questionSubmissionIds: string[];
}

export interface GetQuestionSubmissionEntity {
  questionId: string;
  passStatus: number;
  grade: number;
  content: string;
  rightAnswer: string;
  files: GetSubmittedQuestionFile[];
  flag: boolean;
  answerStatus: boolean;
  feedback: string;
}

export interface GetQuestionSubmissionResponse {
  questionSubmissions: GetQuestionSubmissionEntity[];
}

export interface SubmissionDetail {
  examSubmissionId: string;
  examId: string;
  userId: string;
  startTime: Date;
  submitTime: Date;
  status: string;
  courseId: string;
  courseName: string;
  name: string;
  intro: string;
  attemptCount: number;
  maxScores: number;
  questionSubmissionResponses: GetQuestionSubmissionEntity[];
}
